import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface RelatedLocation {
  name: string;
  slug: string;
  distance: string;
}

interface RelatedLocationsProps {
  currentLocation: string;
  locations: RelatedLocation[];
  backgroundColor?: string;
}

export default function RelatedLocations({
  currentLocation: _currentLocation,
  locations,
  backgroundColor = 'bg-[#F6F7F6]',
}: RelatedLocationsProps) {
  return (
    <section className={`${backgroundColor} py-20`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-px w-12 bg-amber-700 opacity-30" />
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
            Nearby Areas
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
          Explore More of the Lake District
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/location/spas-in-${location.slug}/`}
              className="group bg-white rounded-2xl p-6 border border-stone-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl text-stone-900 mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-stone-500">{location.distance}</p>
                </div>
                <MapPin className="h-5 w-5 text-amber-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

