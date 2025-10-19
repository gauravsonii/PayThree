'use client';

import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';

export function WalletStatus() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
        <Wallet className="h-4 w-4 text-primary" />
        <span className="text-sm font-mono text-foreground">
          {address ? formatAddress(address) : 'Connected'}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => disconnect()}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
} 