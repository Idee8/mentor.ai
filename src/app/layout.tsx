import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono, EB_Garamond } from 'next/font/google';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';

import './globals.css';
import { Providers } from './providers';

const interSans = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mentor AI',
  description: 'AI Code Mentor on any codebase',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interSans.variable} ${ebGaramond.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Analytics />
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
