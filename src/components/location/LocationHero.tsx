import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface LocationHeroProps {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function LocationHero({
  badge,
  titleLine1,
  titleLine2,
  description,
  imageSrc,
  imageAlt,
}: LocationHeroProps) {
  const hasImage = !!imageSrc;

  return (
    <section
      className={`relative pt-24 pb-20 overflow-hidden ${hasImage ? 'bg-stone-900' : 'bg-white'}`}
    >
      {hasImage ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt || ''}
            fill
            className="object-cover"
            quality={85}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/50 to-stone-900/30" />
        </>
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-emerald-50/30 via-transparent to-amber-50/20" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center mb-8">
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm ${hasImage ? 'bg-white/15 border border-white/25 text-white' : 'bg-emerald-50 border border-emerald-100 text-emerald-900'}`}
          >
            <MapPin className="h-3 w-3 mr-2" />
            {badge}
          </span>
        </div>

        <h1
          className={`font-serif text-5xl md:text-7xl tracking-tight leading-[1.1] mb-8 ${hasImage ? 'text-white' : 'text-stone-900'}`}
        >
          {titleLine1} <br />
          <span
            className={`italic font-medium ${hasImage ? 'text-white' : 'text-emerald-950'}`}
          >
            {titleLine2}
          </span>
        </h1>

        <p
          className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-12 italic ${hasImage ? 'text-white/80' : 'text-stone-500'}`}
        >
          {description}
        </p>

        <div className="h-px w-24 bg-amber-400 mx-auto" />
      </div>
    </section>
  );
}
