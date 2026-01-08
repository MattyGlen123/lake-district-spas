'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Spa, accessLabelConfig } from '@/types/spa';

interface SpaCardProps {
  spa: Spa;
}

const SpaCard = ({ spa }: SpaCardProps) => {
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
    <Link href={`/spa/${spa.url}`} className="group block">
      <article className="space-y-6">
        {/* Image Container */}
        <div className="relative aspect-[7/6] rounded-[2rem] overflow-hidden shadow-sm border border-stone-100">
          {!imageError ? (
            <Image
              src={spa.imageSrc}
              alt={spa.imageAlt}
              fill
              className="object-cover"
              loading="lazy"
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
              <span className="text-sm">Image not available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-60" />

          {/* Badges at bottom */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
            {sortedAccessLabels.map((label) => {
              const config = accessLabelConfig[label];
              const badgeColorMap: Record<string, string> = {
                'bg-spa-green':
                  'bg-emerald-50 text-black border border-emerald-200',
                'bg-spa-purple':
                  'bg-purple-50 text-black border border-purple-200',
                'bg-spa-yellow':
                  'bg-amber-50 text-black border border-amber-200',
                'bg-spa-red': 'bg-red-50 text-black border border-red-200',
                'bg-spa-blue': 'bg-blue-50 text-black border border-blue-200',
              };
              const badgeClasses =
                badgeColorMap[config.color] ||
                'bg-white text-black border border-stone-200';

              return (
                <div
                  key={label}
                  className={`${badgeClasses} px-3 py-1.5 rounded-full text-xs font-semibold`}
                >
                  <span>{config.shortLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-5 px-1">
          {/* Location with divider */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <MapPin className="h-3 w-3 mr-1.5 opacity-60" />
              {spa.location}
            </div>
            <div className="h-px flex-grow bg-stone-100" />
          </div>

          <div className="space-y-5">
            {/* Spa Name */}
            <h3 className="font-serif text-3xl text-stone-900 leading-[1.2]">
              {spa.name}
            </h3>

            {/* Key Features with amber dots */}
            <ul className="space-y-2.5">
              {spa.keyFeatures.slice(0, 3).map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-stone-500 text-[12px] tracking-[0.1em] leading-tight"
                >
                  <span className="h-1 w-1 rounded-full bg-amber-500/60 mt-1.5 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default SpaCard;
