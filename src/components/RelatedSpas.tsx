import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Spa, accessLabelConfig } from '@/types/spa';
import { spaData } from '@/data/spas';

interface RelatedSpasProps {
  spa: Spa;
}

export default function RelatedSpas({ spa }: RelatedSpasProps) {
  const relatedSpas = spa.relatedSpas
    .map((id) => spaData.find((s) => s.id === id))
    .filter((s): s is Spa => s !== undefined);

  if (relatedSpas.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-32">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px w-12 bg-amber-700 opacity-30" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
              Explore More
            </span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900">
              Similar Spas to Explore
            </h2>
            <Link
              href="/"
              className="text-stone-900 font-semibold flex items-center text-sm"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Spa Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedSpas.map((relatedSpa) => {
            const sortedAccessLabels = [...relatedSpa.accessLabels].sort(
              (a, b) => {
                const aCategory = accessLabelConfig[a].category;
                const bCategory = accessLabelConfig[b].category;
                if (aCategory === 'hotel' && bCategory === 'public') return -1;
                if (aCategory === 'public' && bCategory === 'hotel') return 1;
                return 0;
              }
            );

            return (
              <Link
                key={relatedSpa.id}
                href={`/spa/${relatedSpa.url}`}
                className="group block"
              >
                <div className="space-y-6">
                  {/* Image Container */}
                  <div className="relative aspect-[7/6] rounded-[2rem] overflow-hidden shadow-sm border border-stone-100">
                    <Image
                      src={relatedSpa.imageSrc}
                      alt={relatedSpa.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-60" />

                    {/* Badges at bottom */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                      {sortedAccessLabels.map((label) => {
                        const config = accessLabelConfig[label];
                        const badgeColorMap: Record<string, string> = {
                          'bg-spa-green':
                            'bg-emerald-50 text-black border border-emerald-200',
                          'bg-spa-purple':
                            'bg-purple-50 text-black border border-purple-200',
                          'bg-spa-yellow':
                            'bg-amber-50 text-black border border-amber-200',
                          'bg-spa-red':
                            'bg-red-50 text-black border border-red-200',
                          'bg-spa-blue':
                            'bg-blue-50 text-black border border-blue-200',
                        };
                        const badgeClasses =
                          badgeColorMap[config.color] ||
                          'bg-white text-black border border-stone-200';

                        return (
                          <div
                            key={label}
                            className={`${badgeClasses} px-3 py-1.5 rounded-full text-xs font-semibold`}
                          >
                            <span>{config.shortLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-5 px-1">
                    {/* Location with divider */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <MapPin className="h-3 w-3 mr-1.5 opacity-60" />
                        {relatedSpa.location}
                      </div>
                      <div className="h-px flex-grow bg-stone-100" />
                    </div>

                    <div className="space-y-5">
                      {/* Spa Name */}
                      <h3 className="font-serif text-3xl text-stone-900 leading-[1.2]">
                        {relatedSpa.name}
                      </h3>

                      {/* Key Features with amber dots */}
                      <ul className="space-y-2.5">
                        {relatedSpa.keyFeatures
                          .slice(0, 3)
                          .map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-stone-500 text-[11px] font-bold uppercase tracking-[0.1em] leading-tight"
                            >
                              <span className="h-1 w-1 rounded-full bg-amber-500/60 mt-1.5 mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
