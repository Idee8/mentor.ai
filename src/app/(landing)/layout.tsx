import type { Metadata } from 'next';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import ClickSpark from '@/components/ui/click-spark';
import LandingProvider from './provider';

export const metadata: Metadata = {
  title: { absolute: 'Mentor AI', template: '%s | Mentor AI' },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingProvider>
      <ClickSpark>
        <Navbar />
        {children}
        <Footer />
      </ClickSpark>
    </LandingProvider>
  );
}
