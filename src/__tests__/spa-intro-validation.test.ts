import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';

/**
 * Validates that key facts mentioned in intro text match the spa data
 */
function validateIntroFacts(spa: Spa) {
  const intro = spa.intro?.toLowerCase() || '';
  const errors: string[] = [];

  // Validate thermal facility count if mentioned (handles both numeric and written numbers)
  const numberWords: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };
  const thermalCountMatch =
    intro.match(/(\d+)\s+thermal/) ||
    intro.match(/(one|two|three|four|five|six|seven|eight|nine|ten)\s+thermal/);
  if (thermalCountMatch) {
    const mentionedCount = thermalCountMatch[1].match(/\d+/)
      ? parseInt(thermalCountMatch[1])
      : numberWords[thermalCountMatch[1].toLowerCase()];
    const actualCount = spa.thermalFacilities.length;
    if (mentionedCount !== actualCount) {
      errors.push(
        `Mentions "${thermalCountMatch[1]} thermal" but has ${actualCount} facilities`
      );
    }
  }

  // Validate facilities mentioned in intro exist
  const facilityNames = spa.thermalFacilities.map((f) => f.name.toLowerCase());
  const facilityDetails = spa.thermalFacilities.map((f) =>
    f.details.toLowerCase()
  );
  const allFacilityText = [...facilityNames, ...facilityDetails].join(' ');

  // Check sauna types mentioned (with synonyms)
  if (intro.includes('finnish')) {
    if (!facilityNames.some((n) => n.includes('finnish'))) {
      errors.push('Mentions "Finnish" but facility not found');
    }
  }
  if (intro.includes('herbal')) {
    // Check if it's a treatment name (like "Herbal Sleep Cocoon") vs thermal facility
    const isTreatmentMention =
      intro.includes('herbal sleep') || intro.includes('herbal wrap');
    if (
      !isTreatmentMention &&
      !facilityNames.some((n) => n.includes('herbal')) &&
      !allFacilityText.includes('herbal')
    ) {
      errors.push('Mentions "herbal" but facility not found');
    }
  }
  if (intro.includes('laconium')) {
    if (!facilityNames.some((n) => n.includes('laconium'))) {
      errors.push('Mentions "laconium" but facility not found');
    }
  }
  if (intro.includes('steam room') || intro.includes('steam')) {
    if (!facilityNames.some((n) => n.includes('steam'))) {
      errors.push('Mentions "steam room" but facility not found');
    }
  }
  if (intro.includes('infrared')) {
    if (
      !facilityNames.some((n) => n.includes('infrared')) &&
      !allFacilityText.includes('infrared')
    ) {
      errors.push('Mentions "infrared" but facility not found');
    }
  }
  if (intro.includes('coconut')) {
    if (!facilityNames.some((n) => n.includes('coconut'))) {
      errors.push('Mentions "coconut" but facility not found');
    }
  }
  if (intro.includes('tepidarium')) {
    if (
      !facilityNames.some((n) => n.includes('tepidarium')) &&
      !allFacilityText.includes('tepidarium')
    ) {
      errors.push('Mentions "tepidarium" but facility not found');
    }
  }
  if (intro.includes('rasul')) {
    if (
      !facilityNames.some((n) => n.includes('rasul')) &&
      !allFacilityText.includes('rasul')
    ) {
      errors.push('Mentions "rasul" but facility not found');
    }
  }

  // Validate pool features mentioned
  const poolNames = spa.poolFeatures.map((p) => p.name.toLowerCase());
  const poolDetails = spa.poolFeatures.map((p) => p.details.toLowerCase());
  const allPoolText = [...poolNames, ...poolDetails].join(' ');

  if (intro.includes('infinity')) {
    if (
      !poolNames.some((n) => n.includes('infinity')) &&
      !poolDetails.some((d) => d.includes('infinity'))
    ) {
      errors.push('Mentions "infinity" pool but not found');
    }
  }
  if (intro.includes('outdoor pool')) {
    if (!spa.facilities.outdoorPool) {
      errors.push('Mentions "outdoor pool" but outdoorPool is false');
    }
  }
  if (intro.includes('hydrotherapy')) {
    // Allow hydrotherapy mention if it's in pool features, or if there are outdoor pools/hot tubs
    // (hydrotherapy is a descriptive term that can apply to any pool/hot tub)
    const hasHydrotherapyInFeatures =
      allPoolText.includes('hydrotherapy') || allPoolText.includes('vitality');
    const hasOutdoorPoolsOrHotTub =
      spa.facilities.outdoorPool ||
      poolNames.some((n) => n.includes('hot tub') || n.includes('hot-tub'));
    if (!hasHydrotherapyInFeatures && !hasOutdoorPoolsOrHotTub) {
      errors.push('Mentions "hydrotherapy" but not in pool features');
    }
  }

  // Validate pool feature details mentioned in intro
  const poolFeatureKeywords = [
    'bubble lounger',
    'volcano fountain',
    'hydromassage',
    'massage jet',
  ];
  poolFeatureKeywords.forEach((keyword) => {
    if (intro.includes(keyword) && !allPoolText.includes(keyword)) {
      errors.push(`Mentions "${keyword}" but not in pool details`);
    }
  });

  // Validate access policy mentions (check for negative statements)
  // Check if "included" refers to spa access vs amenities (robes, towels, etc.)
  const includedRefersToAmenities =
    (intro.includes('robes') && intro.includes('included')) ||
    (intro.includes('towels') && intro.includes('included')) ||
    (intro.includes('slippers') && intro.includes('included'));
  const isNegativeStatement =
    intro.includes('not included') ||
    intro.includes('not complimentary') ||
    (intro.includes('spa access') && intro.includes('not included'));
  const mentionsComplimentary =
    !isNegativeStatement &&
    (intro.includes('complimentary') ||
      (intro.includes('included') &&
        !includedRefersToAmenities &&
        (intro.includes('spa access') ||
          intro.includes('spa included') ||
          intro.includes('access is') ||
          intro.includes('access for') ||
          intro.includes('guests'))));
  if (mentionsComplimentary) {
    const hasFreeAccess = spa.accessLabels.some(
      (label) =>
        label === 'free-for-all-guests' ||
        label === 'free-for-some-rooms' ||
        label === 'partial-for-guests'
    );
    if (!hasFreeAccess) {
      errors.push('Mentions complimentary/included but no free access labels');
    }
  }
  // Check for day pass mentions (handle both positive and negative statements)
  const mentionsDayPass =
    intro.includes('day pass') || intro.includes('non-resident');
  const dayPassNotAvailable =
    (intro.includes('day pass') &&
      (intro.includes('not available') ||
        intro.includes('are not available') ||
        intro.includes('no day pass') ||
        intro.includes('no day passes') ||
        intro.includes('exclusive to hotel') ||
        intro.includes('hotel guests only') ||
        intro.includes('exclusively for hotel'))) ||
    intro.includes('exclusive to hotel guests');
  // Check for "no day passes available to public" - this means hotel guests can get day passes but public cannot
  const dayPassNotAvailableToPublic =
    intro.includes('no day pass') &&
    (intro.includes('to public') || intro.includes('to the public'));
  if (mentionsDayPass && !dayPassNotAvailable && !dayPassNotAvailableToPublic) {
    if (!spa.accessLabels.includes('day-passes-available')) {
      errors.push('Mentions day passes but day-passes-available not set');
    }
  }
  // Only error if explicitly says no day passes at all (not just "to public")
  if (dayPassNotAvailable && !dayPassNotAvailableToPublic) {
    if (spa.accessLabels.includes('day-passes-available')) {
      errors.push(
        'Mentions day passes not available but day-passes-available is set'
      );
    }
  }
  // If says "no day passes to public" but has day-passes-available, that's valid
  // (day passes might be available to hotel guests or through packages)

  // Validate age policy if mentioned (handles 16+, 18+, adults-only)
  // Check if 16+ is mentioned for specific facilities (hot tub, sauna) vs overall policy
  const mentions16ForFacilities =
    intro.includes('16+') &&
    (intro.includes('hot tub') ||
      intro.includes('sauna') ||
      intro.includes('both 16+'));
  // Check if 18+ is mentioned for treatments specifically (not overall policy)
  const mentions18ForTreatments =
    intro.includes('18+') &&
    (intro.includes('treatment') ||
      intro.includes('treatments') ||
      intro.includes('some treatments'));
  // Check if 18+ is mentioned for specific facilities (thermal suite) vs overall policy
  const mentions18ForFacilities =
    intro.includes('18+') &&
    (intro.includes('thermal suite') ||
      intro.includes('thermal facilities') ||
      intro.includes('facilities remain 18+'));
  if (intro.includes('18+') || intro.includes('adults-only')) {
    const agePolicyLower = spa.agePolicy?.toLowerCase() || '';
    const has18Plus = agePolicyLower.includes('18+');
    const hasAdultsOnly =
      agePolicyLower.includes('adults only') ||
      agePolicyLower.includes('adults-only');
    // Allow 18+ for treatments if overall policy is 16+
    if (mentions18ForTreatments && agePolicyLower.includes('16+')) {
      // This is valid - 16+ overall with 18+ for treatments
    } else if (mentions18ForFacilities) {
      // Check if accessPolicy mentions 18+ for facilities when agePolicy is Family Friendly
      const has18PlusInAccessPolicy = spa.accessPolicy.some(
        (p) =>
          p.details.toLowerCase().includes('18+') ||
          (p.name.toLowerCase().includes('age') &&
            p.details.toLowerCase().includes('18+'))
      );
      if (!has18PlusInAccessPolicy && !has18Plus && !hasAdultsOnly) {
        errors.push('Mentions 18+ for facilities but not found in agePolicy or access policy');
      }
      // If accessPolicy mentions it, allow Family Friendly agePolicy
    } else if (!has18Plus && !hasAdultsOnly) {
      errors.push('Mentions 18+/adults-only but agePolicy does not match');
    }
  }
  if (intro.includes('16+') && !mentions16ForFacilities) {
    // Only validate if 16+ is mentioned as overall policy, not for specific facilities
    if (!spa.agePolicy || !spa.agePolicy.toLowerCase().includes('16+')) {
      errors.push('Mentions 16+ but agePolicy does not match');
    }
  }
  // If 16+ is mentioned for specific facilities, check agePolicy and access policy mention it
  if (mentions16ForFacilities) {
    // Validate access policy mentions it
    const has16PlusInAccessPolicy = spa.accessPolicy.some(
      (p) =>
        p.details.toLowerCase().includes('16+') ||
        (p.name.toLowerCase().includes('age') &&
          p.details.toLowerCase().includes('16+'))
    );
    // If accessPolicy mentions 16+, allow Family Friendly agePolicy
    // Otherwise, require agePolicy to include 16+
    if (!has16PlusInAccessPolicy) {
      const agePolicyLower = spa.agePolicy?.toLowerCase() || '';
      if (!agePolicyLower.includes('16+')) {
        errors.push(
          'Mentions 16+ for facilities but agePolicy does not include 16+ and not found in access policy'
        );
      }
    }
  }

  // Validate treatment age restrictions if mentioned separately from general age policy
  if (
    intro.includes('treatment') &&
    (intro.includes('age 12+') ||
      intro.includes('from age 12+') ||
      intro.includes('12+'))
  ) {
    const hasTreatmentAgeInAccessPolicy = spa.accessPolicy.some(
      (p) =>
        (p.name.toLowerCase().includes('treatment') ||
          p.name.toLowerCase().includes('age')) &&
        (p.details.toLowerCase().includes('12+') ||
          p.details.toLowerCase().includes('from age 12'))
    );
    if (!hasTreatmentAgeInAccessPolicy) {
      errors.push('Mentions treatment age 12+ but not found in access policy');
    }
  }

  // Validate "under 16" or "accompanied by adult" age policy mentions
  if (
    intro.includes('under 16') ||
    intro.includes('under-16') ||
    intro.includes('under 16s') ||
    intro.includes('under-16s') ||
    intro.includes('accompanied by') ||
    intro.includes('accompanied by an adult')
  ) {
    const agePolicyLower = spa.agePolicy?.toLowerCase() || '';
    const hasUnder16InAgePolicy =
      agePolicyLower.includes('under 16') ||
      agePolicyLower.includes('under-16') ||
      agePolicyLower.includes('accompanied');

    // Check access policy mentions it
    const hasUnder16InAccessPolicy = spa.accessPolicy.some(
      (p) =>
        p.details.toLowerCase().includes('under 16') ||
        p.details.toLowerCase().includes('under-16') ||
        p.details.toLowerCase().includes('accompanied')
    );

    // Either agePolicy or accessPolicy should mention it
    if (!hasUnder16InAgePolicy && !hasUnder16InAccessPolicy) {
      errors.push(
        'Mentions under 16/accompanied by adult but not found in agePolicy or access policy'
      );
    }
  }

  // Validate family-friendly or children welcome mentions
  if (
    intro.includes('family-friendly') ||
    intro.includes('family friendly') ||
    intro.includes('welcomes children') ||
    intro.includes('welcome children') ||
    intro.includes('children welcome') ||
    intro.includes('suitable for children') ||
    intro.includes('suitable for families')
  ) {
    const agePolicyLower = spa.agePolicy?.toLowerCase() || '';
    const hasFamilyFriendlyInAgePolicy =
      agePolicyLower.includes('children') ||
      agePolicyLower.includes('family') ||
      agePolicyLower.includes('suitable for children') ||
      agePolicyLower.includes('welcomes children');

    // Check access policy mentions it
    const hasFamilyFriendlyInAccessPolicy = spa.accessPolicy.some(
      (p) =>
        p.details.toLowerCase().includes('children') ||
        p.details.toLowerCase().includes('family') ||
        p.details.toLowerCase().includes('suitable for children') ||
        p.details.toLowerCase().includes('welcomes children')
    );

    // Either agePolicy or accessPolicy should mention it
    if (!hasFamilyFriendlyInAgePolicy && !hasFamilyFriendlyInAccessPolicy) {
      errors.push(
        'Mentions family-friendly/children welcome but not found in agePolicy or access policy'
      );
    }
  }

  return errors;
}

