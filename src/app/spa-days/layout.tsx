import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Day Pass Collection - Lake District Spas',
  description:
    'Browse and compare luxury day spa packages from the finest hotels in the Lake District. All in one place, with clear pricing and inclusions.',
  openGraph: {
    title: 'Day Pass Collection - Lake District Spas',
    description:
      'Browse and compare luxury day spa packages from the finest hotels in the Lake District. All in one place, with clear pricing and inclusions.',
    type: 'website',
    url: 'https://lakedistrictspas.co.uk/spa-days',
    images: [
      {
        url: 'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake District Day Spa Passes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Day Pass Collection - Lake District Spas',
    description:
      'Browse and compare luxury day spa packages from the finest hotels in the Lake District.',
  },
};

export default function SpaDaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

