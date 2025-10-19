'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Mail, Wallet } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  selectedEmployees: string[];
  onEmployeeSelect: (employeeId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function EmployeeTable({
  employees,
  selectedEmployees,
  onEmployeeSelect,
  onSelectAll,
}: EmployeeTableProps) {
  const allSelected = employees.length > 0 && selectedEmployees.length === employees.length;
  const someSelected = selectedEmployees.length > 0;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all employees"
              />
            </TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee._id}
              className={`transition-colors ${
                selectedEmployees.includes(employee._id) ? 'bg-muted/50' : ''
              }`}
            >
              <TableCell>
                <Checkbox
                  checked={selectedEmployees.includes(employee._id)}
                  onCheckedChange={(checked) =>
                    onEmployeeSelect(employee._id, checked as boolean)
                  }
                  aria-label={`Select ${employee.name}`}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Mail className="mr-1 h-3 w-3" />
                    {employee.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{employee.designation}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-primary" />
                  <span className="font-medium">
                    ${(employee.salaryUSD).toLocaleString()}/month
                  </span>
                </div>
              </TableCell>
              <TableCell>
               <div
  className="flex items-center text-sm text-muted-foreground"
  title={employee.walletAddress} // shows full address on hover
>
  <Wallet className="mr-1 h-3 w-3" />
  <span className="font-mono">
    {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-4)}
  </span>
</div>

              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(employee.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}