import { Thermometer } from 'lucide-react';
import { Spa, ThermalFacility } from '@/types/spa';

interface ThermalFacilitiesProps {
  spa: Spa;
}

export default function ThermalFacilities({ spa }: ThermalFacilitiesProps) {
  if (spa.thermalFacilities.length === 0) {
    return null;
  }

  // Analyze thermal facilities
  const totalFacilities = spa.thermalFacilities.length;
  const facilityNames = spa.thermalFacilities.map((f) => f.name.toLowerCase());
  const facilityDetails = spa.thermalFacilities.map((f) =>
    f.details.toLowerCase()
  );
  const allText = [...facilityNames, ...facilityDetails].join(' ');

  // Detect features
  const hasSauna =
    allText.includes('sauna') ||
    allText.includes('finnish') ||
    allText.includes('herbal');
  const hasSteam =
    allText.includes('steam') ||
    allText.includes('rasul') ||
    allText.includes('hamam');
  const hasLaconium = allText.includes('laconium');
  const hasIce =
    allText.includes('ice') ||
    allText.includes('cold') ||
    allText.includes('plunge') ||
    allText.includes('fountain') ||
    allText.includes('drench');

  // Generate highlight text
  let highlightText = '';
  if (totalFacilities >= 8) {
    if (hasSauna && hasSteam && hasIce) {
      highlightText =
        'From traditional saunas to modern steam rooms and cold therapy experiences,';
    } else if (hasSauna && hasSteam) {
      highlightText = 'From traditional saunas to modern steam rooms,';
    } else if (hasSauna && hasIce) {
      highlightText = 'From traditional saunas to cold therapy experiences,';
    } else {
      highlightText =
        'From traditional heat therapy to modern wellness experiences,';
    }
  } else if (hasSauna && hasSteam) {
    highlightText = 'Featuring both sauna and steam room experiences,';
  } else if (hasSauna) {
    highlightText = 'With expertly maintained sauna facilities,';
  } else if (hasSteam) {
    highlightText = 'Featuring modern steam room experiences,';
  } else if (hasLaconium) {
    highlightText = 'Including Roman-style thermal experiences,';
  } else {
    highlightText = 'With thoughtfully designed thermal experiences,';
  }

  const suiteText =
    totalFacilities >= 8 ? 'comprehensive thermal suite' : 'thermal suite';

  return (
    <section
      id="thermal"
      className="bg-[#F2F0ED] py-32 border-y border-stone-200/50 w-screen relative left-1/2 -translate-x-1/2"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6">
          <div className="h-px w-12 bg-amber-700 opacity-30" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
          Thermal Facilities
        </h2>

        <p className="text-stone-500 leading-relaxed mb-8">
          Experience {spa.name}&apos;s {suiteText} featuring{' '}
          <strong className="text-stone-700">
            {totalFacilities} heat experiences
          </strong>{' '}
          designed to promote relaxation, improve circulation, and enhance your
          overall wellness journey. {highlightText} each facility offers unique
          therapeutic benefits to help you unwind and rejuvenate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {spa.thermalFacilities.map(
            (facility: ThermalFacility, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm"
              >
                <Thermometer className="h-5 w-5 text-amber-700 mb-4 opacity-30" />
                <h3 className="font-serif text-xl text-stone-800 mb-2">
                  {facility.name}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {facility.details}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
