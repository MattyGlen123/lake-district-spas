import { Spa } from '@/types/spa';

interface SpaIntroductionProps {
  spa: Spa;
}

export default function SpaIntroduction({ spa }: SpaIntroductionProps) {
  if (!spa.intro) {
    return null;
  }

  return (
    <section className="mb-32">
      {/* THE SETTING header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-px w-8 bg-amber-700 opacity-30" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-700">
          The Setting
        </span>
      </div>

      {/* Intro paragraphs */}
      <div className="space-y-12">
        {spa.intro.split('\n\n').map((paragraph, idx) => (
          <p
            key={idx}
            className={`text-lg text-stone-600 leading-relaxed font-light ${
              idx === 0
                ? 'first-letter:text-7xl md:first-letter:text-8xl first-letter:font-serif first-letter:font-bold first-letter:text-emerald-950 first-letter:float-left first-letter:mr-6 first-letter:mt-4 first-letter:leading-[0.7]'
                : ''
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
