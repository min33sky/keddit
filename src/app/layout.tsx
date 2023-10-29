import Navbar from '@/components/navbar';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import React from 'react';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';

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
    <html lang="ko" suppressHydrationWarning>
      <body className={cn('min-h-screen pt-12 antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="k-reddit"
        >
          <ReactQueryProvider>
            <Navbar />

            {authModal}

            <div className={cn('container max-w-7xl mx-auto h-full pt-12')}>
              {children}
            </div>

            <Toaster richColors />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
