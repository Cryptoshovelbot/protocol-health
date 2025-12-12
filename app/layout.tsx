import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PHProvider } from './providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Protocol Health - DeFi Risk Intelligence',
  description: 'S&P-style safety ratings for 200+ DeFi protocols. Know which protocols are safe before you invest.',
  metadataBase: new URL('https://protocol-health.io'),
  
  openGraph: {
    title: 'Protocol Health - DeFi Risk Intelligence',
    description: 'S&P-style safety ratings for 200+ DeFi protocols. Know which protocols are safe before you invest.',
    url: 'https://protocol-health.io',
    siteName: 'Protocol Health',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Protocol Health - DeFi Risk Intelligence',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Protocol Health - DeFi Risk Intelligence',
    description: 'S&P-style safety ratings for 200+ DeFi protocols.',
    images: ['/og-image.png'],
    creator: '@protocolhealth_',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
