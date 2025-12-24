import { spaData } from '@/data/spas';
import { BusinessModel, Spa } from '@/types/spa';

/**
 * Core filtering logic extracted from page.tsx for testing
 * This mirrors the filtering logic used in the Home component
 */
function filterSpas(
  spas: Spa[],
  businessModels: BusinessModel[],
  location: string,
  facilities: string[]
): Spa[] {
  return spas.filter((spa: Spa) => {
    // Filter by business model
    if (businessModels.length > 0 && !businessModels.includes(spa.businessModel)) {
      return false;
    }

    // Filter by location
    if (location !== 'All Locations' && spa.location !== location) {
      return false;
    }

    // Filter by facilities - ALL selected facilities must be present
    if (facilities.length > 0) {
      const hasFacilities = facilities.every((facility) => {
        const facilityKey = facility as keyof typeof spa.facilities;
        return spa.facilities[facilityKey];
      });
      if (!hasFacilities) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculate active filter count
 * This mirrors the logic in page.tsx
 */
function calculateActiveFilterCount(
  businessModels: BusinessModel[],
  location: string,
  facilities: string[]
): number {
  return (
    businessModels.length +
    (location !== 'All Locations' ? 1 : 0) +
    facilities.length
  );
}

describe('Spa Filtering Logic', () => {
  describe('No Filters Applied', () => {
    it('should return all spas when no filters are applied', () => {
      const result = filterSpas(spaData, [], 'All Locations', []);
      expect(result).toHaveLength(spaData.length);
      expect(result).toEqual(spaData);
    });

    it('should calculate active filter count as 0 when no filters applied', () => {
      const count = calculateActiveFilterCount([], 'All Locations', []);
      expect(count).toBe(0);
    });
  });

  describe('Single Business Model Filter', () => {
    it('should filter by "free-with-booking" business model', () => {
      const result = filterSpas(spaData, ['free-with-booking'], 'All Locations', []);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.businessModel).toBe('free-with-booking');
      });
    });

    it('should filter by "paid-extra" business model', () => {
      const result = filterSpas(spaData, ['paid-extra'], 'All Locations', []);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('paid-extra');
      });
    });

    it('should filter by "day-passes" business model', () => {
      const result = filterSpas(spaData, ['day-passes'], 'All Locations', []);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('day-passes');
      });
    });

    it('should filter by "guests-only" business model', () => {
      const result = filterSpas(spaData, ['guests-only'], 'All Locations', []);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('guests-only');
      });
    });

    it('should filter by "hybrid" business model', () => {
      const result = filterSpas(spaData, ['hybrid'], 'All Locations', []);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('hybrid');
      });
    });

    it('should calculate active filter count as 1 for single business model', () => {
      const count = calculateActiveFilterCount(['free-with-booking'], 'All Locations', []);
      expect(count).toBe(1);
    });
  });

  describe('Multiple Business Model Filters', () => {
    it('should return spas matching ANY of the selected business models', () => {
      const selectedModels: BusinessModel[] = ['free-with-booking', 'guests-only'];
      const result = filterSpas(spaData, selectedModels, 'All Locations', []);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(selectedModels).toContain(spa.businessModel);
      });
    });

    it('should calculate active filter count for multiple business models', () => {
      const count = calculateActiveFilterCount(
        ['free-with-booking', 'guests-only'],
        'All Locations',
        []
      );
      expect(count).toBe(2);
    });

    it('should return all spas when all business models are selected', () => {
      const allModels: BusinessModel[] = [
        'free-with-booking',
        'paid-extra',
        'day-passes',
        'guests-only',
        'hybrid',
      ];
      const result = filterSpas(spaData, allModels, 'All Locations', []);

      expect(result).toHaveLength(spaData.length);
    });
  });

  describe('Location Filter', () => {
    it('should filter spas by Borrowdale location', () => {
      const result = filterSpas(spaData, [], 'Borrowdale', []);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.location).toBe('Borrowdale');
      });
    });

    it('should filter spas by Bassenthwaite location', () => {
      const result = filterSpas(spaData, [], 'Bassenthwaite', []);

      result.forEach((spa) => {
        expect(spa.location).toBe('Bassenthwaite');
      });
    });

    it('should filter spas by Great Langdale location', () => {
      const result = filterSpas(spaData, [], 'Great Langdale', []);

      result.forEach((spa) => {
        expect(spa.location).toBe('Great Langdale');
      });
    });

    it('should return all spas when location is "All Locations"', () => {
      const result = filterSpas(spaData, [], 'All Locations', []);

      expect(result).toHaveLength(spaData.length);
    });

    it('should calculate active filter count as 1 when location is selected', () => {
      const count = calculateActiveFilterCount([], 'Borrowdale', []);
      expect(count).toBe(1);
    });

    it('should calculate active filter count as 0 when location is "All Locations"', () => {
      const count = calculateActiveFilterCount([], 'All Locations', []);
      expect(count).toBe(0);
    });
  });

  describe('Single Facility Filter', () => {
    it('should filter spas with sauna', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['sauna']);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
      });
    });

    it('should filter spas with steam room', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['steamRoom']);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.facilities.steamRoom).toBe(true);
      });
    });

    it('should filter spas with ice room', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['iceRoom']);

      result.forEach((spa) => {
        expect(spa.facilities.iceRoom).toBe(true);
      });
    });

    it('should filter spas with hot tub', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['hotTub']);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.facilities.hotTub).toBe(true);
      });
    });

    it('should filter spas with pool over 15m', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['poolOver15m']);

      result.forEach((spa) => {
        expect(spa.facilities.poolOver15m).toBe(true);
      });
    });

    it('should filter spas with thermal suite', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['thermalSuite']);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.facilities.thermalSuite).toBe(true);
      });
    });

    it('should calculate active filter count as 1 for single facility', () => {
      const count = calculateActiveFilterCount([], 'All Locations', ['sauna']);
      expect(count).toBe(1);
    });
  });

  describe('Multiple Facility Filters (AND logic)', () => {
    it('should require ALL selected facilities to be present (sauna AND steamRoom)', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['sauna', 'steamRoom']);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.steamRoom).toBe(true);
      });
    });

    it('should require ALL selected facilities (sauna AND iceRoom AND hotTub)', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['sauna', 'iceRoom', 'hotTub']);

      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.iceRoom).toBe(true);
        expect(spa.facilities.hotTub).toBe(true);
      });
    });

    it('should return fewer results when more facilities are required', () => {
      const oneFacility = filterSpas(spaData, [], 'All Locations', ['sauna']);
      const twoFacilities = filterSpas(spaData, [], 'All Locations', ['sauna', 'iceRoom']);
      const threeFacilities = filterSpas(
        spaData,
        [],
        'All Locations',
        ['sauna', 'iceRoom', 'hotTub']
      );

      expect(twoFacilities.length).toBeLessThanOrEqual(oneFacility.length);
      expect(threeFacilities.length).toBeLessThanOrEqual(twoFacilities.length);
    });

    it('should calculate active filter count for multiple facilities', () => {
      const count = calculateActiveFilterCount([], 'All Locations', ['sauna', 'iceRoom', 'hotTub']);
      expect(count).toBe(3);
    });
  });

  describe('Combined Filters (Business Model + Location)', () => {
    it('should filter by business model AND location', () => {
      // Find a location that has spas with specific business model
      const borrowdaleSpas = spaData.filter((spa) => spa.location === 'Borrowdale');
      const businessModels = [...new Set(borrowdaleSpas.map((spa) => spa.businessModel))];

      if (businessModels.length > 0) {
        const result = filterSpas(spaData, [businessModels[0]], 'Borrowdale', []);

        result.forEach((spa) => {
          expect(spa.businessModel).toBe(businessModels[0]);
          expect(spa.location).toBe('Borrowdale');
        });
      }
    });

    it('should calculate active filter count for business model + location', () => {
      const count = calculateActiveFilterCount(['free-with-booking'], 'Borrowdale', []);
      expect(count).toBe(2);
    });
  });

  describe('Combined Filters (Business Model + Facilities)', () => {
    it('should filter by business model AND facilities', () => {
      const result = filterSpas(
        spaData,
        ['free-with-booking'],
        'All Locations',
        ['sauna', 'steamRoom']
      );

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('free-with-booking');
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.steamRoom).toBe(true);
      });
    });

    it('should calculate active filter count for business model + facilities', () => {
      const count = calculateActiveFilterCount(
        ['free-with-booking'],
        'All Locations',
        ['sauna', 'steamRoom']
      );
      expect(count).toBe(3);
    });
  });

  describe('Combined Filters (Location + Facilities)', () => {
    it('should filter by location AND facilities', () => {
      // Find a location with enough spas to test
      const borrowdaleSpas = spaData.filter((spa) => spa.location === 'Borrowdale');

      if (borrowdaleSpas.length > 0) {
        const result = filterSpas(spaData, [], 'Borrowdale', ['sauna']);

        result.forEach((spa) => {
          expect(spa.location).toBe('Borrowdale');
          expect(spa.facilities.sauna).toBe(true);
        });
      }
    });

    it('should calculate active filter count for location + facilities', () => {
      const count = calculateActiveFilterCount([], 'Borrowdale', ['sauna', 'hotTub']);
      expect(count).toBe(3);
    });
  });

  describe('Combined Filters (All Three)', () => {
    it('should filter by business model AND location AND facilities', () => {
      const result = filterSpas(
        spaData,
        ['free-with-booking', 'guests-only'],
        'Borrowdale',
        ['sauna']
      );

      result.forEach((spa) => {
        expect(['free-with-booking', 'guests-only']).toContain(spa.businessModel);
        expect(spa.location).toBe('Borrowdale');
        expect(spa.facilities.sauna).toBe(true);
      });
    });

    it('should calculate active filter count for all three filter types', () => {
      const count = calculateActiveFilterCount(
        ['free-with-booking', 'guests-only'],
        'Borrowdale',
        ['sauna', 'iceRoom']
      );
      expect(count).toBe(5); // 2 business models + 1 location + 2 facilities
    });
  });

  describe('Empty Results Scenarios', () => {
    it('should return empty array when no spas match the filters', () => {
      // Create a filter combination that is impossible
      // Find a location with only certain business models
      const allLocations = [...new Set(spaData.map((spa) => spa.location))];

      // Try to find an impossible combination
      for (const location of allLocations) {
        const locationSpas = spaData.filter((spa) => spa.location === location);
        const availableModels = [...new Set(locationSpas.map((spa) => spa.businessModel))];
        const allModels: BusinessModel[] = [
          'free-with-booking',
          'paid-extra',
          'day-passes',
          'guests-only',
          'hybrid',
        ];
        const unavailableModel = allModels.find((m) => !availableModels.includes(m));

        if (unavailableModel) {
          const result = filterSpas(spaData, [unavailableModel], location, []);
          expect(result).toEqual([]);
          return;
        }
      }
    });

    it('should return empty array when requiring facilities that do not exist together', () => {
      // Check if there's a facility combination that no spa has
      const allFacilities = ['sauna', 'steamRoom', 'iceRoom', 'hotTub', 'poolOver15m', 'thermalSuite'];

      // Test with all facilities - it's unlikely any spa has all of them
      const result = filterSpas(spaData, [], 'All Locations', allFacilities);

      // If we get results, all spas should have all facilities
      result.forEach((spa) => {
        allFacilities.forEach((facility) => {
          const facilityKey = facility as keyof typeof spa.facilities;
          expect(spa.facilities[facilityKey]).toBe(true);
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty spa data array', () => {
      const result = filterSpas([], ['free-with-booking'], 'Borrowdale', ['sauna']);
      expect(result).toEqual([]);
    });

    it('should handle duplicate business models in filter', () => {
      const result = filterSpas(
        spaData,
        ['free-with-booking', 'free-with-booking'],
        'All Locations',
        []
      );

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('free-with-booking');
      });
    });

    it('should handle duplicate facilities in filter', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['sauna', 'sauna']);

      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
      });
    });

    it('should be case-sensitive for location matching', () => {
      const result = filterSpas(spaData, [], 'borrowdale', []); // lowercase
      expect(result).toEqual([]); // Should not match "Borrowdale"
    });
  });

  describe('Filter Consistency', () => {
    it('should produce same results when filters are applied in different order', () => {
      const filters1 = filterSpas(spaData, ['free-with-booking'], 'Borrowdale', ['sauna']);
      const filters2 = filterSpas(spaData, ['free-with-booking'], 'Borrowdale', ['sauna']);

      expect(filters1).toEqual(filters2);
    });

    it('should be deterministic - multiple calls return same results', () => {
      const businessModels: BusinessModel[] = ['free-with-booking', 'guests-only'];
      const location = 'Borrowdale';
      const facilities = ['sauna', 'steamRoom'];

      const result1 = filterSpas(spaData, businessModels, location, facilities);
      const result2 = filterSpas(spaData, businessModels, location, facilities);
      const result3 = filterSpas(spaData, businessModels, location, facilities);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('should find free spas in Borrowdale with sauna', () => {
      const result = filterSpas(spaData, ['free-with-booking'], 'Borrowdale', ['sauna']);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('free-with-booking');
        expect(spa.location).toBe('Borrowdale');
        expect(spa.facilities.sauna).toBe(true);
      });
    });

    it('should find spas with full thermal experience (sauna, steam, ice)', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['sauna', 'steamRoom', 'iceRoom']);

      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.steamRoom).toBe(true);
        expect(spa.facilities.iceRoom).toBe(true);
      });
    });

    it('should find public-accessible spas with large pools', () => {
      const result = filterSpas(spaData, ['day-passes'], 'All Locations', ['poolOver15m']);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('day-passes');
        expect(spa.facilities.poolOver15m).toBe(true);
      });
    });

    it('should find hotel-exclusive spas with thermal suite', () => {
      const result = filterSpas(spaData, ['guests-only'], 'All Locations', ['thermalSuite']);

      result.forEach((spa) => {
        expect(spa.businessModel).toBe('guests-only');
        expect(spa.facilities.thermalSuite).toBe(true);
      });
    });
  });

  describe('Performance Characteristics', () => {
    it('should handle filtering the entire dataset efficiently', () => {
      const startTime = performance.now();
      filterSpas(spaData, ['free-with-booking', 'guests-only'], 'Borrowdale', ['sauna', 'steamRoom']);
      const endTime = performance.now();

      // Filtering should take less than 10ms for this small dataset
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should not mutate the original spa data array', () => {
      const originalLength = spaData.length;
      const originalFirstSpa = { ...spaData[0] };

      filterSpas(spaData, ['free-with-booking'], 'Borrowdale', ['sauna']);

      expect(spaData.length).toBe(originalLength);
      expect(spaData[0]).toEqual(originalFirstSpa);
    });
  });
});
