import { Users, Ticket, Waves } from 'lucide-react';

export default function FeatureSpotlights() {
  return (
    <section className="pb-32 border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Adults-Only Tranquility */}
          <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100 shadow-sm flex flex-col h-full">
            <div className="mb-6 p-4 bg-white rounded-2xl w-fit mx-auto text-amber-700">
              <Users className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-4">
              Adults-Only Tranquility
            </h3>
            <p className="text-stone-500 text-base font-light leading-relaxed flex-grow">
              Our curated couples retreats maintain strict adults-only
              policies to ensure an uninterrupted atmosphere of calm.
            </p>
          </div>

          {/* Card 2: Day Spa Escapes */}
          <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100 shadow-sm flex flex-col h-full">
            <div className="mb-6 p-4 bg-white rounded-2xl w-fit mx-auto text-amber-700">
              <Ticket className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-4">
              Day Spa Escapes
            </h3>
            <p className="text-stone-500 text-base font-light leading-relaxed flex-grow">
              All four featured spas offer day passes, so you can enjoy a
              romantic spa experience together without booking an overnight stay.
            </p>
          </div>

          {/* Card 3: Outdoor Thermal Variety */}
          <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100 shadow-sm flex flex-col h-full">
            <div className="mb-6 p-4 bg-white rounded-2xl w-fit mx-auto text-amber-700">
              <Waves className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-4">
              Outdoor Thermal Escapes
            </h3>
            <p className="text-stone-500 text-base font-light leading-relaxed flex-grow">
              From infinity pools overlooking the fells to riverside
              swim-through pools, outdoor Finnish saunas, and lakeside hot
              tubs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

