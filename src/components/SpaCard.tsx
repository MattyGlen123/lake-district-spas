'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Spa } from '@/types/spa';
import SpaAccessBadges from './SpaAccessBadges';

interface SpaCardProps {
  spa: Spa;
}

const SpaCard = ({ spa }: SpaCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/spa/${spa.url}`} className="group block">
      <article className="space-y-6">
        {/* Image Container */}
        <div className="relative aspect-[7/6] rounded-[2rem] overflow-hidden shadow-sm border border-stone-100">
          {!imageError && spa.images[0] ? (
            <Image
              src={spa.images[0].src}
              alt={spa.images[0].alt}
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
          <SpaAccessBadges accessLabels={spa.accessLabels} />
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
