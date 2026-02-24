'use client';

import SpaCard from './SpaCard';
import { Spa } from '@/types/spa';
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';

interface SpaGridProps {
  spas: Spa[];
  showHeading?: boolean;
  className?: string;
}

const SpaGrid = ({ spas, showHeading = true, className }: SpaGridProps) => {
  if (spas.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-stone-100 rounded-xl">
            <p className="text-lg text-stone-600">
              No spas match your current filters.
            </p>
            <p className="text-sm text-stone-500 mt-2">
              Try adjusting your filters to see more results.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const Wrapper = className ? 'div' : 'section';
  const wrapperClass = className ?? 'py-8 md:py-16 mb-20';

  return (
    <Wrapper className={wrapperClass}>
      {className ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {spas.map((spa) => (
            <SpaCard
              key={spa.id}
              spa={spa}
              lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
              lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
            />
          ))}
        </div>
      ) : (
        <div className="container mx-auto px-4">
          {showHeading && (
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
              Explore {spas.length} {spas.length === 1 ? 'spa' : 'spas'}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {spas.map((spa) => (
              <SpaCard
                key={spa.id}
                spa={spa}
                lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
                lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
              />
            ))}
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default SpaGrid;
