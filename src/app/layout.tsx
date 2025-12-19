import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lake District Spas 2025 - Complete Access Guide',
  description:
    'Compare 22 Lake District spa hotels. Know before you book: Is the spa included with your room? Detailed thermal suite, pool and access policy information.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
