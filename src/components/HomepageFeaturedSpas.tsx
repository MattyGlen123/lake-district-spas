import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SpaCard from './SpaCard';
import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';

const featuredSpaIds = [1, 2, 5, 7, 9, 14];

export default function HomepageFeaturedSpas() {
  const featuredSpas = spaData
    .filter((spa: Spa) => featuredSpaIds.includes(spa.id))
    .sort((a: Spa, b: Spa) => featuredSpaIds.indexOf(a.id) - featuredSpaIds.indexOf(b.id));

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-6">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">
                Featured Spas
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
                Explore the Collection
              </h2>
              <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
                Hand-picked spa hotels from across the Lake District, chosen for their outstanding
                facilities and unique character.
              </p>
            </div>
            <div className="flex-shrink-0 mt-6 md:mt-0">
              <Link
                href="/spas"
                className="inline-flex items-center text-emerald-900 font-semibold text-sm"
              >
                See all spas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Spa Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
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
