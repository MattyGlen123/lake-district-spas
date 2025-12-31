import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Bed, CreditCard, ShieldAlert } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaHero from '@/components/SpaHero';
import { Spa, accessLabelConfig } from '@/types/spa';
import { spaData } from '@/data/spas';

// Generate static params for all spas at build time
export async function generateStaticParams() {
  return spaData.map((spa) => ({
    slug: spa.id,
  }));
}

// Generate metadata for each spa page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const spa = spaData.find((s) => s.id === params.slug);

  if (!spa) {
    return {
      title: 'Spa Not Found',
      description: 'The requested spa could not be found.',
    };
  }

  return {
    title: `${spa.name} - Lake District Spas`,
    description: `Discover ${spa.name} in ${spa.location}. Compare spa facilities, access policies, and find your perfect wellness retreat.`,
  };
}

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

// Main page component
export default function SpaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const spa: Spa | undefined = spaData.find((s) => s.id === params.slug);

  if (!spa) {
    notFound();
  }

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
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <nav className="container mx-auto px-4 lg:px-8 py-4 md:py-6 text-sm flex items-center text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          <span className="hover:text-slate-700">{spa.location}</span>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
          <span className="text-slate-900 font-medium truncate">
            {spa.name}
          </span>
        </nav>
        <SpaHero spa={spa} />

        {/* Quick Facts Bar */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <p className="text-slate-900 font-semibold">
                    {spa.agePolicy}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Content sections will go here */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
