import Link from 'next/link';
import { Clock, Tag, MapPin, ExternalLink } from 'lucide-react';
import { Treatment, Spa } from '@/types/spa';
import { appendUtmParams } from '@/lib/utils';

interface TreatmentPickCardProps {
  treatment: Treatment;
  spa: Spa;
}

export default function TreatmentPickCard({
  treatment,
  spa,
}: TreatmentPickCardProps) {
  return (
    <article className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Spa Header */}
      <Link
        href={`/spa/${spa.url}`}
        className="px-4 pt-4 pb-3 border-b border-stone-100 bg-amber-50 flex items-center justify-between"
      >
        <h3 className="font-serif text-lg text-stone-900">{spa.name}</h3>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-stone-400" strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
            {spa.location}
          </span>
        </div>
      </Link>

      {/* Treatment Content */}
      <div className="p-6">
        {/* Treatment Name with Brand */}
        <div className="mb-4">
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
        </div>

        {/* Duration and Price */}
        <div className="flex items-center gap-6 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-stone-400" />
            <span className="text-sm font-medium text-stone-500">
              {treatment.duration}
            </span>
          </div>
          {treatment.price && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-emerald-800" />
              <span className="text-sm font-medium text-emerald-800">
                From {treatment.price}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          {treatment.shortDescription}
        </p>

        {/* Booking Button */}
        {spa.treatmentBookingUrl ? (
          <a
            href={appendUtmParams(spa.treatmentBookingUrl, 'specific-product-click')}
            target="_blank"
            rel="noopener noreferrer"
            data-spa-id={spa.url}
            data-click-intent="specific-product-click"
            data-product-name={treatment.name}
            className="mx-auto max-w-[200px] flex items-center justify-center gap-1 px-4 py-3 bg-amber-700 text-white font-bold rounded-full text-sm uppercase tracking-wider shadow-sm"
          >
            Book Now
            <ExternalLink className="h-2 w-2" />
          </a>
        ) : spa.treatmentBookingPhone ? (
          <a
            href={appendUtmParams(`tel:${spa.treatmentBookingPhone}`, 'specific-product-click')}
            data-spa-id={spa.url}
            data-click-intent="specific-product-click"
            data-product-name={treatment.name}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-950 text-white font-bold rounded-full text-sm uppercase tracking-wider shadow-sm"
          >
            Call Now
          </a>
        ) : null}
      </div>
    </article>
  );
}