describe('Spa Introduction Text Validation', () => {
  // List of spas with intros to validate
  const spasWithIntros = spaData.filter((spa) => spa.intro);

  it('should validate all spas with intros have valid text', () => {
    spasWithIntros.forEach((spa) => {
      expect(spa.intro).toBeDefined();
      expect(typeof spa.intro).toBe('string');
      expect(spa.intro?.trim().length).toBeGreaterThan(0);
    });
  });

  describe('Key Facts Validation', () => {
    spasWithIntros.forEach((spa) => {
      it(`should validate ${spa.name} intro facts match data`, () => {
        const errors = validateIntroFacts(spa);
        if (errors.length > 0) {
          throw new Error(
            `Validation errors for ${spa.name}:\n${errors
              .map((e) => `  - ${e}`)
              .join('\n')}`
          );
        }
      });
    });
  });

  describe('Lodore Falls Hotel Spa (ID: 1) - Detailed Validation', () => {
    const lodoreFalls = spaData.find((spa) => spa.id === 1);

    if (!lodoreFalls?.intro) {
      it('should have intro text', () => {
        expect(lodoreFalls?.intro).toBeDefined();
      });
      return;
    }

    it('should mention thermal facility count correctly', () => {
      const intro = lodoreFalls.intro?.toLowerCase() || '';
      expect(intro).toContain('nine thermal experiences');
      expect(lodoreFalls.thermalFacilities.length).toBe(9);
    });

    it('should mention suite access policy correctly', () => {
      const intro = lodoreFalls.intro?.toLowerCase() || '';
      const suitePolicy = lodoreFalls.accessPolicy.find((p) =>
        p.name.toLowerCase().includes('suite')
      );

      expect(intro).toContain('suite');
      expect(intro).toContain('2 hours per night');
      expect(suitePolicy?.details.toLowerCase()).toContain('2hr');
    });

    it('should have multiple paragraphs', () => {
      const paragraphs =
        lodoreFalls.intro?.split('\n\n').filter((p) => p.trim().length > 0) ||
        [];
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    });
  });
});
