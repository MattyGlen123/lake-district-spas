'use client';

import { useState } from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { Spa, TreatmentCategory, Treatment } from '@/types/spa';
import { getTreatmentsBySpaId } from '@/data/treatments/index';

interface TreatmentsProps {
  spa: Spa;
}

interface TreatmentCardProps {
  treatment: Treatment;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-slate-50 border rounded-xl transition-all cursor-pointer overflow-hidden ${
        isExpanded
          ? 'border-blue-300 shadow-md ring-1 ring-blue-50'
          : 'border-slate-200 hover:border-blue-200 hover:shadow-sm'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
      aria-expanded={isExpanded}
    >
      <div className="p-4 md:p-6">
        {/* Header - Always Visible */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Treatment Name */}
            <h4 className="font-bold text-lg text-slate-900 mb-2">
              {treatment.name}
            </h4>

            {/* Brand and Duration */}
            <div className="flex flex-wrap items-center gap-2">
              {treatment.brand && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">
                  {treatment.brand}
                </span>
              )}
              <span className="text-sm font-medium text-slate-500">
                {treatment.duration}
              </span>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className={`mt-1 p-1.5 rounded-full transition-colors ${
              isExpanded
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-400 hover:text-blue-600'
            }`}
          >
            {isExpanded ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
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
            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-600 leading-relaxed">
                {treatment.shortDescription}
              </p>
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
    'Body Treatments & Rituals',
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
    <section id="treatments" className="mt-16 mb-16">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Sparkles className="h-7 w-7 text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">
          Spa Treatments & Therapies
        </h2>
      </div>

      {/* Intro paragraph */}
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Explore {spa.name}&apos;s curated menu of{' '}
        <strong>
          {totalTreatments} luxury therapies across {categoryCount} categories
          {brandText}
        </strong>
        . From rejuvenating massages to revitalizing facial treatments, each
        experience is designed to restore balance and enhance wellbeing.
      </p>

      {/* Categories */}
      <div className="space-y-16">
        {sortedCategories.map((category) => {
          const treatments = treatmentsByCategory[category];

          return (
            <div key={category}>
              {/* Category Header */}
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3" />
                {category}
                <span className="ml-3 text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {treatments.length}{' '}
                  {treatments.length === 1 ? 'Treatment' : 'Treatments'}
                </span>
              </h3>

              {/* Treatment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {treatments.map((treatment, idx) => (
                  <TreatmentCard key={idx} treatment={treatment} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
