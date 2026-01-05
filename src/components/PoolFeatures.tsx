import { Waves } from 'lucide-react';
import { Spa, PoolFeature } from '@/types/spa';

interface PoolFeaturesProps {
  spa: Spa;
}

export default function PoolFeatures({ spa }: PoolFeaturesProps) {
  if (spa.poolFeatures.length === 0) {
    return null;
  }

  // Analyze pool features
  const featureCount = spa.poolFeatures.length;
  const featureNames = spa.poolFeatures.map((p) => p.name.toLowerCase());
  const featureDetails = spa.poolFeatures.map((p) => p.details.toLowerCase());
  const allText = [...featureNames, ...featureDetails].join(' ');

  // Detect feature types
  const hasPlunge =
    featureNames.some(
      (name) => name.includes('plunge') || name.includes('plunge tub')
    ) || featureDetails.some((detail) => detail.includes('plunge'));
  const hasHotTub =
    featureNames.some(
      (name) =>
        name.includes('hot tub') ||
        name.includes('whirlpool') ||
        name.includes('jacuzzi')
    ) ||
    featureDetails.some(
      (detail) =>
        detail.includes('hot tub') ||
        detail.includes('whirlpool') ||
        detail.includes('jacuzzi')
    );
  const hasPool = featureNames.some(
    (name) => name.includes('pool') && !name.includes('plunge')
  );
  const hasVitality =
    featureNames.some((name) => name.includes('vitality')) ||
    featureDetails.some((detail) => detail.includes('vitality'));

  // Detect unique pool features (only if actual pools exist)
  const hasSwimThrough =
    hasPool &&
    (allText.includes('swim-through') ||
      allText.includes('swim through') ||
      allText.includes('connecting indoor and outdoor'));
  const hasInfinity =
    hasPool &&
    (allText.includes('infinity') ||
      allText.includes('infinity-edge') ||
      allText.includes('infinity edge'));
  const hasOutdoor =
    hasPool && (allText.includes('outdoor') || allText.includes('panoramic'));
  const hasHydrotherapy =
    hasPool &&
    (allText.includes('hydrotherapy') ||
      allText.includes('massage jets') ||
      allText.includes('bubble'));
  const hasIndoor = hasPool && allText.includes('indoor');

  // Generate intro text based on feature count and types
  let introText = '';

  if (featureCount === 1) {
    // Single feature - streamlined one-sentence structure
    let featureDescription = '';
    let benefitText = '';

    if (hasPlunge) {
      featureDescription = 'hot and cold plunge facilities';
      benefitText =
        'offering therapeutic contrast therapy to stimulate circulation and aid recovery';
    } else if (hasHotTub) {
      featureDescription = 'a hot tub';
      benefitText =
        'offering a relaxing hydrotherapy experience with soothing massage jets';
    } else if (hasSwimThrough) {
      featureDescription =
        'a unique swim-through pool connecting indoor and outdoor spaces';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else if (hasInfinity && hasOutdoor) {
      featureDescription =
        'a stunning infinity-edge outdoor pool with panoramic views';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else if (hasInfinity) {
      featureDescription = 'a stunning infinity-edge pool';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else if (hasOutdoor) {
      featureDescription = 'an inviting outdoor pool';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else if (hasHydrotherapy || hasVitality) {
      featureDescription = 'a hydrotherapy pool with therapeutic massage jets';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else if (hasIndoor) {
      featureDescription = 'an indoor pool';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else if (hasPool) {
      featureDescription = 'a pool';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    } else {
      featureDescription = 'water facilities';
      benefitText =
        'offering a serene experience designed to promote relaxation and improve circulation';
    }

    introText = `${spa.name} features ${featureDescription}, ${benefitText}.`;
  } else {
    // Multiple features - two-sentence structure
    let highlightText = '';
    let facilityType = 'facilities';

    // Determine if we have mixed types
    const hasMixedTypes = (hasPool && hasPlunge) || (hasPool && hasHotTub);

    if (hasMixedTypes) {
      if (hasPool && hasPlunge) {
        highlightText =
          'Combining swimming facilities with hot and cold plunge therapy,';
      } else if (hasPool && hasHotTub) {
        highlightText =
          'Combining swimming facilities with hot tub relaxation,';
      }
      facilityType = 'facilities';
    } else if (hasPlunge) {
      highlightText = 'Featuring hot and cold plunge therapy facilities,';
      facilityType = 'facilities';
    } else if (hasHotTub && !hasPool) {
      highlightText = 'Featuring hot tub facilities,';
      facilityType = 'facilities';
    } else if (hasSwimThrough) {
      highlightText =
        'Including a unique swim-through design connecting indoor and outdoor spaces,';
      facilityType = 'pools';
    } else if (hasInfinity && hasOutdoor) {
      highlightText =
        'Including a stunning infinity-edge outdoor pool with panoramic views,';
      facilityType = 'pools';
    } else if (hasInfinity) {
      highlightText = 'Featuring a stunning infinity-edge pool design,';
      facilityType = 'pools';
    } else if (hasOutdoor) {
      highlightText = 'Including outdoor pool facilities with scenic views,';
      facilityType = 'pools';
    } else if (hasHydrotherapy || hasVitality) {
      highlightText =
        'With therapeutic hydrotherapy features and massage jets,';
      facilityType = 'pools';
    } else if (hasIndoor) {
      highlightText =
        'Featuring indoor pool facilities designed for year-round relaxation,';
      facilityType = 'pools';
    } else {
      highlightText = 'With thoughtfully designed facilities,';
      facilityType = 'facilities';
    }

    const facilitySingular = facilityType === 'pools' ? 'pool' : 'facility';
    introText = `The water facilities at ${spa.name} offer a serene experience designed to promote relaxation and improve circulation. ${highlightText} each ${facilitySingular} is thoughtfully designed to enhance your wellness journey and provide moments of pure tranquility.`;
  }

  return (
    <section id="pools" className="mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <Waves className="h-7 w-7 text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">
          Pools & Water Features
        </h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">{introText}</p>
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
