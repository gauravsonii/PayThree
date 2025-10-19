'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeApi, payoutApi } from '@/lib/api';
import { Payout } from '@/types';
import { DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { useAccount } from 'wagmi';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { SomniaTestnet } from '@/config';

export default function MyPayPage() {
  const { isConnected, address } = useAccount();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadMyPayouts();
    }
  }, [isConnected, address]);

  const loadMyPayouts = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get employee data by wallet address
      const employee = await employeeApi.getByWalletAddress(address!);
      if (!employee) {
        setError('Employee not found');
        setPayouts([]);
        return;
      }

      // Get employee payouts using employee ID
      const payoutsData = await payoutApi.getEmployeePayouts(employee._id);
      console.log(payoutsData, "payoutsData");
      setPayouts(Array.isArray(payoutsData) ? payoutsData : []);
    } catch (error) {
      console.error('Failed to load payouts:', error);
      setError('Failed to load payout data');
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  const getExplorerLink = (txHash: string) =>
    `${SomniaTestnet.blockExplorers.default.url}/tx/${txHash}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalReceived = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amountUSD, 0);

  const pendingAmount = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amountUSD, 0);

  const recentPayouts = payouts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My Pay</h2>
          <p className="text-muted-foreground">
            View your payment history and upcoming payouts.
          </p>
        </div>
        <LoadingSpinnerFull text="Loading your payment data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My Pay</h2>
          <p className="text-muted-foreground">
            View your payment history and upcoming payouts.
          </p>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My Pay</h2>
        <p className="text-muted-foreground">
          View your payment history and upcoming payouts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All-time completed payouts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pending payouts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payouts.length}</div>
            <p className="text-xs text-muted-foreground">
              All payout transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayouts.length > 0 ? (
              recentPayouts.map((payout) => {
                // Handle populated batchId data
                const batchData = typeof payout.batchId === 'object' ? payout.batchId : null;
                const txHash = batchData?.txHash || payout.txHash;
                const batchAmount = batchData?.totalAmount;
                
                return (
                  <div key={payout._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payout.status)}
                        <Badge className={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">${payout.amountUSD.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(payout.createdAt), { addSuffix: true })}
                        </p>
                        {batchData && (
                          <p className="text-xs text-muted-foreground">
                            Batch: ${batchAmount?.toLocaleString() || 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {txHash && (
                        <a
                          href={getExplorerLink(txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-blue-600 hover:underline"
                        >
                          {txHash.slice(0, 10)}...{txHash.slice(-6)}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payouts found</p>
                <p className="text-sm">Your payment history will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 