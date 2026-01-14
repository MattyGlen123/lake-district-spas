'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Images } from 'lucide-react';
import { Spa } from '@/types/spa';
import ImageGalleryModal from './ImageGalleryModal';

interface SpaHeroProps {
  spa: Spa;
}

export default function SpaHero({ spa }: SpaHeroProps) {
  const [imageError, setImageError] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const hasMultipleImages = spa.images.length > 1;

  return (
    <>
      <section className="container mx-auto px-4 mb-4 md:mb-12 lg:px-8">
        <div className="relative rounded-t-2xl overflow-hidden aspect-[389/350] md:aspect-[389/250] lg:h-[500px] lg:w-full shadow-2xl">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent z-10" />

          {/* Image */}
          {!imageError && spa.images[0] ? (
            <Image
              src={spa.images[0].src}
              alt={spa.images[0].alt}
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

          {/* Gallery Icon - Top Right */}
          {hasMultipleImages && (
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="absolute top-4 right-4 p-4 bg-soft-cream rounded-full border border-stone-400 text-white shadow-xl z-20"
              aria-label="View gallery"
            >
              <Images className="h-6 w-6 text-stone-500" strokeWidth={1.5} />
            </button>
          )}

          {/* Content Overlay - Bottom */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 z-20">
            {/* Spa Name (H1) */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-2 text-white">
              {spa.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      {hasMultipleImages && (
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={spa.images}
          initialIndex={0}
        />
      )}
    </>
  );
}
