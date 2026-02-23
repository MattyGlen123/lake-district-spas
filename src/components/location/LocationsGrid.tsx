import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { spaData } from '@/data/spas';
import { locationMetadata, locationPageSlugs } from '@/lib/locationPages';

export default function LocationsGrid() {
  const locations = locationMetadata.map((location) => {
    const slug = locationPageSlugs[location.name] ?? location.slug;
    const spaCount = spaData.filter((spa) => spa.location === location.name).length;

    return {
      ...location,
      slug,
      spaCount,
    };
  });

  return (
    <section className="bg-soft-cream py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-px w-12 bg-amber-700 opacity-30" />
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
            Lake District
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
          Browse Spa Locations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((location) => (
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
