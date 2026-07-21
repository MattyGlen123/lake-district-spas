import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationHero from '@/components/location/LocationHero';
import LocationIntro from '@/components/location/LocationIntro';
import LocationFeaturedSpas from '@/components/location/LocationFeaturedSpas';
import RelatedLocations from '@/components/location/RelatedLocations';
import FAQs, { generateFAQSchema } from '@/components/FAQs';
import { spaData } from '@/data/spas';
import { getLocationFAQs } from '@/data/location-faqs';
import {
  locationPageConfigs,
  getLocationPageConfigBySlug,
} from '@/data/locations';

// One static page per location, at the same URLs the old per-folder
// pages served: /location/spas-in-{slug}
export async function generateStaticParams() {
  return locationPageConfigs.map((location) => ({
    slug: `spas-in-${location.slug}`,
  }));
}

function resolveLocation(paramSlug: string) {
  const shortSlug = paramSlug.startsWith('spas-in-')
    ? paramSlug.slice('spas-in-'.length)
    : paramSlug;
  return getLocationPageConfigBySlug(shortSlug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const location = resolveLocation(params.slug);

  if (!location) {
    return {
      title: 'Location Not Found',
      description: 'The requested location could not be found.',
    };
  }

  return {
    title: location.metaTitle,
    description: location.metaDescription,
  };
}

export default function LocationSpasPage({
  params,
}: {
  params: { slug: string };
}) {
  const location = resolveLocation(params.slug);

  if (!location) {
    notFound();
  }

  const locationSpas = spaData.filter((spa) => spa.location === location.name);
  const faqs = getLocationFAQs(location.name);

  const heroContent = {
    badge: location.heroBadge,
    titleLine1: 'Spas in',
    titleLine2: location.name,
    description: location.heroDescription,
    imageSrc: location.image,
    imageAlt: location.heroImageAlt,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <LocationHero {...heroContent} />
        <LocationIntro content={location.introContent} />
        <LocationFeaturedSpas
          spas={locationSpas}
          sectionLabel={`${locationSpas.length} ${
            locationSpas.length === 1 ? 'Spa' : 'Spas'
          } in ${location.name}`}
          sectionTitle={location.spaSectionTitle}
        />

        {faqs.length > 0 && (
          <div className="bg-[#FAF9F6]">
            <div className="container mx-auto px-4 md:px-8">
              <FAQs
                id="faq"
                title="Common Questions"
                subtitle={location.faqSubtitle}
                icon={HelpCircle}
                faqs={faqs}
              />
            </div>
          </div>
        )}

        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateFAQSchema(faqs)),
            }}
          />
        )}

        <RelatedLocations
          currentLocation={location.name}
          locations={location.relatedLocations}
          backgroundColor={faqs.length > 0 ? 'bg-white' : undefined}
        />
      </main>

      <Footer />
    </div>
  );
}
