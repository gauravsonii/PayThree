'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Coins } from 'lucide-react';
import { formatUnits } from 'viem';
// import { getBalance } from '@/utils/mockUSDCUtils';
// import { } from 'wagmi';
import { config } from '@/config';
import {getTreasuryBalanceUSD , getBalance} from "@/utils/mockUSDCUtils"
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function BalanceDisplay() {
  const { address, isConnected } = useAccount();
  const [nativeBalance, setNativeBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }
  
    let intervalId: NodeJS.Timeout;
  
    const loadBalances = async () => {
      try {
        // setLoading(true);
  
        // Get USDC balance
        const usdcBalance = await getBalance(address);
        const formattedBalance = Number(formatUnits(BigInt(usdcBalance), 6));
        console.log('USDC Balance:', formattedBalance);
        setUsdcBalance(formattedBalance.toString());
      } catch (error) {
        console.error('Error loading balances:', error);
        setUsdcBalance('0');
      } finally {
        setLoading(false);
      }
    };
  
    // Initial load
    loadBalances();
  
    // Poll every 10 seconds (adjust as needed)
    intervalId = setInterval(loadBalances, 3000);
  
    // Cleanup on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [address, isConnected]);
  

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
    

      {/* USDC Balance */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
  <CardContent className="p-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-green-500" />
        <div className="font-medium text-foreground mr-3">USDC</div>
      </div>
      <div className="text-sm text-muted-foreground">
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          `${parseFloat(usdcBalance).toFixed(2)}`
        )}
      </div>
    </div>
  </CardContent>
</Card>

    </div>
  );
} 