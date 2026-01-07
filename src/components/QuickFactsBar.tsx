import { Bed, CreditCard, ShieldAlert } from 'lucide-react';
import { Spa, accessLabelConfig } from '@/types/spa';

interface QuickFactsBarProps {
  spa: Spa;
}

export default function QuickFactsBar({ spa }: QuickFactsBarProps) {
  // Get hotel access label for Guest Access card
  const hotelAccessLabel = spa.accessLabels.find(
    (label) => accessLabelConfig[label].category === 'hotel'
  );

  return (
    <section className="container mx-auto px-4 lg:px-8 relative z-10 -mt-8 md:-mt-16 lg:-mt-20 mb-12">
      <div
        className={`grid grid-flow-row gap-px bg-stone-200 border border-stone-200 rounded-2xl overflow-hidden shadow-xl ${
          spa.agePolicy
            ? 'grid-cols-1 md:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {/* Guest Access Card */}
        <div className="bg-white p-6 flex items-center space-x-4 md:flex-col md:items-center md:space-x-0 md:space-y-3 min-w-0">
          <div className="text-amber-600 flex-shrink-0">
            <Bed className="h-6 w-6" />
          </div>
          <div className="md:text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
              Guest Access
            </p>
            <p className="text-sm font-semibold text-stone-800">
              {hotelAccessLabel
                ? accessLabelConfig[hotelAccessLabel].label
                : 'Contact spa for details'}
            </p>
          </div>
        </div>

        {/* Day Passes Card */}
        <div className="bg-white p-6 flex items-center space-x-4 md:flex-col md:items-center md:space-x-0 md:space-y-3 min-w-0">
          <div className="text-amber-600 flex-shrink-0">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="md:text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
              Day Passes
            </p>
            <p className="text-sm font-semibold text-stone-800">
              {spa.accessLabels.includes('day-passes-available')
                ? 'Available to book'
                : 'Not Available'}
            </p>
          </div>
        </div>

        {/* Age Policy Card (Conditional) */}
        {spa.agePolicy && (
          <div className="bg-white p-6 flex items-center space-x-4 md:flex-col md:items-center md:space-x-0 md:space-y-3 min-w-0">
            <div className="text-amber-600 flex-shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="md:text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Age Policy
              </p>
              <p className="text-sm font-semibold text-stone-800">
                {spa.agePolicy}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
