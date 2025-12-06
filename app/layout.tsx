import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PostHogProvider } from '@/providers/posthog';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://protocol-health.io'),
  title: {
    default: 'Protocol Health - DeFi Risk Intelligence & S&P-Style Ratings',
    template: '%s | Protocol Health'
  },
  description: 'Get S&P-style risk ratings for 30+ DeFi protocols. Comprehensive security analysis, TVL stability, decentralization metrics, and financial health scores. Make informed DeFi investment decisions.',
  keywords: ['DeFi', 'DeFi risk', 'protocol ratings', 'crypto risk analysis', 'DeFi security', 'smart contract audit', 'DeFi intelligence', 'blockchain analysis', 'DeFi protocols', 'cryptocurrency risk'],
  authors: [{ name: 'Protocol Health' }],
  creator: 'Protocol Health',
  publisher: 'Protocol Health',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://protocol-health.io',
    siteName: 'Protocol Health',
    title: 'Protocol Health - DeFi Risk Intelligence',
    description: 'S&P-style risk ratings for DeFi protocols. Comprehensive security and financial analysis.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Protocol Health - DeFi Risk Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protocol Health - DeFi Risk Intelligence',
    description: 'S&P-style risk ratings for DeFi protocols',
    images: ['/og-image.png'],
    creator: '@protocolhealth',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ton-code-de-verification-google',
  },
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
