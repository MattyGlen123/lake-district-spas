import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaHero from '@/components/SpaHero';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuickFactsBar from '@/components/QuickFactsBar';
import SpaIntroduction from '@/components/SpaIntroduction';
import JumpToSection from '@/components/JumpToSection';
import BackButton from '@/components/BackButton';
import ThermalFacilities from '@/components/ThermalFacilities';
import PoolFeatures from '@/components/PoolFeatures';
import Treatments from '@/components/Treatments';
import AccessPolicy from '@/components/AccessPolicy';
import BookVisitCTA from '@/components/BookVisitCTA';
import SpaNavigation from '@/components/SpaNavigation';
import RelatedSpas from '@/components/RelatedSpas';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';
import { generateSpaSchema } from '@/utils/generateSpaSchema';

// Generate static params for all spas at build time
export async function generateStaticParams() {
  return spaData.map((spa) => ({
    slug: spa.url,
  }));
}

// Generate metadata for each spa page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const spa = spaData.find((s) => s.url === params.slug);

  if (!spa) {
    return {
      title: 'Spa Not Found',
      description: 'The requested spa could not be found.',
    };
  }

  const baseUrl = 'https://lakedistrictspas.co.uk';
  const pageUrl = `${baseUrl}/spa/${spa.url}`;
  const imageUrl = `${baseUrl}${spa.imageSrc}`;
  const title = `${spa.name} - Lake District Spas`;
  const description =
    spa.metaDescription ??
    `Discover ${spa.name} in ${spa.location}. Compare spa facilities, access policies, and find your perfect wellness retreat.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Lake District Spas',
      images: [
        {
          url: imageUrl,
          alt: spa.imageAlt || `${spa.name} - Lake District Spa`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// Main page component
export default function SpaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const spa: Spa | undefined = spaData.find((s) => s.url === params.slug);

  if (!spa) {
    notFound();
  }

  const schemaData = generateSpaSchema(spa);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Header />

      <main>
        <Breadcrumbs location={spa.location} spaName={spa.name} />
        <SpaHero spa={spa} />
        <QuickFactsBar spa={spa} />
        <BackButton />

        <div className="container mx-auto px-4 md:px-8 pt-8">
          <SpaIntroduction spa={spa} />
          <JumpToSection spa={spa} />
          <ThermalFacilities spa={spa} />
          <PoolFeatures spa={spa} />
          <Treatments spa={spa} />
        </div>

        <AccessPolicy spa={spa} />

        <BookVisitCTA spa={spa} />
        <SpaNavigation currentSpa={spa} />
        <RelatedSpas spa={spa} />
      </main>

      <Footer />
    </div>
  );
}
