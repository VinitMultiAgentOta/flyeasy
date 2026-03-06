import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Header }             from '@/components/layout/Header';
import { Footer }             from '@/components/layout/Footer';
import { FloatingCallButton } from '@/components/ui/FloatingCallButton';
import '@/app/globals.css';

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
});

const poppins = Poppins({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'FlyEasy — Fly Smarter, Save More',
  description: 'Search 500+ airlines. Find the best flight deals or call for exclusive unpublished fares not available online.',
  keywords:    'cheap flights, flight deals, airline tickets, last minute flights',
  openGraph: {
    title:       'FlyEasy — Fly Smarter, Save More',
    description: 'Search 500+ airlines. Find the best flight deals.',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-sans)' }}>
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
