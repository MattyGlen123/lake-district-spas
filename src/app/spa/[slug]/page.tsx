import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaHero from '@/components/SpaHero';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuickFactsBar from '@/components/QuickFactsBar';
import BackButton from '@/components/BackButton';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';

// Generate static params for all spas at build time
export async function generateStaticParams() {
  return spaData.map((spa) => ({
    slug: spa.id,
  }));
}

// Generate metadata for each spa page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const spa = spaData.find((s) => s.id === params.slug);

  if (!spa) {
    return {
      title: 'Spa Not Found',
      description: 'The requested spa could not be found.',
    };
  }

  return {
    title: `${spa.name} - Lake District Spas`,
    description: `Discover ${spa.name} in ${spa.location}. Compare spa facilities, access policies, and find your perfect wellness retreat.`,
  };
}

// Main page component
export default function SpaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const spa: Spa | undefined = spaData.find((s) => s.id === params.slug);

  if (!spa) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Breadcrumbs location={spa.location} spaName={spa.name} />
        <SpaHero spa={spa} />
        <QuickFactsBar spa={spa} />
        <BackButton />

        <div className="container mx-auto px-4 py-8">
          {/* Content sections will go here */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
