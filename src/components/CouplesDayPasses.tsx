import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DayPassCard from './DayPassCard';
import { getAllDayPassesWithSpa } from '@/data/day-passes';
import { spaData } from '@/data/spas';
interface CouplesDayPassesProps {
  featuredDayPassIds: string[];
  heading: string;
  eyebrowLabel: string;
  description: string;
  ctaLabel: string;
  ctaVariant?: 'link' | 'button';
  background?: string;
}

export default function CouplesDayPasses({
  featuredDayPassIds,
  heading,
  eyebrowLabel,
  description,
  ctaLabel,
  ctaVariant = 'link',
  background = 'bg-white',
}: CouplesDayPassesProps) {
  const allPasses = getAllDayPassesWithSpa(spaData);

  const dayPassesWithSpa = allPasses
    .filter((dayPass) => featuredDayPassIds.includes(dayPass.id))
    .sort((a, b) => a.spa.name.localeCompare(b.spa.name));

  return (
    <section className={`py-32 ${background}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <div
            className={
              ctaVariant === 'link'
                ? 'flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-6'
                : 'flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-6'
            }
          >
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">
                {eyebrowLabel}
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
                {heading}
              </h2>
              <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>

            {ctaVariant === 'link' && (
              <div className="flex-shrink-0 mt-6 md:mt-0">
                <Link
                  href="/spa-days/"
                  className="inline-flex items-center text-emerald-900 font-semibold text-sm"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}

            {ctaVariant === 'button' && (
              <div className="flex-shrink-0 mt-8 md:mt-0">
              <Link
                href="/spa-days/"
                className="inline-flex items-center gap-2 bg-emerald-950 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dayPassesWithSpa.map(({ spa, ...dayPass }) => (
            <DayPassCard key={dayPass.id} dayPass={dayPass} spa={spa} />
          ))}
          </div>
        </div>
      </section>
  );
}

