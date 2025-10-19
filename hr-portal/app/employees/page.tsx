'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeForm } from '@/components/employees/employee-form';
import { EmployeeTable } from '@/components/employees/employee-table';
import { PayoutForm } from '@/components/payouts/payout-form';
import { employeeApi } from '@/lib/api';
import { Employee } from '@/types';
import { Users, DollarSign, AlertTriangle, Wallet } from 'lucide-react';
import { getTreasuryBalanceUSD } from '@/utils/mockUSDCUtils';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';

export default function EmployeesPage() {
  const { isConnected } = useAccount();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [treasuryBalance, setTreasuryBalance] = useState(0);

  useEffect(() => {
    loadEmployees();
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

  const loadEmployees = async () => {
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);

    }
  };

  const loadDashboardData = async () => {
  try {
    setLoading(true);
    setSelectedEmployees([]);

    const [balance, employeeList] = await Promise.all([
      getTreasuryBalanceUSD(),
      employeeApi.getAll(),
    ]);

    setTreasuryBalance(balance);
    setEmployees(employeeList);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    setLoading(false);
  }
};


  const handleEmployeeSelect = (employeeId: string, selected: boolean) => {
    if (selected) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedEmployees(employees.map(emp => emp._id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp._id));
  const totalSelectedSalary = selectedEmployeeData.reduce((sum, emp) => sum + emp.salaryUSD, 0);
  const hasInsufficientBalance = totalSelectedSalary > treasuryBalance;

  const payAllEmployees = () => {
    setSelectedEmployees(employees.map(emp => emp._id));
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Employees</h2>
            <p className="text-muted-foreground">
              Manage your employee database and process payouts.
            </p>
          </div>
        </div>
        <LoadingSpinnerFull text="Loading employees..." />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Employees</h2>
          <p className="text-muted-foreground">
            Manage your employee database and process payouts.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <EmployeeForm onEmployeeCreated={loadEmployees} />
          <Button variant="outline" onClick={payAllEmployees}>
            Select All for Payout
          </Button>
        </div>
      </div>

      <Card
  className={`border-primary/20 ${
    hasInsufficientBalance ? 'bg-red-100 border-red-200' : 'bg-primary/5'
  }`}
>
  <CardContent className="p-6 space-y-4">
    {/* Warning Message at Top Left */}
    {hasInsufficientBalance && (
      <div className="flex items-center space-x-2 text-red-700">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Insufficient Balance</span>
      </div>
    )}

    {/* Employees, total, treasury */}
    <div className="flex items-center justify-between">
      <div
        className={`flex items-center space-x-6 ${
          hasInsufficientBalance ? 'text-gray-800' : 'text-foreground'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {selectedEmployees.length} employees selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="font-medium">
            Total monthly: ${totalSelectedSalary.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="font-medium">
            Treasury: ${treasuryBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Buttons / Payout */}
      <div className="flex items-center space-x-4">
        {selectedEmployees.length > 0 ? (
          <>
            <Button variant="outline" onClick={() => setSelectedEmployees([])} className="bg-red-500 hover:bg-red-600">
              Clear Selection
            </Button>

            {hasInsufficientBalance ? (
              <Link href="/treasury">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Wallet className="mr-2 h-4 w-4" />
                  Fund Treasury
                </Button>
              </Link>
            ) : (
              <PayoutForm
                selectedEmployees={selectedEmployeeData}
                onPayoutCreated={loadDashboardData}
                onClearSelection={() => setSelectedEmployees([])}
              />
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            Select employees to process payouts
          </span>
        )}
      </div>
    </div>
  </CardContent>
</Card>



      <Card className="flex-1 min-h-[600px]">
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <EmployeeTable
            employees={employees}
            selectedEmployees={selectedEmployees}
            onEmployeeSelect={handleEmployeeSelect}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
      </Card>
    </div>
  );
}