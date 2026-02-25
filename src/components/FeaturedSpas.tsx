import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SpaCard from './SpaCard';
import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';

export default function FeaturedSpas() {
  // Filter spas by IDs: 2, 1, 7, 5
  const featuredSpaIds = [2, 1, 7, 5];
  const featuredSpas = spaData
    .filter((spa: Spa) => featuredSpaIds.includes(spa.id))
    .sort((a: Spa, b: Spa) => a.name.localeCompare(b.name));

  return (
    <section className="py-32 bg-stone-50">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-6">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">
                Relax together
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
                Our Couples Collection
              </h2>
              <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
                Spas selected for their outdoor thermal facilities and romantic
                atmosphere.
              </p>
            </div>
            <div className="flex-shrink-0 mt-6 md:mt-0">
              <Link
                href="/spas"
                className="inline-flex items-center text-emerald-900 font-semibold text-sm"
              >
                Browse all spas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Spa Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featuredSpas.map((spa: Spa) => (
            <SpaCard
              key={spa.id}
              spa={spa}
              lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
              lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

