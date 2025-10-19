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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateESOPRequest, Employee } from '@/types';
import { addEmployeeToESOP, ethToWei } from '@/utils/esopsContractUtils';
import { TrendingUp, User, Calendar, Award, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/config';
import { toast } from 'react-toastify';

const esopSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  tokenAmount: z.number().min(0.001, 'Min amount is 0.001'),
  vestingStart: z.string().min(1, 'Vesting start date is required'),
  cliffMonths: z.number().min(0, 'Cliff months must be non-negative'),
  vestingMonths: z.number().min(1, 'Vesting months must be positive'),
});

interface ESOPPayload {
  employeeId: string;
  totalTokens: number;
  duration: number;
  cliff: number;
  start: number;
}

interface ESOPFormProps {
  employees: Employee[];
  onESOPCreated: (payload: ESOPPayload) => Promise<void> | void;
}

export function ESOPForm({ employees, onESOPCreated }: ESOPFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateESOPRequest>({
    resolver: zodResolver(esopSchema),
  });

  const onSubmit = async (data: CreateESOPRequest) => {
    setIsSubmitting(true);
    try {
      // Find the employee to get their wallet address
      const employee = employees.find(emp => emp._id === data.employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Convert date to timestamp
      const startTime = Math.floor(new Date(data.vestingStart).getTime() / 1000);
      
      // Convert ETH to wei
      const tokenAmountInWei = ethToWei(data.tokenAmount);
      
      // Call the smart contract
      const tx= await addEmployeeToESOP(
        employee.walletAddress,
        startTime,
        data.cliffMonths,
        data.vestingMonths,
        tokenAmountInWei
      );

     
      
    
      // await tx.wait();
      const receipt = await waitForTransactionReceipt(config, {
          hash: tx as `0x${string}`
          
        })
console.log('Transaction receipt:', receipt);
         await onESOPCreated({
      employeeId: data.employeeId,
      totalTokens: data.tokenAmount,
      duration: data.vestingMonths,
      cliff: data.cliffMonths,
      start: startTime
    });
     

      reset();
      setOpen(false);
    toast.success('ESOP granted successfully');

    } catch (error) {
      console.error('Failed to create ESOP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          Grant ESOP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Grant ESOP
          </DialogTitle>
          <DialogDescription className="text-sm">
            Grant equity stock options to an employee with vesting schedule.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Employee Selection Section */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-3 w-3 text-primary" />
                  <h3 className="text-xs font-semibold">Employee Selection</h3>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="employeeId" className="text-xs font-medium">Select Employee</Label>
                  <Select onValueChange={(value) => setValue('employeeId', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Choose an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee._id} value={employee._id}>
                          {employee.name} - {employee.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && (
                    <p className="text-xs text-red-600">{errors.employeeId.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Token Allocation Section */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-3 w-3 text-primary" />
                  <h3 className="text-xs font-semibold">Token Allocation</h3>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="tokenAmount" className="text-xs font-medium">Token Amount (ETH)</Label>
                  <Input
                    id="tokenAmount"
                    type="number"
                    step="0.000001"
                    {...register('tokenAmount', { valueAsNumber: true })}
                    placeholder="1.0"
                    className="h-8 text-sm"
                  />
                  {errors.tokenAmount && (
                    <p className="text-xs text-red-600">{errors.tokenAmount.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Total tokens to be granted (in ETH)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vesting Schedule Section */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-3 w-3 text-primary" />
                <h3 className="text-xs font-semibold">Vesting Schedule</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="vestingStart" className="text-xs font-medium">Start Date</Label>
                  <Input
                    id="vestingStart"
                    type="date"
                    {...register('vestingStart')}
                    className="h-8 text-sm"
                  />
                  {errors.vestingStart && (
                    <p className="text-xs text-red-600">{errors.vestingStart.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cliffMonths" className="text-xs font-medium">Cliff (Months)</Label>
                  <Input
                    id="cliffMonths"
                    type="number"
                    {...register('cliffMonths', { valueAsNumber: true })}
                    placeholder="12"
                    className="h-8 text-sm"
                  />
                  {errors.cliffMonths && (
                    <p className="text-xs text-red-600">{errors.cliffMonths.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    No vesting until cliff
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vestingMonths" className="text-xs font-medium">Vesting (Months)</Label>
                  <Input
                    id="vestingMonths"
                    type="number"
                    {...register('vestingMonths', { valueAsNumber: true })}
                    placeholder="48"
                    className="h-8 text-sm"
                  />
                  {errors.vestingMonths && (
                    <p className="text-xs text-red-600">{errors.vestingMonths.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Total vesting period
                  </p>
                </div>
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
                  <LoadingSpinner size="sm" />
                  Granting...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Grant ESOP
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}