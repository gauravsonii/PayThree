'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { TreasuryTransaction } from '@/types';

interface TransactionHistoryProps {
  transactions: TreasuryTransaction[];
  className?: string;
}

export function TransactionHistory({ transactions, className }: TransactionHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
                      {transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'deposit' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {transaction.txHash}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(transaction.status)}
                {getStatusBadge(transaction.status)}
                                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No transactions yet</p>
                <p className="text-xs">Your treasury transactions will appear here</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 