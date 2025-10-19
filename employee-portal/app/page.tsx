'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeApi, payoutApi } from '@/lib/api';
import { Employee, Payout } from '@/types';
import { DollarSign, TrendingUp, Calendar, Wallet, Gift, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';
import { getVestedAmount, getAllVestings, calculateVestingSchedule, weiToEth, formatVestingData } from '@/utils/esopsContractUtils';
import { SomniaTestnet } from '@/config';

interface EmployeeDashboardData {
  employee: Employee | null;
  payouts: Payout[];
  vestedAmount: number;
  vestingData: any;
  nextPayout: Payout | null;
  lastPayout: Payout | null;
}

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const [data, setData] = useState<EmployeeDashboardData>({
    employee: null,
    payouts: [],
    vestedAmount: 0,
    vestingData: null,
    nextPayout: null,
    lastPayout: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadEmployeeDashboard();
    }
  }, [isConnected, address]);

  const loadEmployeeDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get employee data
      const employee = await employeeApi.getByWalletAddress(address!);
      if (!employee) {
        setError('Employee not found');
        setLoading(false);
        return;
      }

      // Get employee payouts
      const payouts = await payoutApi.getEmployeePayouts(employee._id);

      // Get ESOP data from contract
      let vestedAmount = 0;
      let vestingData = null;

      try {
        // Get all vestings and filter for current user
        const [employeeAddresses, vestingDataArray] = await getAllVestings();
        
        // Find current user's vesting data
        const userIndex = employeeAddresses.findIndex((addr: string) => addr.toLowerCase() === address!.toLowerCase());
        
        if (userIndex !== -1) {
          const userVestingRaw = vestingDataArray[userIndex];
          vestingData = formatVestingData(userVestingRaw);
          
          if (vestingData) {
            vestedAmount = weiToEth(Number(vestingData.vestedAmount));
          }
        }
      } catch (esopError) {
        console.error('Error loading ESOP data:', esopError);
        // ESOP data is optional, continue without it
      }

      // Calculate next and last payout
      const sortedPayouts = payouts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const lastPayout = sortedPayouts.length > 0 ? sortedPayouts[0] : null;
      const nextPayout = sortedPayouts.find(p => p.status === 'pending') || null;

      setData({
        employee,
        payouts,
        vestedAmount,
        vestingData,
        nextPayout,
        lastPayout,
      });
    } catch (error) {
      console.error('Failed to load employee dashboard:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateVestingProgress = () => {
    if (!data.vestingData) return { vested: 0, total: 0, percentage: 0 };
    
    const totalAmount = weiToEth(Number(data.vestingData.totalAmount) || 0);
    const percentage = totalAmount > 0 ? (data.vestedAmount / totalAmount) * 100 : 0;
    
    return {
      vested: data.vestedAmount,
      total: totalAmount,
      percentage: Math.round(percentage)
    };
  };

  const getVestingStatus = () => {
    if (!data.vestingData) return { status: 'No ESOP', color: 'text-muted-foreground' };
    
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(data.vestingData.start) || 0;
    const cliffMonths = Number(data.vestingData.cliff) || 0;
    const vestingMonths = Number(data.vestingData.duration) || 0;
    
    const cliffTime = startTime + (cliffMonths * 30 * 24 * 60 * 60);
    const vestingEndTime = startTime + (vestingMonths * 30 * 24 * 60 * 60);
    
    if (now < cliffTime) {
      return { status: 'Cliff Period', color: 'text-orange-500' };
    } else if (now >= vestingEndTime) {
      return { status: 'Fully Vested', color: 'text-green-500' };
    } else {
      return { status: 'Vesting', color: 'text-blue-500' };
    }
  };

  // Helper for explorer link
  const getExplorerLink = (txHash: string) =>
    `${SomniaTestnet.blockExplorers.default.url}/tx/${txHash}`;

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Employee Dashboard</h2>
          <p className="text-muted-foreground">
            Your personal dashboard with payout and ESOP information.
          </p>
        </div>
        <LoadingSpinnerFull text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Employee Dashboard</h2>
          <p className="text-muted-foreground">
            Your personal dashboard with payout and ESOP information.
          </p>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const vestingProgress = calculateVestingProgress();
  const vestingStatus = getVestingStatus();

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {data.employee?.name}</h2>
        <p className="text-muted-foreground">
          Your personal dashboard with payout and ESOP information.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Monthly Salary"
          value={`$${data.employee?.salaryUSD.toLocaleString()}`}
          description="Your monthly compensation"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Payouts"
          value={`$${data.payouts.reduce((sum, p) => sum + p.amountUSD, 0).toLocaleString()}`}
          description="All-time received"
          icon={Wallet}
        />
        <StatsCard
          title="Vested ESOP"
          value={`${vestingProgress.vested.toFixed(4)} tokens`}
          description={`${vestingProgress.percentage}% of total`}
          icon={Gift}
        />
        <StatsCard
          title="ESOP Status"
          value={vestingStatus.status}
          description="Your vesting status"
          icon={Clock}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 min-h-[500px]">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {data.payouts.slice(0, 5).map((payout) => (
                <div key={payout._id} className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      ${payout.amountUSD.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {payout.status}
                    </p>
                    {typeof payout.batchId === 'object' && payout.batchId.txHash && (
                      <a
                        href={getExplorerLink(payout.batchId.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-blue-600 hover:underline"
                      >
                        {payout.batchId.txHash.slice(0, 10)}...{payout.batchId.txHash.slice(-6)}
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(payout.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
              {data.payouts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No payouts found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 min-h-[500px]">
          <CardHeader>
            <CardTitle>ESOP Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {data.vestingData ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Allocation</span>
                      <span className="font-medium">{vestingProgress.total.toFixed(4)} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vested Amount</span>
                      <span className="font-medium text-green-600">{vestingProgress.vested.toFixed(4)} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vesting Progress</span>
                      <span className="font-medium">{vestingProgress.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${vestingProgress.percentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-medium ${vestingStatus.color}`}>
                        {vestingStatus.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Cliff: {Number(data.vestingData.cliff) || 0} months</p>
                      <p>Vesting: {Number(data.vestingData.duration) || 0} months</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No ESOP allocation found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.nextPayout && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Next Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">${data.nextPayout.amountUSD.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending payout</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-orange-500">{data.nextPayout.status}</p>
              </div>
            </div>
            {typeof data.nextPayout?.batchId === 'object' && data.nextPayout.batchId.txHash && (
              <a
                href={getExplorerLink(data.nextPayout.batchId.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-blue-600 hover:underline block mt-1"
              >
                {data.nextPayout.batchId.txHash.slice(0, 10)}...{data.nextPayout.batchId.txHash.slice(-6)}
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {data.lastPayout && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Last Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">${data.lastPayout.amountUSD.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(data.lastPayout.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-green-500">{data.lastPayout.status}</p>
              </div>
            </div>
            {typeof data.lastPayout?.batchId === 'object' && data.lastPayout.batchId.txHash && (
              <a
                href={getExplorerLink(data.lastPayout.batchId.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-blue-600 hover:underline block mt-1"
              >
                {data.lastPayout.batchId.txHash.slice(0, 10)}...{data.lastPayout.batchId.txHash.slice(-6)}
              </a>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}