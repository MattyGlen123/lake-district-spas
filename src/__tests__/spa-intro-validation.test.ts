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
    if (
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

  // Validate pool features mentioned
  const poolNames = spa.poolFeatures.map((p) => p.name.toLowerCase());
  const poolDetails = spa.poolFeatures.map((p) => p.details.toLowerCase());
  const allPoolText = [...poolNames, ...poolDetails].join(' ');

  if (intro.includes('infinity')) {
    if (!poolNames.some((n) => n.includes('infinity'))) {
      errors.push('Mentions "infinity" pool but not found');
    }
  }
  if (intro.includes('outdoor pool')) {
    if (!spa.facilities.outdoorPool) {
      errors.push('Mentions "outdoor pool" but outdoorPool is false');
    }
  }
  if (intro.includes('hydrotherapy')) {
    if (
      !allPoolText.includes('hydrotherapy') &&
      !allPoolText.includes('vitality')
    ) {
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
  const mentionsComplimentary =
    (intro.includes('complimentary') || intro.includes('included')) &&
    !intro.includes('not included') &&
    !intro.includes('not complimentary');
  if (mentionsComplimentary) {
    const hasFreeAccess = spa.accessLabels.some(
      (label) =>
        label === 'free-for-all-guests' || label === 'free-for-some-rooms'
    );
    if (!hasFreeAccess) {
      errors.push('Mentions complimentary/included but no free access labels');
    }
  }
  if (intro.includes('day pass') || intro.includes('non-resident')) {
    if (!spa.accessLabels.includes('day-passes-available')) {
      errors.push('Mentions day passes but day-passes-available not set');
    }
  }

  // Validate age policy if mentioned (handles 16+, 18+, adults-only)
  // Check if 16+ is mentioned for specific facilities (hot tub, sauna) vs overall policy
  const mentions16ForFacilities =
    intro.includes('16+') &&
    (intro.includes('hot tub') ||
      intro.includes('sauna') ||
      intro.includes('both 16+'));
  if (intro.includes('18+') || intro.includes('adults-only')) {
    if (!spa.agePolicy || !spa.agePolicy.toLowerCase().includes('18+')) {
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
    // Validate agePolicy mentions 16+ (should include "16+" when facilities are 16+)
    if (!spa.agePolicy || !spa.agePolicy.toLowerCase().includes('16+')) {
      errors.push(
        'Mentions 16+ for facilities but agePolicy does not include 16+'
      );
    }
    // Validate access policy mentions it
    const has16PlusInAccessPolicy = spa.accessPolicy.some(
      (p) =>
        p.details.toLowerCase().includes('16+') ||
        (p.name.toLowerCase().includes('age') &&
          p.details.toLowerCase().includes('16+'))
    );
    if (!has16PlusInAccessPolicy) {
      errors.push('Mentions 16+ for facilities but not found in access policy');
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
