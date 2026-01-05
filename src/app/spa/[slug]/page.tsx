import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaHero from '@/components/SpaHero';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuickFactsBar from '@/components/QuickFactsBar';
import SpaIntroduction from '@/components/SpaIntroduction';
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

  return {
    title: `${spa.name} - Lake District Spas`,
    description:
      spa.metaDescription ??
      `Discover ${spa.name} in ${spa.location}. Compare spa facilities, access policies, and find your perfect wellness retreat.`,
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

        <div className="container mx-auto px-4 md:px-8 py-8">
          <SpaIntroduction spa={spa} />
          <ThermalFacilities spa={spa} />
          <PoolFeatures spa={spa} />
          <Treatments spa={spa} />
        </div>

        <div className="w-full bg-slate-50 py-12">
          <div className="container mx-auto px-4 md:px-8">
            <AccessPolicy spa={spa} />
          </div>
        </div>

        <BookVisitCTA spa={spa} />
        <SpaNavigation currentSpa={spa} />
        <RelatedSpas spa={spa} />
      </main>

      <Footer />
    </div>
  );
}
