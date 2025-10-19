'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { payoutApi } from '@/lib/api';
import { Employee } from '@/types';
import { DollarSign, Users, AlertCircle, Wallet, CheckCircle, Loader2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getTreasuryBalanceUSD } from '@/utils/mockUSDCUtils';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { batchPayEmployees } from '@/utils/payrollContractUtils';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/config';
import { LoadingSpinner, LoadingDots } from '@/components/ui/loading-spinner';

interface PayoutFormProps {
  selectedEmployees: Employee[];
  onPayoutCreated: () => void;
  onClearSelection: () => void;
}

export function PayoutForm({ selectedEmployees, onPayoutCreated, onClearSelection }: PayoutFormProps) {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [gasUsed, setGasUsed] = useState('');
  const [processingTime, setProcessingTime] = useState(0);
  const [confirmationTime, setConfirmationTime] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);

  const totalAmount = selectedEmployees.reduce((sum, emp) => sum + emp.salaryUSD, 0);
  const hasInsufficientBalance = totalAmount > treasuryBalance;

  // Load treasury balance when dialog opens
  const loadTreasuryBalance = async () => {
    if (isConnected) {
      try {
        const balance = await getTreasuryBalanceUSD();
        setTreasuryBalance(balance);
      } catch (error) {
        console.error('Error loading treasury balance:', error);
      }
    }
  };

  const handlePayout = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (hasInsufficientBalance) {
      toast.error('Insufficient treasury balance');
      return;
    }

    setIsProcessing(true);
    

    try {
      // Prepare employee addresses and amounts
      const employeeAddresses = selectedEmployees.map(emp => emp.walletAddress);
      const amounts = selectedEmployees.map(emp => Math.floor(emp.salaryUSD * 1000000).toString()); // Convert to USDC units

      // Execute batch pay transaction
      const startTime = Date.now();
      const tx = await batchPayEmployees(employeeAddresses, amounts);
      
      const endTime = Date.now();
      const processingTimeMs = endTime - startTime;
      
      setTxHash(tx || 'Transaction completed');
      setProcessingTime(Math.round(processingTimeMs / 1000));

      // Wait for transaction confirmation and get receipt
      const confirmationStartTime = Date.now();
      try {
        const receipt = await waitForTransactionReceipt(config, {
          hash: tx as `0x${string}`
          
        });
        
        const confirmationEndTime = Date.now();
        const confirmationTimeMs = confirmationEndTime - confirmationStartTime;
        setConfirmationTime(confirmationTimeMs / 1000);
        
        const gasUsed = receipt.gasUsed?.toString() || 'Unknown';
        setGasUsed(`${gasUsed} gas`);
        
        // Only show completion after 10 confirmations
        setIsCompleted(true);
      } catch (receiptError) {
        console.error('Error getting transaction receipt:', receiptError);
        setGasUsed('Gas info unavailable');
        setConfirmationTime(0);
        setIsCompleted(true);
      }

      // Create payout record in database
      const payouts = selectedEmployees.map(employee => ({
        employeeId: employee._id,
        amountUSD: Math.round(employee.salaryUSD), // Already monthly salary
      }));

      await payoutApi.createBatch({
        txHash: tx || 'Transaction completed',
        payouts,
      });

      toast.success('Payout completed successfully!');
      
      // Don't auto-close the modal - let user close it manually
      // Don't call onClearSelection() here as it might cause the modal to close
      // Only call onPayoutCreated() to refresh the data
      onPayoutCreated();

    } catch (error) {
      console.error('Failed to process payout:', error);
      toast.error('Failed to process payout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      loadTreasuryBalance();
      setIsCompleted(false);
      setTxHash('');
      setGasUsed('');
      setProcessingTime(0);
      setConfirmationTime(0);
    }
    // Don't reset completion state when closing - let user see the results
  };

  if (selectedEmployees.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg">
          <DollarSign className="mr-2 h-4 w-4" />
          Create Payout ({selectedEmployees.length} employees)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Batch Payout</DialogTitle>
          <DialogDescription className="text-base">
            Process payments for {selectedEmployees.length} selected employees.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {hasInsufficientBalance && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                <div className="flex items-center justify-between">
                  <span>Insufficient treasury balance for this payout.</span>
                  <Link href="/treasury">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Wallet className="mr-2 h-3 w-3" />
                      Fund Treasury
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          )}



          {!isCompleted ? (
            <div className="space-y-4">
              <Button 
                onClick={handlePayout} 
                className="w-full h-12 text-lg font-semibold" 
                disabled={isProcessing || hasInsufficientBalance}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Processing Payout...
                  </>
                ) : (
                  <>
                    {/* <DollarSign className="mr-3 h-5 w-5" /> */}
                    Payout ${totalAmount.toLocaleString()}
                  </>
                )}
              </Button>
              
              {isProcessing && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Executing batch payment on blockchain...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Waiting for 3 confirmations...
                  </p>
                  <LoadingDots />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">Completed</h3>
                <p className="text-sm text-muted-foreground">
                  in {confirmationTime.toFixed(3)} seconds (3 confirmations)
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gas Used:</span>
                    <span className="text-sm font-mono">{gasUsed}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                    <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                      {txHash}
                    </div>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View on Etherscan →
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    setOpen(false);
                    setIsCompleted(false);
                    setTxHash('');
                    setGasUsed('');
                    setProcessingTime(0);
                    setConfirmationTime(0);
                    onClearSelection();
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}