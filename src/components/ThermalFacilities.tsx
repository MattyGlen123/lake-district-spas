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
    <section id="thermal" className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Thermometer className="h-7 w-7 text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">
          Thermal Facilities
        </h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Experience {spa.name}&apos;s {suiteText} featuring{' '}
        <strong>{totalFacilities} heat experiences</strong> designed to promote
        relaxation, improve circulation, and enhance your overall wellness
        journey. {highlightText} each facility offers unique therapeutic
        benefits to help you unwind and rejuvenate.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spa.thermalFacilities.map((facility: ThermalFacility, idx: number) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 p-6 rounded-xl"
          >
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              {facility.name}
            </h3>
            <p className="text-slate-600">{facility.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
