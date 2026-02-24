import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Spas - Lake District Spas',
  description:
    'Browse and compare all Lake District spa hotels. Filter by facilities, location, and access type to find your perfect spa retreat.',
  openGraph: {
    title: 'All Spas - Lake District Spas',
    description:
      'Browse and compare all Lake District spa hotels. Filter by facilities, location, and access type to find your perfect spa retreat.',
    type: 'website',
    url: 'https://lakedistrictspas.co.uk/spas',
    images: [
      {
        url: 'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake District Spa Hotels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Spas - Lake District Spas',
    description:
      'Browse and compare all Lake District spa hotels. Filter by facilities, location, and access type to find your perfect spa retreat.',
  },
};

export default function SpasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
