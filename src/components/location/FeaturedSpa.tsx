'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Images, ArrowRight, Ticket, Sparkles } from 'lucide-react';
import { Spa } from '@/types/spa';
import ImageGalleryModal from '@/components/ImageGalleryModal';
import SpaAccessBadges from '@/components/SpaAccessBadges';
import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { getTreatmentsBySpaId } from '@/data/treatments';

interface FeaturedSpaProps {
  spa: Spa;
}

/**
 * Get the lowest day pass price for a spa
 * Uses priceGBP from all available day pass options
 */
function getLowestDayPassPrice(spaId: number): number | null {
  const dayPassOptions = getDayPassOptionsBySpaId(spaId);
  if (!dayPassOptions || dayPassOptions.length === 0) {
    return null;
  }

  const prices = dayPassOptions.map((option) => option.priceGBP);
  return Math.min(...prices);
}

/**
 * Get the lowest treatment price for a spa
 * Parses price strings (e.g., '£105') to extract numeric values
 */
function getLowestTreatmentPrice(spaId: number): number | null {
  const treatments = getTreatmentsBySpaId(spaId);
  if (!treatments || treatments.length === 0) {
    return null;
  }

  const prices = treatments
    .filter((treatment) => treatment.price) // Only treatments with prices
    .map((treatment) => {
      // Parse price string like '£105' or '£110' to number
      const priceStr = treatment.price!.replace(/[£,]/g, ''); // Remove £ and commas
      return parseFloat(priceStr);
    })
    .filter((price) => !isNaN(price)); // Filter out invalid prices

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

export default function FeaturedSpa({ spa }: FeaturedSpaProps) {
  const [imageError, setImageError] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const hasMultipleImages = spa.images.length > 1;
  const lowestDayPassPrice = getLowestDayPassPrice(spa.id);
  const lowestTreatmentPrice = getLowestTreatmentPrice(spa.id);

  return (
    <>
      <article className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Mobile & Tablet: Stacked Layout */}
        <div className="lg:hidden">
          {/* Image Container - Square on mobile, landscape on tablet */}
          <div className="relative w-full aspect-square md:aspect-[16/9] overflow-hidden">
            {!imageError && spa.images[0] ? (
              <Image
                src={spa.images[0].src}
                alt={spa.images[0].alt}
                fill
                className="w-full h-full object-cover"
                quality={85}
                sizes="100vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                <span className="text-sm">Image not available</span>
              </div>
            )}

            {/* Gallery Icon - Top Right */}
            {hasMultipleImages && (
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="absolute top-4 right-4 p-4 bg-soft-cream rounded-full border border-stone-400 shadow-xl z-20"
                aria-label="View gallery"
              >
                <Images className="h-6 w-6 text-stone-500" strokeWidth={1.5} />
              </button>
            )}

            {/* Badges at bottom left */}
            <SpaAccessBadges accessLabels={spa.accessLabels} />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-serif text-3xl text-stone-900 mb-3">
              {spa.name}
            </h3>

            {/* Day Pass Price */}
            {lowestDayPassPrice !== null && (
              <div className="flex items-center gap-1.5 mb-3 text-stone-500">
                <Ticket className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-s">
                  Day Passes From £{lowestDayPassPrice}
                </span>
              </div>
            )}

            {/* Treatment Price */}
            {lowestTreatmentPrice !== null && (
              <div className="flex items-center gap-1.5 mb-6 text-stone-500">
                <Sparkles className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-s">
                  Treatments From £{lowestTreatmentPrice}
                </span>
              </div>
            )}

            {/* Thermal Facilities */}
            {spa.thermalFacilities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">
                  Thermal Facilities
                </h4>
                <ul className="space-y-2.5">
                  {spa.thermalFacilities.map((facility, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-stone-600 text-sm leading-relaxed"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500/60 mt-1.5 mr-3 flex-shrink-0" />
                      {facility.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pool Features */}
            {spa.poolFeatures.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">
                  Pool Features
                </h4>
                <ul className="space-y-2.5">
                  {spa.poolFeatures.map((pool, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-stone-600 text-sm leading-relaxed"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500/60 mt-1.5 mr-3 flex-shrink-0" />
                      {pool.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* View Spa Button */}
            <Link
              href={`/spa/${spa.url}`}
              className="flex w-full items-center justify-center gap-2 px-10 py-5 bg-emerald-950 text-white font-bold rounded-full text-xs uppercase tracking-widest shadow-xl"
            >
              View Spa Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Desktop: Side-by-side Layout (40/60) */}
        <div className="hidden lg:flex">
          {/* Image - 40% */}
          <div className="relative w-[40%] aspect-square overflow-hidden">
            {!imageError && spa.images[0] ? (
              <Image
                src={spa.images[0].src}
                alt={spa.images[0].alt}
                fill
                className="w-full h-full object-cover"
                quality={85}
                sizes="40vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                <span className="text-sm">Image not available</span>
              </div>
            )}

            {/* Gallery Icon - Top Right */}
            {hasMultipleImages && (
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="absolute top-4 right-4 p-4 bg-soft-cream rounded-full border border-stone-400 shadow-xl z-20"
                aria-label="View gallery"
              >
                <Images className="h-6 w-6 text-stone-500" strokeWidth={1.5} />
              </button>
            )}

            {/* Badges at bottom left */}
            <SpaAccessBadges accessLabels={spa.accessLabels} />
          </div>

          {/* Content - 60% */}
          <div className="flex-1 p-8 flex flex-col">
            <h3 className="font-serif text-3xl text-stone-900 mb-3">
              {spa.name}
            </h3>

            {/* Day Pass Price */}
            {lowestDayPassPrice !== null && (
              <div className="flex items-center gap-1.5 mb-3 text-stone-500">
                <Ticket className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-s">
                  Day Passes From £{lowestDayPassPrice}
                </span>
              </div>
            )}

            {/* Treatment Price */}
            {lowestTreatmentPrice !== null && (
              <div className="flex items-center gap-1.5 mb-6 text-stone-500">
                <Sparkles className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-s">
                  Treatments From £{lowestTreatmentPrice}
                </span>
              </div>
            )}

            {/* Thermal Facilities */}
            {spa.thermalFacilities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">
                  Thermal Facilities
                </h4>
                <ul className="space-y-2.5">
                  {spa.thermalFacilities.map((facility, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-stone-600 text-sm leading-relaxed"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500/60 mt-1.5 mr-3 flex-shrink-0" />
                      {facility.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pool Features */}
            {spa.poolFeatures.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">
                  Pool Features
                </h4>
                <ul className="space-y-2.5">
                  {spa.poolFeatures.map((pool, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-stone-600 text-sm leading-relaxed"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-500/60 mt-1.5 mr-3 flex-shrink-0" />
                      {pool.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* View Spa Button */}
            <div className="mt-auto">
              <Link
                href={`/spa/${spa.url}`}
                className="flex w-full items-center justify-center gap-2 px-10 py-4 bg-emerald-950 text-white font-bold rounded-full text-xs uppercase tracking-widest shadow-xl"
              >
                View Spa Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>

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

