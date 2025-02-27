import type { Metadata } from 'next';
import { Inter, Geist_Mono, EB_Garamond } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${ebGaramond.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
