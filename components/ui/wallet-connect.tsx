'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, AlertCircle } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        setIsConnecting(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        // Check if we're on the correct network (Ethereum mainnet)
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (chainId !== '0x1') { // Ethereum mainnet
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x1' }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              // Network not added, try to add it
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x1',
                    chainName: 'Ethereum Mainnet',
                    nativeCurrency: {
                      name: 'Ether',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.infura.io/v3/'],
                    blockExplorerUrls: ['https://etherscan.io/'],
                  }],
                });
              } catch (addError) {
                setError('Please switch to Ethereum Mainnet in your wallet.');
                setIsConnecting(false);
                return;
              }
            } else {
              setError('Please switch to Ethereum Mainnet in your wallet.');
              setIsConnecting(false);
              return;
            }
          }
        }

        // Store wallet info in localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', accounts[0]);
        
        onConnect();
      } else {
        setError('No accounts found. Please connect your wallet.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Connect your Ethereum wallet to access the HR Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border border-border">
              <Shield className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Secure Connection</p>
                <p className="text-muted-foreground">Your wallet connection is encrypted and secure</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              By connecting your wallet, you agree to our terms of service and privacy policy
            </div>
          </div>

          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 