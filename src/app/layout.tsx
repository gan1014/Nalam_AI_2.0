import type { Metadata } from 'next';
import './globals.css';
import GovHeader from '@/components/layout/GovHeader';
import GovFooter from '@/components/layout/GovFooter';

export const metadata: Metadata = {
  title: {
    default: 'நலம் AI | Nalam AI — Tamil Nadu Disease Surveillance',
    template: '%s | Nalam AI'
  },
  description: 'AI-powered disease surge early warning system for Tamil Nadu. 14-21 day advance warning for dengue, scrub typhus, gastroenteritis, heat stroke, and respiratory illness across all 38 districts.',
  keywords: ['Tamil Nadu health','dengue prediction','disease surveillance',
             'TNSDC','Naan Mudhalvan','PS08','நலம் AI'],
  openGraph: {
    title: 'Nalam AI — Tamil Nadu Disease Surveillance',
    description: '77M citizens protected. 38 districts. 21 days advance warning.',
    locale: 'ta_IN',
    alternateLocale: 'en_IN',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-gov-offwhite text-gov-dark">
        <GovHeader />
        <main className="flex-grow">
          {children}
        </main>
        <GovFooter />
      </body>
    </html>
  );
}
