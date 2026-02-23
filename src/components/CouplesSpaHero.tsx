import Image from 'next/image';
import { Heart } from 'lucide-react';

interface CouplesSpaHeroProps {
  backgroundImage?: string;
  backgroundImageAlt?: string;
}

export default function CouplesSpaHero({
  backgroundImage,
  backgroundImageAlt,
}: CouplesSpaHeroProps) {
  const hasImage = !!backgroundImage;

  return (
    <section
      className={`relative pt-24 pb-20 overflow-hidden ${hasImage ? 'bg-stone-900' : 'bg-white'}`}
    >
      {hasImage ? (
        <>
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt || ''}
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
            <Heart className="h-3 w-3 mr-2" />
            Couples Spa Guide
          </span>
        </div>

        <h1
          className={`font-serif text-5xl md:text-8xl tracking-tight leading-[1.1] mb-8 ${hasImage ? 'text-white' : 'text-stone-900'}`}
        >
          Couples Spa <br />
          <span className={`italic font-medium ${hasImage ? 'text-white' : 'text-emerald-950'}`}>
            Lake District
          </span>
        </h1>

        <p
          className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-12 italic ${hasImage ? 'text-white/80' : 'text-stone-500'}`}
        >
          Outdoor infinity pools with fell views, lakeside hot tubs, and thermal suites
          designed for reconnection. Our curated selection of the Lake District&apos;s most
          romantic spa hotels.
        </p>

        <div className="h-px w-24 bg-amber-400 mx-auto" />
      </div>
    </section>
  );
}

