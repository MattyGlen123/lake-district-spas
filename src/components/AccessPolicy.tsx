import { CreditCard, Bed, Clock, Info, ShieldAlert } from 'lucide-react';
import { Spa } from '@/types/spa';

interface AccessPolicyProps {
  spa: Spa;
}

export default function AccessPolicy({ spa }: AccessPolicyProps) {
  if (spa.accessPolicy.length === 0) {
    return null;
  }

  // Filter policies by accessType
  const hotelPolicies = spa.accessPolicy.filter(
    (p) => p.accessType === 'hotel'
  );
  const dayPassPolicies = spa.accessPolicy.filter(
    (p) => p.accessType === 'day-pass'
  );
  const hoursPolicies = spa.accessPolicy.filter(
    (p) => p.accessType === 'spa-hours'
  );
  const generalPolicies = spa.accessPolicy.filter(
    (p) => p.accessType === 'general'
  );
  const agePolicies = spa.accessPolicy.filter(
    (p) => p.accessType === 'age-restriction'
  );

  return (
    <section
      id="access"
      className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm"
    >
      {/* Main Header */}
      <div className="flex items-center space-x-3 mb-8">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">Access & Bookings</h2>
      </div>

      {/* Subsections Container */}
      <div className="space-y-10">
        {/* Grid for first 4 sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 1. Hotel Guest Policy */}
          {hotelPolicies.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <Bed className="h-4 w-4" />
                </span>
                Hotel Guest Policy
              </h3>
              <div className="pl-4 md:pl-11 border-l-2 border-slate-100 ml-4">
                {hotelPolicies.map((policy, idx) => (
                  <div
                    key={idx}
                    className="mb-3 last:mb-0 flex items-start group"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-200 mt-2 mr-3 group-hover:bg-blue-500 transition-colors" />
                    <p className="text-lg text-slate-900">
                      <span className="font-semibold">{policy.name}:</span>{' '}
                      <span className="text-slate-600">{policy.details}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. External Visitors & Day Passes */}
          {dayPassPolicies.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <CreditCard className="h-4 w-4" />
                </span>
                Day Passes
              </h3>
              <div className="pl-4 md:pl-11 border-l-2 border-slate-100 ml-4">
                {dayPassPolicies.map((policy, idx) => (
                  <div
                    key={idx}
                    className="mb-3 last:mb-0 flex items-start group"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-200 mt-2 mr-3 group-hover:bg-blue-500 transition-colors" />
                    <p className="text-lg text-slate-900">
                      <span className="font-semibold">{policy.name}:</span>{' '}
                      <span className="text-slate-600">{policy.details}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Operating Hours */}
          {hoursPolicies.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4" />
                </span>
                Operating Hours
              </h3>
              <div className="pl-4 md:pl-11 border-l-2 border-slate-100 ml-4">
                {hoursPolicies.map((policy, idx) => (
                  <div
                    key={idx}
                    className="mb-3 last:mb-0 flex items-start group"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-200 mt-2 mr-3 group-hover:bg-blue-500 transition-colors" />
                    <p className="text-lg text-slate-900">
                      <span className="font-semibold">{policy.name}:</span>{' '}
                      <span className="text-slate-600">{policy.details}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. General Policies */}
          {generalPolicies.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <Info className="h-4 w-4" />
                </span>
                General Policies
              </h3>
              <div className="pl-4 md:pl-11 border-l-2 border-slate-100 ml-4">
                {generalPolicies.map((policy, idx) => (
                  <div
                    key={idx}
                    className="mb-3 last:mb-0 flex items-start group"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-200 mt-2 mr-3 group-hover:bg-blue-500 transition-colors" />
                    <p className="text-lg text-slate-900">
                      <span className="font-semibold">{policy.name}:</span>{' '}
                      <span className="text-slate-600">{policy.details}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Age Restrictions - Special Amber Styling */}
        {agePolicies.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Important Age Restrictions
            </h3>
            <div className="space-y-2">
              {agePolicies.map((policy, idx) => (
                <p key={idx} className="text-amber-900">
                  <span className="font-semibold">{policy.name}:</span>{' '}
                  <span className="text-amber-800">{policy.details}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
