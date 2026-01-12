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
  title: 'Lake District Spas 2025 - Complete Access Guide',
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
    title: 'Lake District Spas 2025 - Complete Guide',
    description:
      'Know Before You Book - Compare spa access policies across 22 Lake District hotels',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake District Spas 2025 - Complete Guide',
    description:
      'Know Before You Book - Compare spa access policies across 22 Lake District hotels',
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
      <body className={`${inter.variable} ${playfairDisplay.variable} ${inter.className}`}>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
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
