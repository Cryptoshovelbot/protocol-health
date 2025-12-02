import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Protocol Health - DeFi Risk Scoring Platform',
  description: 'Know Which DeFi Protocols You Can Trust - Real-time risk scoring for 50+ protocols',
  keywords: 'DeFi, risk scoring, protocol analysis, TVL, security audit, decentralized finance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
