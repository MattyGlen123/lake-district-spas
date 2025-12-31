import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaHero from '@/components/SpaHero';
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
        <nav className="container mx-auto px-4 lg:px-8 py-4 md:py-6 text-sm flex items-center text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          <span className="hover:text-slate-700">{spa.location}</span>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          <span className="text-slate-900 font-medium truncate">
            {spa.name}
          </span>
        </nav>
        <SpaHero spa={spa} />
        <div className="container mx-auto px-4 py-8">
          {/* Content sections will go here */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
