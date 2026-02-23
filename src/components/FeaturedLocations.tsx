import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { spaData } from '@/data/spas';
import { locationMetadata } from '@/lib/locationPages';

const featuredLocationSlugs = ['windermere', 'ambleside', 'grasmere'];

export default function FeaturedLocations() {
  const featuredLocations = featuredLocationSlugs
    .map((slug) => locationMetadata.find((location) => location.slug === slug))
    .filter(Boolean)
    .map((location) => {
      const resolvedLocation = location!;
      const spaCount = spaData.filter(
        (spa) => spa.location === resolvedLocation.name
      ).length;

      return {
        ...resolvedLocation,
        spaCount,
      };
    });

  if (featuredLocations.length === 0) return null;

  return (
    <section className="bg-white py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">
            Featured Spa Locations
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Explore three of the most popular Lake District areas for spa stays.
          </p>
          <div className="mt-6">
            <Link
              href="/locations"
              className="inline-flex items-center text-sm font-semibold text-stone-900"
            >
              View All Locations
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredLocations.map((location) => (
            <Link
              key={location.slug}
              href={`/location/spas-in-${location.slug}/`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={location.image}
                  alt={`Spa breaks in ${location.name}, Lake District`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>

              <div className="flex items-start justify-between p-5">
                <div>
                  <h3 className="font-serif text-xl text-stone-900">
                    {location.name}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">{location.tagline}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mt-3">
                    {location.spaCount} {location.spaCount === 1 ? 'Spa' : 'Spas'}
                  </p>
                </div>
                <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
