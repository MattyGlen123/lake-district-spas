import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lake District Spas 2025 - Complete Access Guide',
  description:
    "Find you're perfect Spa. Compare Lake District spas. Know before you book: Is the spa included with your room? Detailed thermal suite, pool and access policy information.",
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
      <body className={inter.className}>
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
