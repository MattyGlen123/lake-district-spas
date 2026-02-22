import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lake District Spas — Hotels, Day Passes & Treatments Guide',
  description:
    'Find your perfect Lake District spa. Compare facilities, access policies, and thermal suites. Know before you book if spa access is included with your room.',
  keywords: [
    'lake district spas',
    'spa hotels lake district',
    'thermal suite lake district',
    'lake district spa breaks',
    'spa access policies',
    'lake district wellness',
  ],
  openGraph: {
    title: 'Lake District Spas — Hotels, Day Passes & Treatments Guide',
    description:
      'Know Before You Book - Compare spa access policies across 22 Lake District hotels',
    type: 'website',
    url: 'https://lakedistrictspas.co.uk',
    images: [
      {
        url: 'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake District Spas - Complete Access Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake District Spas — Hotels, Day Passes & Treatments Guide',
    description:
      'Know Before You Book - Compare spa facilities and access policies across 22 Lake District hotels.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${inter.className}`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-55LJRB7F"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <GoogleAnalytics/>
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="8DORP03UN9uFDBQ6qcXLGw"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
