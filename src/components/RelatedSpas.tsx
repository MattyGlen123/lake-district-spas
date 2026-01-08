import SpaCard from './SpaCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Spa } from '@/types/spa';
import { spaData } from '@/data/spas';

interface RelatedSpasProps {
  spa: Spa;
}

export default function RelatedSpas({ spa }: RelatedSpasProps) {
  const relatedSpas = spa.relatedSpas
    .map((id) => spaData.find((s) => s.id === id))
    .filter((s): s is Spa => s !== undefined);

  if (relatedSpas.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-32">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px w-12 bg-amber-700 opacity-30" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
              Explore More
            </span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900">
              Similar Spas to Explore
            </h2>
            <Link
              href="/"
              className="text-stone-900 font-semibold flex items-center text-sm"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Spa Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
          {relatedSpas.map((relatedSpa) => (
            <SpaCard key={relatedSpa.id} spa={relatedSpa} />
          ))}
        </div>
      </div>
    </section>
  );
}
