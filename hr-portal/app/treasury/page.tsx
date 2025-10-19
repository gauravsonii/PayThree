'use client';

import { useState, useEffect } from 'react';
import { TreasuryCard } from '@/components/treasury/treasury-card';
import { TransactionHistory } from '@/components/treasury/transaction-history';
import { getTreasuryBalanceUSD } from '@/utils/mockUSDCUtils';
import { fundTreasury, fundTreasuryWithApprove, withdrawFromTreasury } from '@/utils/payrollContractUtils';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { treasuryApi } from '@/lib/api';
import { TreasuryTransaction } from '@/types';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';
import { parseUnits } from 'viem';

export default function TreasuryPage() {
  const { isConnected, address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);

  // Load treasury balance and transactions on component mount
  useEffect(() => {
    if (isConnected) {
      loadTreasuryBalance();
      loadTransactions();
    }
  }, [isConnected]);

  const loadTreasuryBalance = async () => {
    try {
      setLoading(true);
      const balance = await getTreasuryBalanceUSD();
      console.log(balance, 'balance');
      setBalance(balance);
    } catch (error) {
      console.error('Error loading treasury balance:', error);
      toast.error('Failed to load treasury balance');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const transactions = await treasuryApi.getTransactions();
      setTransactions(transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setTransactionsLoading(false);
    }
  };

    const handleFund = async (amount: number, description: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Convert USD amount to USDC units (6 decimals)
      const amountInUSDC = parseUnits(amount.toString(), 6).toString();
      
      // Execute the transaction
      const tx = await fundTreasuryWithApprove(amountInUSDC);
      
      // Only add transaction to database when confirmed
      if (tx) {
        const newTransaction = await treasuryApi.createTransaction({
          type: 'deposit',
          amount: amount,
          description: description,
          txHash: tx,
          status: 'completed',
          walletAddress: address || '0x...' // You can get this from useAccount
        });
        
        // Add to local state
        setTransactions(prev => [newTransaction, ...prev]);
      }
      console.log(tx, 'tx');

      toast.success('Treasury funded successfully!');
      
      // Reload balance after successful transaction
      setTimeout(() => {
        loadTreasuryBalance();
      }, 2000);
    } catch (error) {
      console.error('Error funding treasury:', error);
      toast.error('Failed to fund treasury');
    }
  };

  const handleWithdraw = async (amount: number, description: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // Convert USD amount to USDC units (6 decimals)
      const amountInUSDC = parseUnits(amount.toString(), 6).toString();
      
      // Execute the transaction
      const tx = await withdrawFromTreasury(amountInUSDC);
      
      // Only add transaction to database when confirmed
      if (tx) {
        const newTransaction = await treasuryApi.createTransaction({
          type: 'withdrawal',
          amount: amount,
          description: description,
          txHash: tx,
          status: 'completed',
          walletAddress: address || '0x...' // You can get this from useAccount
        });
        
        // Add to local state
        setTransactions(prev => [newTransaction, ...prev]);
      }
      
      toast.success('Withdrawal successful!');
      
      // Reload balance after successful transaction
      setTimeout(() => {
        loadTreasuryBalance();
      }, 2000);
    } catch (error) {
      console.error('Error withdrawing from treasury:', error);
      toast.error('Failed to withdraw from treasury');
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Treasury</h2>
        <p className="text-muted-foreground">
          Manage your organization's treasury balance and transactions.
        </p>
      </div>

      {loading ? (
        <LoadingSpinnerFull text="Loading treasury data..." />
      ) : (
        <>
          <TreasuryCard 
            balance={balance}
            onFund={handleFund}
            onWithdraw={handleWithdraw}
          />

          {transactionsLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Transaction History</h3>
              </div>
              <LoadingSpinnerFull text="Loading transaction history..." />
            </div>
          ) : (
            <TransactionHistory transactions={transactions} />
          )}
        </>
      )}
    </div>
  );
} 