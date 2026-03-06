import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingCallButton } from '@/components/ui/FloatingCallButton';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'FlyEasy — Fly Smarter, Save More',
  description: 'Search 500+ airlines. Find the best flight deals or call for exclusive unpublished fares not available online.',
  keywords: 'cheap flights, flight deals, airline tickets, last minute flights',
  openGraph: {
    title: 'FlyEasy — Fly Smarter, Save More',
    description: 'Search 500+ airlines. Find the best flight deals.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <Header />
        <div>
          {children}
        </div>
        <Footer />
        <FloatingCallButton />
      </body>
    </html>
  );
}
