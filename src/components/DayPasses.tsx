import { Check, ExternalLink, Ticket, Users } from 'lucide-react';
import { Spa } from '@/types/spa';
import { getDayPassOptionsBySpaId } from '@/data/day-passes';

interface DayPassesProps {
  spa: Spa;
}

export default function DayPasses({ spa }: DayPassesProps) {
  const dayPassOptions = getDayPassOptionsBySpaId(spa.id);

  if (!dayPassOptions || dayPassOptions.length === 0) {
    return null;
  }

  const formatPrice = (value: number) =>
    value.toLocaleString('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

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

        <p className="text-stone-500 leading-relaxed mb-8 max-w-3xl">
          Explore our curated day packages designed for those seeking a temporary
          sanctuary in the Lakes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10">
          {dayPassOptions.map((option) => (
            <article
              key={option.id}
              className="bg-white py-6 px-4 rounded-3xl border border-stone-200 shadow-lg flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-8">
                <div className="flex flex-col items-start">
                  <div className="h-12 w-12 rounded-full bg-stone-50 flex items-center justify-center text-amber-700 border border-stone-200 flex-shrink-0">
                    <Ticket className="h-6 w-6" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-right space-y-0.5 flex-shrink-0">
                  <div className="text-emerald-900 whitespace-nowrap">
                    <span className="font-serif text-xs md:text-sm">From</span>{' '}
                    <span className="font-serif text-2xl md:text-3xl font-semibold">
                      £{formatPrice(option.priceGBP)}
                    </span>
                  </div>
                  {typeof option.pricePerPerson === 'number' && (
                    <div className="text-amber-800 whitespace-nowrap">
                      <span className="font-serif text-[10px] md:text-xs">From</span>{' '}
                      <span className="text-[11px] md:text-xs">
                        <span className='font-bold'>£{formatPrice(option.pricePerPerson)}</span> per person
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                  {option.requiredNumbers && (
                    <span className="mt-b inline-flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                      <Users className="h-3 w-3" />
                      {option.requiredNumbers}
                    </span>
                  )}
                <h3 className="font-serif text-xl text-stone-950">
                  {option.packageName}
                </h3>
              </div>

              <p className="text-stone-600 text-base md:text-sm font-light mb-6">
                {option.description}{' '}
                  <a
                  href={option.dayPassUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  More info{' '}
                  <ExternalLink className="h-2 w-2 inline-block align-top" style={{ verticalAlign: '0.1em' }} />
                </a>
              </p>

              <ul className="space-y-2 mb-8">
                {option.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600 mt-[2px] flex-shrink-0" />
                    <span className="text-stone-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <a
                  href={option.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-950 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap"
                >
                  <span className="leading-none">Book Pass</span>
                  <ExternalLink className="h-2 w-2 self-start" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


