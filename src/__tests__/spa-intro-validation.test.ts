import { spaData } from '@/data/spas';
import { Spa } from '@/types/spa';

/**
 * Validates that key facts mentioned in intro text match the spa data
 */
function validateIntroFacts(spa: Spa) {
  const intro = spa.intro?.toLowerCase() || '';
  const errors: string[] = [];

  // Validate thermal facility count if mentioned
  const thermalCountMatch = intro.match(/(\d+)\s+thermal/);
  if (thermalCountMatch) {
    const mentionedCount = parseInt(thermalCountMatch[1]);
    const actualCount = spa.thermalFacilities.length;
    if (mentionedCount !== actualCount) {
      errors.push(
        `Mentions "${mentionedCount} thermal" but has ${actualCount} facilities`
      );
    }
  }

  // Validate facilities mentioned in intro exist
  const facilityNames = spa.thermalFacilities.map((f) => f.name.toLowerCase());
  const facilityDetails = spa.thermalFacilities.map((f) =>
    f.details.toLowerCase()
  );
  const allFacilityText = [...facilityNames, ...facilityDetails].join(' ');

  // Check sauna types mentioned
  if (intro.includes('finnish sauna')) {
    if (!facilityNames.some((n) => n.includes('finnish'))) {
      errors.push('Mentions "Finnish sauna" but facility not found');
    }
  }
  if (intro.includes('herbal sauna')) {
    if (!facilityNames.some((n) => n.includes('herbal'))) {
      errors.push('Mentions "herbal sauna" but facility not found');
    }
  }
  if (intro.includes('laconium')) {
    if (!facilityNames.some((n) => n.includes('laconium'))) {
      errors.push('Mentions "laconium" but facility not found');
    }
  }
  if (intro.includes('steam room')) {
    if (!facilityNames.some((n) => n.includes('steam'))) {
      errors.push('Mentions "steam room" but facility not found');
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

  // Validate access policy mentions
  if (intro.includes('complimentary') || intro.includes('included')) {
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

  // Validate age policy if mentioned
  if (intro.includes('18+') || intro.includes('adults-only')) {
    if (!spa.agePolicy || !spa.agePolicy.toLowerCase().includes('18+')) {
      errors.push('Mentions 18+/adults-only but agePolicy does not match');
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
          fail(
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
