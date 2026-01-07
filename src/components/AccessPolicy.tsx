import { CreditCard, Bed, Clock, Info, ShieldAlert } from 'lucide-react';
import { Spa } from '@/types/spa';

interface AccessPolicyProps {
  spa: Spa;
}

function getPolicyIcon(accessType?: string) {
  switch (accessType) {
    case 'hotel':
      return <Bed className="h-5 w-5" />;
    case 'day-pass':
      return <CreditCard className="h-5 w-5" />;
    case 'spa-hours':
      return <Clock className="h-5 w-5" />;
    case 'age-restriction':
      return <ShieldAlert className="h-5 w-5" />;
    case 'general':
    default:
      return <Info className="h-5 w-5" />;
  }
}

export default function AccessPolicy({ spa }: AccessPolicyProps) {
  if (spa.accessPolicy.length === 0) {
    return null;
  }

  return (
    <div className="py-32 container mx-auto px-4 md:px-8">
      <section id="access" className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column - Intro */}
          <div className="md:w-1/3">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-px w-12 bg-amber-700 opacity-30" />
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
                Policies
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              Access Details
            </h2>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              Our directory helps you navigate the specific guest and public
              policies of Lake District hotel spas.
            </p>
          </div>

          {/* Right column - Policy cards */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {spa.accessPolicy.map((policy, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm"
              >
                <div className="p-2 bg-stone-50 text-amber-700 rounded-lg border border-stone-100">
                  {getPolicyIcon(policy.accessType)}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-sm mb-1 uppercase tracking-wider">
                    {policy.name}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">
                    {policy.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
