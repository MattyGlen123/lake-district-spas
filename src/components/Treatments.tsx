'use client';

import { useState } from 'react';
import { ChevronDown, Clock, Tag, ExternalLink } from 'lucide-react';
import { Spa, TreatmentCategory, Treatment } from '@/types/spa';
import { getTreatmentsBySpaId } from '@/data/treatments/index';

interface TreatmentsProps {
  spa: Spa;
}

interface TreatmentCardProps {
  treatment: Treatment;
  spa: Spa;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment, spa }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white border border-stone-200 rounded-3xl transition-all cursor-pointer overflow-hidden shadow-sm"
      onClick={() => setIsExpanded(!isExpanded)}
      aria-expanded={isExpanded}
    >
      <div className="p-6 md:p-8">
        {/* Header - Always Visible */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Treatment Name with Brand */}
            <div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <h4 className="font-serif text-xl text-stone-800">
                {treatment.name}
              </h4>
              {treatment.brand && (
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  {treatment.brand}
                </span>
              )}
            </div>

            {/* Duration with Clock Icon and Price */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-stone-400" />
                <span className="text-sm font-medium text-stone-500">
                  {treatment.duration}
                </span>
              </div>
              {treatment.price && (
                <div className="text-xs font-black text-emerald-950">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-800" />
                    <span className="text-sm font-medium text-emerald-800">
                      From{' '}
                      <span className="font-bold uppercase">
                        {treatment.price}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className={`mt-1 p-2 rounded-full transition-all ${
              isExpanded
                ? 'bg-stone-100 text-stone-400 rotate-180'
                : 'bg-stone-100 text-stone-400'
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* Expandable Description */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'grid-rows-[1fr] opacity-100 mt-4'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-stone-200 pt-4">
              <p className="text-stone-600 leading-relaxed mb-4">
                {treatment.shortDescription}
              </p>

              {/* Booking Buttons */}
              {(spa.treatmentBookingUrl || spa.treatmentBookingPhone) && (
                <div
                  className={`grid gap-6 ${
                    spa.treatmentBookingUrl && spa.treatmentBookingPhone
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {spa.treatmentBookingUrl && (
                    <a
                      href={spa.treatmentBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-3 bg-amber-700 text-white font-bold rounded-full text-sm uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                    >
                      Book Now
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {spa.treatmentBookingPhone && (
                    <a
                      href={`tel:${spa.treatmentBookingPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-3 bg-emerald-950 text-white font-bold rounded-full text-sm uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                    >
                      Call Now
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Treatments({ spa }: TreatmentsProps) {
  // Get treatments for this spa
  const spaTreatments = getTreatmentsBySpaId(spa.id);

  // Return null if no treatments
  if (spaTreatments.length === 0) {
    return null;
  }

  // Group by category
  const treatmentsByCategory = spaTreatments.reduce((acc, treatment) => {
    if (!acc[treatment.category]) {
      acc[treatment.category] = [];
    }
    acc[treatment.category].push(treatment);
    return acc;
  }, {} as Record<TreatmentCategory, typeof spaTreatments>);

  // Category order
  const categoryOrder: TreatmentCategory[] = [
    'Massage Therapies',
    'Facial Treatments',
    'Body Treatments',
    'Hands & Feet Treatments',
  ];

  const sortedCategories = categoryOrder.filter(
    (cat) => treatmentsByCategory[cat]
  );

  // Analyze treatments for dynamic intro
  const totalTreatments = spaTreatments.length;
  const categoryCount = sortedCategories.length;

  // Extract unique brands (up to 2)
  const brands = Array.from(
    new Set(
      spaTreatments.map((t) => t.brand).filter((b): b is string => Boolean(b))
    )
  ).slice(0, 2);

  // Generate brand text
  let brandText = '';
  if (brands.length === 2) {
    brandText = `, including ${brands[0]} and ${brands[1]} therapies`;
  } else if (brands.length === 1) {
    brandText = `, featuring ${brands[0]} products`;
  }

  return (
    <section
      id="treatments"
      className="bg-mineral-sage py-32 border-y border-stone-200/50 w-screen relative left-1/2 -translate-x-1/2"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Centered Intro */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.5em] text-amber-700 block mb-4">
            The Spa Menu
          </span>
          <h2 className="font-serif text-5xl md:text-6xl text-stone-900 mb-8 leading-tight">
            Treatments
          </h2>
          <div className="h-px w-24 bg-amber-200 mx-auto mb-10" />
          <p className="text-stone-600 text-lg md:text-xl font-light leading-relaxed">
            Explore {spa.name}&apos;s curated menu of{' '}
            <strong className="text-stone-800">
              {totalTreatments} luxury therapies across {categoryCount}{' '}
              categories
              {brandText}
            </strong>
            . From rejuvenating massages to revitalizing facial treatments, each
            experience is designed to restore balance and enhance wellbeing.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-32">
          {sortedCategories.map((category) => {
            const treatments = treatmentsByCategory[category];

            return (
              <div key={category}>
                {/* Category Header with Divider */}
                <div className="flex items-center gap-3 sm:gap-6 mb-12 flex-wrap">
                  <h3 className="text-[11px] font-black text-stone-600 uppercase tracking-[0.4em] whitespace-nowrap flex-shrink-0">
                    {category}
                  </h3>
                  <div className="h-px flex-1 min-w-[60px] bg-stone-200" />
                  <span className="text-amber-700 text-[10px] font-black tracking-widest px-3 py-1 border border-stone-200 rounded-full whitespace-nowrap flex-shrink-0">
                    {treatments.length}{' '}
                    {treatments.length === 1 ? 'Treatment' : 'Treatments'}
                  </span>
                </div>

                {/* Treatment Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {treatments.map((treatment, idx) => (
                    <TreatmentCard key={idx} treatment={treatment} spa={spa} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
