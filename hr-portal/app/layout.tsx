import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { WalletProvider } from '@/contexts/wallet-context';
import { AppContent } from '@/components/app-content';
import { headers } from "next/headers"; // added
import ContextProvider from '@/context'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

const inter = Inter({ subsets: ['latin'] });

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
});

export const metadata: Metadata = {
  title: 'PayThree - Employee Payout Management',
  description: 'Comprehensive HR dashboard for managing employee payouts and ESOPs',
};

// export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookies = headers().get('cookie')
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark`}>
        <ContextProvider cookies={cookies}>
          <AppContent>{children}</AppContent>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </ContextProvider>
      </body>
    </html>
  );
}