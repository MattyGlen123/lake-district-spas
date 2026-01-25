'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DayPassCard from './DayPassCard';
import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { spaData } from '@/data/spas';
import { DayPassOption, Spa } from '@/types/spa';

interface DayPassWithSpa {
  dayPass: DayPassOption;
  spa: Spa;
}

export default function CouplesDayPasses() {
  // Featured day pass IDs
  const featuredDayPassIds = [
    'armathwaite-sunset-weekday',
    'lodore-falls-derwent-delight',
    'low-wood-bay-hideaway-retreat',
    'swan-champagne-truffle-spa-day',
  ];

  // Spa IDs for the featured spas
  const featuredSpaIds = [2, 1, 7, 5];

  // Get day passes for each spa and filter by featured IDs
  const dayPassesWithSpa: DayPassWithSpa[] = [];

  featuredSpaIds.forEach((spaId) => {
    const dayPasses = getDayPassOptionsBySpaId(spaId);
    const spa = spaData.find((s) => s.id === spaId);

    if (spa) {
      dayPasses.forEach((dayPass) => {
        if (featuredDayPassIds.includes(dayPass.id)) {
          dayPassesWithSpa.push({ dayPass, spa });
        }
      });
    }
  });

  // Sort A-Z by spa name
  dayPassesWithSpa.sort((a, b) => a.spa.name.localeCompare(b.spa.name));

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-6">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">
                Spontaneous Romance
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
                Couples Day Experiences
              </h2>
              <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
                Experience a romantic spa day without booking an overnight stay.
                Each of our featured spas offers day passes perfect for couples.
              </p>
            </div>
            <div className="flex-shrink-0 mt-6 md:mt-0">
              <Link
                href="/spa-days/"
                className="inline-flex items-center text-emerald-900 font-semibold text-sm"
              >
                Browse all day passes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Day Pass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dayPassesWithSpa.map(({ dayPass, spa }) => (
            <DayPassCard key={dayPass.id} dayPass={dayPass} spa={spa} />
          ))}
        </div>
      </div>
    </section>
  );
}

