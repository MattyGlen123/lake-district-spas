import Link from 'next/link';
import { ChevronRight, MapPin, Check } from 'lucide-react';
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
    <section className="container mx-auto px-4 md:px-8 mt-16 mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Similar Spas to Explore
        </h2>
        <Link
          href="/"
          className="text-slate-900 font-semibold flex items-center hover:underline"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
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
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-200"
            >
              <div className="aspect-[389/250] relative overflow-hidden bg-gray-200">
                <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                  {sortedAccessLabels.map((label) => {
                    const config = accessLabelConfig[label];
                    return (
                      <div
                        key={label}
                        className="bg-white text-black px-2 py-1 rounded-lg text-xs inline-flex items-center gap-1"
                      >
                        <span>{config.dot}</span>
                        <span>{config.shortLabel}</span>
                      </div>
                    );
                  })}
                </div>
                <Image
                  src={relatedSpa.imageSrc}
                  alt={relatedSpa.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {relatedSpa.name}
                </h3>
                <p className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {relatedSpa.location}
                </p>
                <ul className="space-y-1.5">
                  {relatedSpa.keyFeatures.slice(0, 3).map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <Check className="w-4 h-4 text-spa-green shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
