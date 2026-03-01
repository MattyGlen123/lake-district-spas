import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpasListingClient from '@/components/SpasListingClient';
import { spaData } from '@/data/spas';

export const metadata: Metadata = {
  title: 'Lake District Spa Directory | Browse All Spas | Lake District Spas',
  description:
    'Browse and compare all Lake District spa hotels. Filter by facilities, location and access type. Find the perfect spa break in the Lake District.',
};

const BASE_URL = 'https://lakedistrictspas.co.uk';

export default function SpasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Lake District Spa Directory',
            description: 'All Lake District spa hotels in one directory',
            numberOfItems: spaData.length,
            itemListElement: spaData.map((spa, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: spa.name,
              url: `${BASE_URL}/spa/${spa.url}`,
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative pt-24 pb-20 overflow-hidden min-h-[560px] md:min-h-[680px] flex items-center">
            <Image
              src="/images/pages/ullswater-aerial-lake-district-spa-breaks.jpg"
              alt="Aerial view of Ullswater stretching between wooded shores and green farmland with a wooden jetty in the foreground, rounded fells and valleys of the eastern Lake District rising under a hazy summer sky"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center w-full">
              <div className="flex justify-center mb-8">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-sm">
                  Lake District Spa Directory
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-8xl text-white tracking-tight leading-[1.1] mb-8">
                The Spa <br />
                <span className="italic font-medium text-white/90">
                  Collection
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
                Browse and compare all Lake District spa hotels. Filter by
                facilities, location, and access type.
              </p>

              <div className="h-px w-24 bg-white/40 mx-auto" />
            </div>
          </section>

          <SpasListingClient spas={spaData} />
        </main>

        <Footer />
      </div>
    </>
  );
}
