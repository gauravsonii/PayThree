'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeApi, payoutApi } from '@/lib/api';
import { Employee, PayoutBatch } from '@/types';
import { Users, DollarSign, TrendingUp, Calendar, Wallet , ExternalLink} from 'lucide-react';
import { getTreasuryBalanceUSD } from '@/utils/mockUSDCUtils';
import { useAccount } from 'wagmi';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';
import { SomniaTestnet } from '@/config';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [treasuryBalance, setTreasuryBalance] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadTreasuryBalance();
    }
  }, [isConnected]);

  const loadTreasuryBalance = async () => {
    try {
      const balance = await getTreasuryBalanceUSD();
      setTreasuryBalance(balance);
    } catch (error) {
      console.error('Error loading treasury balance:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [employeesData, batchesData] = await Promise.all([
        employeeApi.getAll(),
        payoutApi.getBatches(),
      ]);
      setEmployees(employeesData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSalaries = employees.reduce((sum, emp) => sum + emp.salaryUSD, 0);
  const totalPayouts = batches.reduce((sum, batch) => sum + batch.totalAmount, 0);
  const averageSalary = employees.length > 0 ? totalSalaries / employees.length : 0;

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your employee payouts and ESOP management.
          </p>
        </div>
        <LoadingSpinnerFull text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your employee payouts and ESOP management.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          description="Active employee count"
          icon={Users}
        />
        <StatsCard
          title="Treasury Balance"
          value={`$${treasuryBalance.toLocaleString()}`}
          description="Available for payouts"
          icon={Wallet}
        />
        <StatsCard
          title="Total Payouts"
          value={`$${totalPayouts.toLocaleString()}`}
          description="All-time payout amount"
          icon={DollarSign}
        />
        <StatsCard
          title="Average Salary"
          value={`$${Math.round(averageSalary).toLocaleString()}`}
          description="Annual average"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 flex-1">
        <Card className="col-span-4 min-h-[500px]">
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {employees.slice(0, 5).map((employee) => (
                <div key={employee._id} className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.designation}</p>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    ${employee.salaryUSD.toLocaleString()}
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 min-h-[500px]">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {batches.slice(0, 5).map((batch) => (
               <div key={batch._id} className="flex items-center space-x-4">
  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
    <DollarSign className="h-4 w-4 text-primary" />
  </div>

  <div className="flex-1 space-y-1">
    <p className="text-sm font-medium leading-none text-foreground">
      ${batch.totalAmount.toLocaleString()}
    </p>

    <div className="inline-flex items-center space-x-1 font-mono text-xs text-muted-foreground">
      {/* Only the hash has the tooltip */}
      <span title={batch.txHash}>
        {batch.txHash.slice(0, 6)}...{batch.txHash.slice(-4)}
      </span>

      <a
        href={`${SomniaTestnet.blockExplorers.default.url}/tx/${batch.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  </div>

  <div className="text-xs text-muted-foreground">
    {formatDistanceToNow(new Date(batch.createdAt), { addSuffix: true })}
  </div>
</div>



              ))}
              {batches.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No payout batches found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}