'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Spa, accessLabelConfig } from '@/types/spa';

interface SpaHeroProps {
  spa: Spa;
}

export default function SpaHero({ spa }: SpaHeroProps) {
  const [imageError, setImageError] = useState(false);

  // Sort access labels: hotel badges first, then public (day passes)
  const sortedAccessLabels = [...spa.accessLabels].sort((a, b) => {
    const aCategory = accessLabelConfig[a].category;
    const bCategory = accessLabelConfig[b].category;
    if (aCategory === 'hotel' && bCategory === 'public') return -1;
    if (aCategory === 'public' && bCategory === 'hotel') return 1;
    return 0;
  });

  return (
    <section className="container mx-auto px-4 mb-12 lg:px-8">
      <div className="relative rounded-2xl overflow-hidden aspect-[389/350] md:aspect-[389/250] lg:h-[500px] lg:w-full shadow-lg group">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

        {/* Image */}
        {!imageError ? (
          <Image
            src={spa.imageSrc}
            alt={spa.imageAlt}
            fill
            className="w-full h-full object-cover"
            quality={85}
            priority
            sizes="100vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
            <span>Image not available</span>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 z-20">
          {/* Access Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {sortedAccessLabels.map((label) => {
              const config = accessLabelConfig[label];
              return (
                <div
                  key={label}
                  className="bg-white text-black px-2 py-1 rounded-lg text-sm inline-flex items-center gap-1"
                >
                  <span>{config.dot}</span>
                  <span>{config.shortLabel}</span>
                </div>
              );
            })}
          </div>

          {/* Spa Name (H1) */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 text-white">
            {spa.name}
          </h1>
        </div>
      </div>
    </section>
  );
}
