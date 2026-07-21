import { Spa } from '@/types/spa';
import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { getBookingLinkProps } from '@/lib/utils';
import DayPassCard from './DayPassCard';

interface DayPassesProps {
  spa: Spa;
}

export default function DayPasses({ spa }: DayPassesProps) {
  const dayPassOptions = getDayPassOptionsBySpaId(spa.id);

  if (!dayPassOptions || dayPassOptions.length === 0) {
    return null;
  }

  return (
    <section
      id="day-passes"
      className="bg-amber-50/30 py-32 border-y border-stone-200 scroll-mt-32 md:scroll-mt-48 w-screen relative left-1/2 -translate-x-1/2"
    >
      <div className="container mx-auto px-4 md:px-8">
      <div className="h-px w-12 bg-amber-700 mb-6" />

        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4 leading-tight">
          Day Passes
        </h2>

        <p className="text-stone-500 leading-relaxed mb-4 max-w-3xl">
          Explore our curated day packages designed for those seeking a temporary
          sanctuary in the Lakes.
        </p>

        {spa.dayPassBookingUrl && (
          <div className="mb-8">
            <a
              {...getBookingLinkProps(spa.dayPassBookingUrl, {
                spaId: spa.url,
                clickIntent: 'all-day-passes',
              })}
              className="inline-flex items-center justify-center gap-2 bg-emerald-950 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap"
            >
              <span className="leading-none">Book Day Pass</span>
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10">
          {dayPassOptions.map((option) => (
            <DayPassCard
              key={option.id}
              dayPass={option}
              spa={spa}
              showSpaHeader={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
