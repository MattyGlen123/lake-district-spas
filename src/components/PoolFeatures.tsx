import { Waves } from 'lucide-react';
import { Spa, PoolFeature } from '@/types/spa';

interface PoolFeaturesProps {
  spa: Spa;
}

export default function PoolFeatures({ spa }: PoolFeaturesProps) {
  if (spa.poolFeatures.length === 0) {
    return null;
  }

  return (
    <section id="pools" className="mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <Waves className="h-7 w-7 text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">
          Pools & Water Features
        </h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The water facilities at {spa.name} offer a serene aquatic experience
        designed to promote relaxation, improve circulation, and provide
        therapeutic benefits. From invigorating hydrotherapy pools to tranquil
        swimming areas, each water feature is thoughtfully designed to enhance
        your wellness journey and provide moments of pure tranquility.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spa.poolFeatures.map((pool: PoolFeature, idx: number) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 p-6 rounded-xl"
          >
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              {pool.name}
            </h3>
            <p className="text-slate-600">{pool.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
