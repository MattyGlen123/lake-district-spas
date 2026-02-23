import Image from 'next/image';
import { Metadata } from 'next';
import FeaturedArticles from '@/components/FeaturedArticles';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LocationsGrid from '@/components/location/LocationsGrid';

export const metadata: Metadata = {
  title: 'Spa Locations in the Lake District | Lake District Spas',
  description:
    'Browse all Lake District spa locations. Find spas in Windermere, Ambleside, Grasmere and more.',
};

function LocationsHero() {
  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/blog/lake-district-spas_blog-hotel-spa-extension-golden-hour.jpg"
          alt="Lake District hotel and spa at golden hour, nestled among fells and calm waters, ideal for planning a spa break by location"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 to-foreground/70" />

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary-foreground mb-4">
            Lake District Spa Locations
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-medium">
            Browse spas by area
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationsHero />
        <LocationsGrid />
        <FeaturedArticles useWhiteBackground />
      </main>

      <Footer />
    </div>
  );
}
