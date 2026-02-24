import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spa Treatments - Lake District | Massages, Facials & Body Treatments',
  description:
    'Browse and compare spa treatments from the finest hotels in the Lake District. Massages, facials, body treatments and more — with clear pricing and direct booking.',
  openGraph: {
    title: 'Spa Treatments - Lake District | Massages, Facials & Body Treatments',
    description:
      'Browse and compare spa treatments from the finest hotels in the Lake District. Massages, facials, body treatments and more — with clear pricing and direct booking.',
    type: 'website',
    url: 'https://lakedistrictspas.co.uk/spa-treatments',
    images: [
      {
        url: 'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake District Spa Treatments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spa Treatments - Lake District | Massages, Facials & Body Treatments',
    description:
      'Browse and compare spa treatments from the finest hotels in the Lake District. Massages, facials, body treatments and more.',
  },
};

export default function SpaTreatmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
