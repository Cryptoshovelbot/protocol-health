import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PostHogProvider } from '@/providers/posthog';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Protocol Health - DeFi Risk Intelligence',
  description: 'S&P-style ratings for DeFi protocols. Make informed decisions with comprehensive security analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
