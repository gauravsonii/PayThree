'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayoutHistory } from '@/components/payouts/payout-history';
import { employeeApi, payoutApi } from '@/lib/api';
import { Employee, PayoutBatch } from '@/types';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';

export default function PayoutsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, batchesData] = await Promise.all([
        employeeApi.getAll(),
        payoutApi.getBatches(),
      ]);
      setEmployees(employeesData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPayouts = batches.reduce((sum, batch) => sum + batch.totalAmount, 0);
  const averageBatchAmount = batches.length > 0 ? totalPayouts / batches.length : 0;

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Payouts</h2>
            <p className="text-muted-foreground">
              Track and manage employee payment batches.
            </p>
          </div>
        </div>
        <LoadingSpinnerFull text="Loading payout data..." />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Payouts</h2>
          <p className="text-muted-foreground">
            Track and manage employee payment batches.
          </p>
        </div>
        <Button asChild>
          <a href="/employees">
            <Users className="mr-2 h-4 w-4" />
            Manage Employees
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Payouts"
          value={`$${totalPayouts.toLocaleString()}`}
          description="All-time amount"
          icon={DollarSign}
        />
        <StatsCard
          title="Batch Count"
          value={batches.length}
          description="Total transactions"
          icon={Calendar}
        />
        <StatsCard
          title="Average Batch"
          value={`$${Math.round(averageBatchAmount).toLocaleString()}`}
          description="Per transaction"
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Employees"
          value={employees.length}
          description="Eligible for payouts"
          icon={Users}
        />
      </div>

      <div className="flex-1 min-h-[600px]">
        <PayoutHistory />
      </div>
    </div>
  );
}