import { MapPin } from 'lucide-react';
import { Spa } from '@/types/spa';

interface SpaIntroductionProps {
  spa: Spa;
}

export default function SpaIntroduction({ spa }: SpaIntroductionProps) {
  if (!spa.intro) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="prose prose-lg prose-slate max-w-none">
        {spa.intro.split('\n\n').map((paragraph, idx) => (
          <p
            key={idx}
            className="text-lg text-slate-700 leading-relaxed mb-4 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
