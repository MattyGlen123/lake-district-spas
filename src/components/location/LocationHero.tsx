import { MapPin } from 'lucide-react';

interface LocationHeroProps {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
}

export default function LocationHero({
  badge,
  titleLine1,
  titleLine2,
  description,
}: LocationHeroProps) {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-white">
      {/* Subtle Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-emerald-50/30 via-transparent to-amber-50/20" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900 shadow-sm">
            <MapPin className="h-3 w-3 mr-2" />
            {badge}
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-8xl text-stone-900 tracking-tight leading-[1.1] mb-8">
          {titleLine1} <br />
          <span className="italic font-medium text-emerald-950">{titleLine2}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-stone-500 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
          {description}
        </p>

        <div className="h-px w-24 bg-amber-400 mx-auto" />
      </div>
    </section>
  );
}

