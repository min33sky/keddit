import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata = {
  title: 'K-reddit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn('bg-white text-slate-900 antialiased')}>
      <body className={cn('min-h-screen pt-12 bg-slate-50 antialiased')}>
        {/* @ts-expect-error server component */}
        <Navbar />
        <div className={cn('container max-w-7xl mx-auto h-full pt-12')}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
