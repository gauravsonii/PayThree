'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { employeeApi } from '@/lib/api';
import { CreateEmployeeRequest } from '@/types';
import { Plus, User, Mail, Wallet, DollarSign, Briefcase } from 'lucide-react';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  walletAddress: z.string().min(1, 'Wallet address is required'),
  salaryUSD: z.number().min(0, 'Salary must be positive'),
  designation: z.string().min(1, 'Designation is required'),
});

interface EmployeeFormProps {
  onEmployeeCreated: () => void;
}

export function EmployeeForm({ onEmployeeCreated }: EmployeeFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeRequest>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: CreateEmployeeRequest) => {
    setIsSubmitting(true);
    try {
      await employeeApi.create(data);
      reset();
      setOpen(false);
      onEmployeeCreated();
    } catch (error) {
      console.error('Failed to create employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Add New Employee
          </DialogTitle>
          <DialogDescription className="text-sm">
            Create a new employee record with their personal and financial information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Personal Information Section */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-3 w-3 text-blue-600" />
                  <h3 className="text-xs font-semibold">Personal Information</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter employee name"
                      className="h-8 text-sm"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="employee@company.com"
                      className="h-8 text-sm"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information Section */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-3 w-3 text-green-600" />
                  <h3 className="text-xs font-semibold">Professional Information</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="designation" className="text-xs font-medium">Designation</Label>
                    <Input
                      id="designation"
                      {...register('designation')}
                      placeholder="Software Engineer"
                      className="h-8 text-sm"
                    />
                    {errors.designation && (
                      <p className="text-xs text-red-600">{errors.designation.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="salaryUSD" className="text-xs font-medium">Annual Salary (USD)</Label>
                    <Input
                      id="salaryUSD"
                      type="number"
                      {...register('salaryUSD', { valueAsNumber: true })}
                      placeholder="50000"
                      className="h-8 text-sm"
                    />
                    {errors.salaryUSD && (
                      <p className="text-xs text-red-600">{errors.salaryUSD.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blockchain Information Section */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-3 w-3 text-purple-600" />
                <h3 className="text-xs font-semibold">Blockchain Information</h3>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="walletAddress" className="text-xs font-medium">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  {...register('walletAddress')}
                  placeholder="0x..."
                  className="h-8 font-mono text-xs"
                />
                {errors.walletAddress && (
                  <p className="text-xs text-red-600">{errors.walletAddress.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  This address will be used for token payouts and ESOP distributions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 h-8 text-sm"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-8 text-sm" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-3 w-3" />
                  Create Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}