import { ExternalLink, Sparkles, Bed, Calendar } from 'lucide-react';
import { Spa } from '@/types/spa';
import { appendUtmParams } from '@/lib/utils';

interface BookVisitCTAProps {
  spa: Spa;
}

export default function BookVisitCTA({ spa }: BookVisitCTAProps) {
  // Check which booking URLs are available
  const hasHotelBooking = Boolean(spa.hotelBookingUrl);
  const hasDayPassBooking = Boolean(spa.dayPassBookingUrl);
  const hasTreatmentBooking = Boolean(spa.treatmentBookingUrl);
  
  // If none of the booking URLs are available, fallback to websiteUrl
  const hasAnyBooking = hasHotelBooking || hasDayPassBooking || hasTreatmentBooking;
  const showFallback = !hasAnyBooking && spa.websiteUrl;

  return (
    <div className="bg-soft-cream">
      <div className="container mx-auto px-4 md:px-8 py-24">
        <section
          id="book"
          className="bg-emerald-950 rounded-[3rem] px-6 md:px-20 py-12 md:py-20 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Background Icon */}
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Sparkles className="h-64 w-64 text-white" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-6xl text-stone-50 mb-8 leading-tight max-w-4xl mx-auto">
              Book your {spa.name} experience
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-stone-400 text-lg mb-12 font-light">
                Reservations are highly recommended to ensure the highest level
                of personal service and availability.
              </p>
              
              {/* Booking Buttons Grid */}
              {hasAnyBooking ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Book a Stay */}
                  {hasHotelBooking && (
                    <a
                      href={appendUtmParams(spa.hotelBookingUrl!, 'book-stay')}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-spa-id={spa.url}
                      data-click-intent="book-stay"
                      className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 text-stone-50 font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
                    >
                      <Bed className="h-5 w-5" />
                      Book Stay
                      <ExternalLink className="h-4 w-4 opacity-60" />
                    </a>
                  )}

                  {/* Book a Spa Day */}
                  {hasDayPassBooking && (
                    <a
                      href={appendUtmParams(spa.dayPassBookingUrl!, 'book-day-pass')}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-spa-id={spa.url}
                      data-click-intent="book-day-pass"
                      className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 text-stone-50 font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
                    >
                      <Calendar className="h-5 w-5" />
                      Book Spa Day
                      <ExternalLink className="h-4 w-4 opacity-60" />
                    </a>
                  )}

                  {/* Book a Treatment */}
                  {hasTreatmentBooking && (
                    <a
                      href={appendUtmParams(spa.treatmentBookingUrl!, 'book-treatment')}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-spa-id={spa.url}
                      data-click-intent="book-treatment"
                      className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 text-stone-50 font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
                    >
                      <Sparkles className="h-5 w-5" />
                      Book Treatment
                      <ExternalLink className="h-4 w-4 opacity-60" />
                    </a>
                  )}
                </div>
              ) : showFallback ? (
                <a
                  href={appendUtmParams(spa.websiteUrl, 'book-stay')}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-spa-id={spa.url}
                  data-click-intent="book-stay"
                  className="inline-flex items-center justify-center px-10 py-5 bg-amber-600 text-stone-50 font-bold rounded-full shadow-xl uppercase tracking-widest text-xs"
                >
                  Visit the Official Website
                  <ExternalLink className="h-4 w-4 ml-3 opacity-60" />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
