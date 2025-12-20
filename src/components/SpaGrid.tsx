'use client';

import { useState } from 'react';
import SpaCard from './SpaCard';
import { Spa } from '@/types/spa';

interface SpaGridProps {
  spas: Spa[];
}

const SpaGrid = ({ spas }: SpaGridProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (spas.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-muted/50 rounded-xl">
            <p className="text-lg text-muted-foreground">
              No spas match your current filters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters to see more results.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:gap-8">
          {spas.map((spa) => (
            <SpaCard
              key={spa.id}
              spa={spa}
              isExpanded={expandedId === spa.id}
              onToggle={() => handleToggle(spa.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaGrid;
