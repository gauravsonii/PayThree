'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { useAccount } from 'wagmi';
import { ConnectButton  } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Wallet, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNProgress } from '@/hooks/use-nprogress';
import { BalanceDisplay } from '@/components/ui/balance-display';

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  const { isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);
  
  // Enable NProgress for page transitions
  useNProgress();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Authorize Access
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Connect your Ethereum wallet to access the HR Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border">
                <Lock className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Secure Connection</p>
                  <p className="text-muted-foreground">Your wallet connection is encrypted and secure</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border">
                <Wallet className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Multi-Wallet Support</p>
                  <p className="text-muted-foreground">Connect with MetaMask, WalletConnect, or any Ethereum wallet</p>
                </div>
              </div>
            </div>

            {/* Styled Green Connect Button */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                 <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {connected ? (
                          <Button
                            onClick={openAccountModal}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="lg"
                          >
                            <b>{account.displayName}</b>
                          </Button>
                        ) : (
                          <Button
                            onClick={openConnectModal}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="lg"
                          >
                            <b>Connect Wallet</b>
                          </Button>
                        )}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              By connecting your wallet, you agree to our terms of service and privacy policy
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 bg-card border-r border-border">
        <Sidebar />
      </div>
      <div className="md:pl-64 flex flex-col w-0 flex-1">
        {/* Default RainbowKit ConnectButton (no custom rendering) */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-border">
          <div className="flex-1"></div>
          <div className="flex items-center gap-3">
            <BalanceDisplay />
            <ConnectButton
              // showBalance={false}
              // chainStatus="full"   // "icon" | "name" | "full" (full shows network + dropdown)
              accountStatus="full" 
              chainStatus="icon"// keep ENS/address visible
            />
            {/* <appkit-network-button /> */}
          </div>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
