'use client';

import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Users, DollarSign, Gift } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            PayThree
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Employee Portal for ESOP and Payroll Management on Avalanche
          </p>
          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800">
                Please connect your wallet to access the portal
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Wallet className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Wallet Integration</CardTitle>
              <CardDescription>
                Connect your Avalanche wallet to access your data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>
                View your salary and payout history
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Gift className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>ESOP Tracking</CardTitle>
              <CardDescription>
                Monitor your employee stock options
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Team Portal</CardTitle>
              <CardDescription>
                Access HR portal for team management
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {isConnected && (
          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>Powered by Avalanche Blockchain</p>
        </div>
      </div>
    </div>
  );
}
