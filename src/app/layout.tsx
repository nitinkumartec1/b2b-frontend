import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://theb2bholidays.com'),
  title: { default: 'THE B2B HOLIDAYS — Premium B2B Travel Booking Platform', template: '%s | THE B2B HOLIDAYS' },
  description: 'India\'s premium B2B travel booking platform. Curated holidays and fixed departures for travel agents and partners.',
  keywords: ['B2B travel', 'travel agents', 'holiday packages', 'fixed departures', 'travel portal'],
  openGraph: { title: 'THE B2B HOLIDAYS', description: 'Premium B2B travel booking platform', type: 'website' },
  twitter: { card: 'summary_large_image' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
