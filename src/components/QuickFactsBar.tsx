import { Bed, CreditCard, ShieldAlert } from 'lucide-react';
import { Spa, accessLabelConfig } from '@/types/spa';

// Helper function to convert spa color to light variant for icon backgrounds
function getColorClasses(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-spa-green': 'bg-green-50 text-green-600',
    'bg-spa-purple': 'bg-purple-50 text-purple-600',
    'bg-spa-yellow': 'bg-yellow-50 text-yellow-600',
    'bg-spa-red': 'bg-red-50 text-red-600',
    'bg-spa-blue': 'bg-blue-50 text-blue-600',
  };
  return colorMap[colorClass] || 'bg-slate-50 text-slate-600';
}

interface QuickFactsBarProps {
  spa: Spa;
}

export default function QuickFactsBar({ spa }: QuickFactsBarProps) {
  // Get hotel access label for Guest Access card
  const hotelAccessLabel = spa.accessLabels.find(
    (label) => accessLabelConfig[label].category === 'hotel'
  );
  const guestAccessColor = hotelAccessLabel
    ? getColorClasses(accessLabelConfig[hotelAccessLabel].color)
    : 'bg-slate-50 text-slate-600';

  // Get day passes label for Day Passes card
  const dayPassesLabel = spa.accessLabels.includes('day-passes-available')
    ? 'day-passes-available'
    : spa.accessLabels.includes('no-day-passes-available')
    ? 'no-day-passes-available'
    : null;
  const dayPassesColor = dayPassesLabel
    ? getColorClasses(accessLabelConfig[dayPassesLabel].color)
    : 'bg-slate-50 text-slate-600';

  return (
    <section className="container mx-auto px-4 md:px-8 mb-16">
      <div
        className={`grid gap-4 ${
          spa.agePolicy
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {/* Guest Access Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
          <div className={`p-3 ${guestAccessColor} rounded-lg`}>
            <Bed className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              Guest Access
            </p>
            <p className="text-slate-900 font-semibold">
              {hotelAccessLabel
                ? accessLabelConfig[hotelAccessLabel].label
                : 'Contact spa for details'}
            </p>
          </div>
        </div>

        {/* Day Passes Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
          <div className={`p-3 ${dayPassesColor} rounded-lg`}>
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              Day Passes
            </p>
            <p className="text-slate-900 font-semibold">
              {spa.accessLabels.includes('day-passes-available')
                ? 'Available to book'
                : 'Not Available'}
            </p>
          </div>
        </div>

        {/* Age Policy Card (Conditional) */}
        {spa.agePolicy && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
                Age Policy
              </p>
              <p className="text-slate-900 font-semibold">{spa.agePolicy}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
