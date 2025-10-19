'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { LoadingSpinnerFull } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    } else {
      router.push('/landing');
    }
  }, [isConnected, router]);

  return <LoadingSpinnerFull text="Redirecting..." />;
}