import { Thermometer } from 'lucide-react';
import { Spa, ThermalFacility } from '@/types/spa';

interface ThermalFacilitiesProps {
  spa: Spa;
}

export default function ThermalFacilities({ spa }: ThermalFacilitiesProps) {
  if (spa.thermalFacilities.length === 0) {
    return null;
  }

  return (
    <section id="thermal" className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Thermometer className="h-7 w-7 text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">
          Thermal Facilities
        </h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Experience {spa.name}'s comprehensive thermal suite featuring a range of
        heat therapy experiences designed to promote relaxation, improve
        circulation, and enhance your overall wellness journey. From traditional
        saunas to modern steam rooms, each facility offers unique therapeutic
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
