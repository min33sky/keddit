import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import React from 'react';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'K-reddit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn('bg-white text-slate-900 antialiased')}>
      <body className={cn('min-h-screen pt-12 bg-slate-50 antialiased')}>
        <ReactQueryProvider>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className={cn('container max-w-7xl mx-auto h-full pt-12')}>
            {children}
          </div>
          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
