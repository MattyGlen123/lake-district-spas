import {
  Thermometer,
  Waves,
  Sparkles,
  ShieldCheck,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { Spa } from '@/types/spa';
import { getTreatmentsBySpaId } from '@/data/treatments/index';

interface JumpToSectionProps {
  spa: Spa;
}

export default function JumpToSection({ spa }: JumpToSectionProps) {
  const jumpLinks = [];

  // Thermal Facilities
  if (spa.thermalFacilities.length > 0) {
    jumpLinks.push({
      id: 'thermal',
      label: 'Thermal',
      icon: Thermometer,
    });
  }

  // Pool Features
  if (spa.poolFeatures.length > 0) {
    jumpLinks.push({
      id: 'pools',
      label: 'Pools',
      icon: Waves,
    });
  }

  // Treatments
  const spaTreatments = getTreatmentsBySpaId(spa.id);
  if (spaTreatments.length > 0) {
    jumpLinks.push({
      id: 'treatments',
      label: 'Treatments',
      icon: Sparkles,
    });
  }

  // Access Policy
  if (spa.accessPolicy.length > 0) {
    jumpLinks.push({
      id: 'access',
      label: 'Access',
      icon: ShieldCheck,
    });
  }

  // Book Visit
  jumpLinks.push({
    id: 'book',
    label: 'Book',
    icon: Calendar,
  });

  if (jumpLinks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-y border-stone-200 mb-12 w-screen relative left-1/2 -translate-x-1/2">
      <div className="max-w-5xl mx-auto pl-4">
        <div className="flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2 mr-8 py-4 flex-shrink-0">
            <ChevronDown className="h-4 w-4 text-stone-800" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-800">
              Jump To
            </span>
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            {jumpLinks.map((link, index) => {
              const Icon = link.icon;
              const isLast = index === jumpLinks.length - 1;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`flex items-center gap-2 whitespace-nowrap py-4 -my-2 px-2 -mx-2 ${
                    isLast ? 'mr-4' : ''
                  }`}
                >
                  <Icon
                    className="h-3.5 w-3.5 text-amber-700"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
