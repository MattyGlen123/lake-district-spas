import { Check, ExternalLink, CreditCard, Users, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { DayPassOption, Spa } from '@/types/spa';

interface DayPassCardProps {
  dayPass: DayPassOption;
  spa: Spa;
}

export default function DayPassCard({ dayPass, spa }: DayPassCardProps) {
  const formatPrice = (value: number) =>
    value.toLocaleString('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <article className="bg-white rounded-3xl border border-stone-200 shadow-lg flex flex-col overflow-hidden">
      {/* Spa Header */}
      <Link
        href={`/spa/${spa.url}`}
        className="px-4 pt-4 pb-3 border-b border-stone-100 bg-amber-50"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg text-stone-900">
              {spa.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-stone-400" strokeWidth={2.5} />
              <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                {spa.location}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Day Pass Content */}
      <div className="py-6 px-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-8">
          <div className="flex flex-col items-start">
            <div className="h-12 w-12 rounded-full bg-stone-50 flex items-center justify-center text-amber-700 border border-stone-200 flex-shrink-0">
              <CreditCard className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <div className="text-right space-y-0.5 flex-shrink-0">
            <div className="text-emerald-900 whitespace-nowrap">
              <span className="font-serif text-xs md:text-sm">From</span>{' '}
              <span className="font-serif text-2xl md:text-3xl font-semibold">
                £{formatPrice(dayPass.priceGBP)}
              </span>
            </div>
            {typeof dayPass.pricePerPerson === 'number' && (
              <div className="text-amber-800 whitespace-nowrap">
                <span className="font-serif text-[10px] md:text-xs">From</span>{' '}
                <span className="text-[11px] md:text-xs">
                  <span className="font-bold">£{formatPrice(dayPass.pricePerPerson)}</span> per person
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          {dayPass.requiredNumbers && (
            <span className="mt-b inline-flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
              <Users className="h-3 w-3" />
              {dayPass.requiredNumbers}
            </span>
          )}
          <h4 className="font-serif text-xl text-stone-950">
            {dayPass.packageName}
          </h4>
        </div>

        <p className="text-stone-600 text-base md:text-sm font-light mb-6">
          {dayPass.description}{' '}
          <a
            href={dayPass.dayPassUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            More info{' '}
            <ExternalLink className="h-2 w-2 inline-block align-top" style={{ verticalAlign: '0.1em' }} />
          </a>
        </p>

        <ul className="space-y-2 mb-8">
          {dayPass.included.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600 mt-[2px] flex-shrink-0" />
              <span className="text-stone-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          {dayPass.bookingUrl ? (
            <a
              href={dayPass.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-950 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap"
            >
              <span className="leading-none">Book Pass</span>
              <ExternalLink className="h-3 w-3 self-start" />
            </a>
          ) : dayPass.bookingEmail ? (
            <a
              href={`mailto:${dayPass.bookingEmail}`}
              className="flex items-center justify-center gap-2 bg-emerald-950 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap"
            >
              <span className="leading-none">Email Us</span>
              <Mail className="h-3 w-3 self-start" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

