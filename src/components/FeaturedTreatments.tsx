'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TreatmentPickCard from './TreatmentPickCard';
import { getTreatmentsBySpaId } from '@/data/treatments';
import { spaData } from '@/data/spas';
import { Treatment, Spa } from '@/types/spa';

interface TreatmentWithSpa {
  treatment: Treatment;
  spa: Spa;
}

export default function FeaturedTreatments() {
  // Featured treatment names (exact matches)
  const featuredTreatmentNames = [
    'Drift Away',
    'Organic Rebalance Ritual',
    'Journey of the Senses: Rasul Ritual',
    'The Falls Signature Relaxing Massage',
    'Berry & Birch Lost in the Clouds Massage',
    'The Sculpt and Soothe Treatment Experience',
    'Champagne And Truffles Facial - 60 Mins',
    'Drift Away Full Body Massage - 60 Mins',
  ];

  // Spa IDs for the featured spas
  const featuredSpaIds = [2, 1, 7, 5];

  // Get treatments for each spa and filter by featured names
  const treatmentsWithSpa: TreatmentWithSpa[] = [];

  featuredSpaIds.forEach((spaId) => {
    const treatments = getTreatmentsBySpaId(spaId);
    const spa = spaData.find((s) => s.id === spaId);

    if (spa) {
      treatments.forEach((treatment) => {
        if (featuredTreatmentNames.includes(treatment.name)) {
          treatmentsWithSpa.push({ treatment, spa });
        }
      });
    }
  });

  // Sort A-Z by spa name
  treatmentsWithSpa.sort((a, b) => a.spa.name.localeCompare(b.spa.name));

  return (
    <section className="py-32 bg-stone-50">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-6">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">
                Our Treatment Picks
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
                Dual Treatments
              </h2>
              <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
                Many of our featured spas offer side-by-side treatment rooms and
                shared wellness rituals. From the ancient Arabian Rasul at
                Lodore Falls to Mediterranean-inspired massages designed for
                complete relaxation.
              </p>
            </div>
            <div className="flex-shrink-0 mt-6 md:mt-0">
              <Link
                href="/"
                className="inline-flex items-center text-emerald-900 font-semibold text-sm"
              >
                Browse all spas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Treatment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {treatmentsWithSpa.map(({ treatment, spa }) => (
            <TreatmentPickCard
              key={`${spa.id}-${treatment.name}`}
              treatment={treatment}
              spa={spa}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

