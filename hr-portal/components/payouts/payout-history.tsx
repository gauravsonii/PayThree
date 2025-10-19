'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayoutBatch, Payout, Employee } from '@/types';
import { payoutApi } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Eye } from 'lucide-react';
import { LoadingSpinner, LoadingSpinnerFull } from '@/components/ui/loading-spinner';

export function PayoutHistory() {
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [batchPayouts, setBatchPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const data = await payoutApi.getBatches();
      setBatches(data);
    } catch (error) {
      console.error('Failed to load batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBatchPayouts = async (batchId: string) => {
    try {
      setDetailsLoading(batchId);
      const data = await payoutApi.getBatchPayouts(batchId);
      setBatchPayouts(data);
      setSelectedBatch(batchId);
    } catch (error) {
      console.error('Failed to load batch payouts:', error);
    } finally {
      setDetailsLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payout Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinnerFull text="Loading payout batches..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payout Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch._id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">
                          {batch.txHash.slice(0, 10)}...{batch.txHash.slice(-8)}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${batch.totalAmount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(batch.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadBatchPayouts(batch._id)}
                        disabled={detailsLoading === batch._id}
                      >
                        {detailsLoading === batch._id ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-3 h-3 w-3" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedBatch && batchPayouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Wallet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchPayouts.map((payout) => {
                    const employee = payout.employeeId as Employee;
                    return (
                      <TableRow key={payout._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.designation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${payout.amountUSD.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={payout.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                        <span
  className="font-mono text-sm"
  title={employee.walletAddress} // show full address on hover
>
  {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-4)}
</span>

                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}