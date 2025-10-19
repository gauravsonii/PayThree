'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getVestedAmount, getAllVestings, formatVestingData, weiToEth, claimVestedTokens } from '@/utils/esopsContractUtils';
import { toast } from 'react-toastify';

interface ESOPData {
  vestedAmount: number;
  totalAmount: number;
  claimableAmount: number;
  vestingData: any;
  vestingProgress: number;
  status: string;
  statusColor: string;
}

interface VestingData {
  employee: string;
  totalAmount: number;
  claimed: number;
  start: number;
  cliff: number;
  duration: number;
  vestedAmount: number;
  unvestedAmount: number;
  cliffReached: boolean;
  fullyVested: boolean;
  claimableAmount: number;
}

export default function MyESOPsPage() {
  const { isConnected, address } = useAccount();
  const [esopData, setEsopData] = useState<ESOPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadMyESOPs();
    }
  }, [isConnected, address]);

    const loadVestingsFromContract = async (): Promise<VestingData[]> => {
    try {
      const [employeeAddresses, vestingData] = await getAllVestings();
      const formattedVestings: VestingData[] = [];
      
      for (let i = 0; i < employeeAddresses.length; i++) {
        const employeeAddress = employeeAddresses[i];
        const vesting = vestingData[i];
        
        if (vesting && employeeAddress !== '0x0000000000000000000000000000000000000000') {
          const formatted = formatVestingData(vesting);
          if (formatted) {
            formattedVestings.push({
              employee: employeeAddress,
              ...formatted
            });
          }
        }
      }
      
      return formattedVestings;
    } catch (error) {
      console.error('Error loading vestings from contract:', error);
      return [];
    }
  };

 const loadMyESOPs = async () => {
  try {
    setLoading(true);
    setError(null);

    const vestings = await loadVestingsFromContract();
    console.log("All Vestings:", vestings);

    // Find current user's vesting data
    const myVesting = vestings.find(
      (v) => v.employee.toLowerCase() === address!.toLowerCase()
    );

    if (!myVesting) {
      setError('No ESOP allocation found');
      setLoading(false);
      return;
    }

    const vestedAmount = weiToEth(Number(myVesting.vestedAmount));
    const totalAmount = weiToEth(Number(myVesting.totalAmount));
    const claimableAmount = weiToEth(Number(myVesting.claimableAmount)) || 0;
    const vestingProgress =
      totalAmount > 0 ? (vestedAmount / totalAmount) * 100 : 0;

    const status = getVestingStatus(myVesting);

    setEsopData({
      vestedAmount,
      totalAmount,
      claimableAmount,
      vestingData: myVesting,
      vestingProgress: Math.round(vestingProgress),
      status: status.status,
      statusColor: status.color,
    });
  } catch (error) {
    console.error('Failed to load ESOP data:', error);
    setError('Failed to load ESOP data');
  } finally {
    setLoading(false);
  }
};


  const getVestingStatus = (vestingData: any) => {
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(vestingData.start) || 0;
    const cliffMonths = Number(vestingData.cliff) || 0;
    const vestingMonths = Number(vestingData.duration) || 0;
    
    const cliffTime = startTime + (cliffMonths * 30 * 24 * 60 * 60);
    const vestingEndTime = startTime + (vestingMonths * 30 * 24 * 60 * 60);
    
    if (now < cliffTime) {
      return { status: 'Cliff Period', color: '' };
    } else if (now >= vestingEndTime) {
      return { status: 'Fully Vested', color: '' };
    } else {
      return { status: 'Vesting', color: '' };
    }
  };

  const handleClaimTokens = async () => {
    if (!esopData || esopData.claimableAmount <= 0) {
      toast.error('No tokens available to claim');
      return;
    }

    try {
      setClaiming(true);
      await claimVestedTokens();
      toast.success('Tokens claimed successfully!');
      // Reload ESOP data
      await loadMyESOPs();
    } catch (error) {
      console.error('Failed to claim tokens:', error);
      toast.error('Failed to claim tokens');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My ESOPs</h2>
          <p className="text-muted-foreground">
            View your ESOP allocation and vesting progress.
          </p>
        </div>
        <LoadingSpinnerFull text="Loading your ESOP data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My ESOPs</h2>
          <p className="text-muted-foreground">
            View your ESOP allocation and vesting progress.
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

  if (!esopData) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My ESOPs</h2>
          <p className="text-muted-foreground">
            View your ESOP allocation and vesting progress.
          </p>
        </div>
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No ESOP allocation found</p>
            <p className="text-sm">Contact your employer to set up an ESOP</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My ESOPs</h2>
        <p className="text-muted-foreground">
          View your ESOP allocation and vesting progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocation</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{esopData.totalAmount.toFixed(4)} tokens</div>
            <p className="text-xs text-muted-foreground">
              Your total ESOP allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vested Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{esopData.vestedAmount.toFixed(4)} tokens</div>
            <p className="text-xs text-muted-foreground">
              {esopData.vestingProgress}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimable</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{esopData.claimableAmount.toFixed(4)} tokens</div>
            <p className="text-xs text-muted-foreground">
              Available to claim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={`${esopData.statusColor} bg-opacity-20`}>
              {esopData.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Vesting status
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vesting Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{esopData.vestingProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${esopData.vestingProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Vested</p>
                  <p className="font-medium text-green-600">{esopData.vestedAmount.toFixed(4)} tokens</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-medium">{(esopData.totalAmount - esopData.vestedAmount).toFixed(4)} tokens</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Vesting Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cliff Period</span>
                <span className="text-sm font-medium">{Number(esopData.vestingData.cliff) || 0} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vesting Period</span>
                <span className="text-sm font-medium">{Number(esopData.vestingData.duration) || 0} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm font-medium">
                  {new Date(Number(esopData.vestingData.start) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="pt-3">
                <Button 
                  onClick={handleClaimTokens}
                  disabled={claiming || esopData.claimableAmount <= 0}
                  className="w-full"
                >
                  {claiming ? 'Claiming...' : `Claim ${esopData.claimableAmount.toFixed(4)} Tokens`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 