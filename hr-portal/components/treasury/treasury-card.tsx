'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, Plus, Minus } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { fundTreasuryWithApprove } from '@/utils/payrollContractUtils';

interface TreasuryCardProps {
  balance: number;
  onFund?: (amount: number, description: string) => void;
  onWithdraw?: (amount: number, description: string) => void;
  className?: string;
}

export function TreasuryCard({ balance, onFund, onWithdraw, className }: TreasuryCardProps) {
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [fundLoading, setFundLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const handleFund = async () => {
    if (!fundAmount || !fundDescription) return;
    
    setFundLoading(true);
    try {
      await onFund?.(parseFloat(fundAmount), fundDescription);
      setFundAmount('');
      setFundDescription('');
      setFundDialogOpen(false);
    } catch (error) {
      console.error('Error funding treasury:', error);
    } finally {
      setFundLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawDescription) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }
    
    setWithdrawLoading(true);
    try {
      await onWithdraw?.(amount, withdrawDescription);
      setWithdrawAmount('');
      setWithdrawDescription('');
      setWithdrawDialogOpen(false);
    } catch (error) {
      console.error('Error withdrawing from treasury:', error);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <Card className={`bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          Treasury Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              ${balance.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Available for payouts</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Fund
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fund Treasury</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fund-amount">Amount (USD)</Label>
                    <Input
                      id="fund-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      disabled={fundLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fund-description">Description</Label>
                    <Input
                      id="fund-description"
                      placeholder="e.g., Initial funding, Additional capital"
                      value={fundDescription}
                      onChange={(e) => setFundDescription(e.target.value)}
                      disabled={fundLoading}
                    />
                  </div>
                  <Button onClick={handleFund} className="w-full" disabled={fundLoading}>
                    {fundLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Processing...
                      </>
                    ) : (
                      'Fund Treasury'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                  <Minus className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw from Treasury</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      disabled={withdrawLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="withdraw-description">Description</Label>
                    <Input
                      id="withdraw-description"
                      placeholder="e.g., Emergency withdrawal, Capital return"
                      value={withdrawDescription}
                      onChange={(e) => setWithdrawDescription(e.target.value)}
                      disabled={withdrawLoading}
                    />
                  </div>
                  <Button onClick={handleWithdraw} variant="destructive" className="w-full" disabled={withdrawLoading}>
                    {withdrawLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Processing...
                      </>
                    ) : (
                      'Withdraw from Treasury'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 