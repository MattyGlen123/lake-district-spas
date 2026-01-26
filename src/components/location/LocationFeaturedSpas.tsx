import FeaturedSpa from './FeaturedSpa';
import { Spa } from '@/types/spa';

interface LocationFeaturedSpasProps {
  spas: Spa[];
  sectionLabel: string;
  sectionTitle: string;
}

export default function LocationFeaturedSpas({
  spas,
  sectionLabel,
  sectionTitle,
}: LocationFeaturedSpasProps) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-px w-12 bg-amber-700 opacity-30" />
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
            {sectionLabel}
          </span>
        </div>

        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-12">
          {sectionTitle}
        </h2>

        {/* Featured Spas */}
        <div className="space-y-8">
          {spas.map((spa) => (
            <FeaturedSpa key={spa.id} spa={spa} />
          ))}
        </div>
      </div>
    </section>
  );
}

