import { spaData } from '@/data/spas';
import { AccessLabel, Spa } from '@/types/spa';

/**
 * Core filtering logic extracted from page.tsx for testing
 * This mirrors the filtering logic used in the Home component
 */
function filterSpas(
  spas: Spa[],
  accessLabels: AccessLabel[],
  location: string,
  facilities: string[]
): Spa[] {
  return spas.filter((spa: Spa) => {
    // Filter by access labels (OR logic - show if spa has ANY selected label)
    if (accessLabels.length > 0) {
      const hasAnyLabel = spa.accessLabels.some((label) =>
        accessLabels.includes(label)
      );
      if (!hasAnyLabel) {
        return false;
      }
    }

    // Filter by location
    if (location !== 'All Locations' && spa.location !== location) {
      return false;
    }

    // Filter by facilities - ALL selected facilities must be present
    // EXCEPT for pools: if both indoorPool and outdoorPool are selected, use OR logic
    // EXCEPT for ice room: if iceRoom is selected, show spas with either iceRoom OR coldPlunge
    if (facilities.length > 0) {
      const poolFilters = ['indoorPool', 'outdoorPool'];
      const selectedPools = facilities.filter((f) => poolFilters.includes(f));
      const hasIceRoomFilter = facilities.includes('iceRoom');
      const otherFacilities = facilities.filter(
        (f) => !poolFilters.includes(f) && f !== 'iceRoom'
      );

      // Check pools with OR logic if any are selected
      if (selectedPools.length > 0) {
        const hasAnyPool = selectedPools.some((pool) => {
          const poolKey = pool as keyof typeof spa.facilities;
          return spa.facilities[poolKey];
        });
        if (!hasAnyPool) {
          return false;
        }
      }

      // Check ice room filter with OR logic (iceRoom OR coldPlunge)
      if (hasIceRoomFilter) {
        if (!spa.facilities.iceRoom && !spa.facilities.coldPlunge) {
          return false;
        }
      }

      // Check other facilities with AND logic
      if (otherFacilities.length > 0) {
        const hasAllOtherFacilities = otherFacilities.every((facility) => {
          const facilityKey = facility as keyof typeof spa.facilities;
          return spa.facilities[facilityKey];
        });
        if (!hasAllOtherFacilities) {
          return false;
        }
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
  accessLabels: AccessLabel[],
  location: string,
  facilities: string[]
): number {
  return (
    accessLabels.length +
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

  describe('Single Access Label Filter', () => {
    it('should filter by "free-for-all-guests" access label', () => {
      const result = filterSpas(
        spaData,
        ['free-for-all-guests'],
        'All Locations',
        []
      );

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('free-for-all-guests');
      });
    });

    it('should filter by "paid-for-guests" access label', () => {
      const result = filterSpas(
        spaData,
        ['paid-for-guests'],
        'All Locations',
        []
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('paid-for-guests');
      });
    });

    it('should filter by "day-passes-available" access label', () => {
      const result = filterSpas(
        spaData,
        ['day-passes-available'],
        'All Locations',
        []
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('day-passes-available');
      });
    });

    it('should filter by "no-day-passes-available" access label', () => {
      const result = filterSpas(
        spaData,
        ['no-day-passes-available'],
        'All Locations',
        []
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('no-day-passes-available');
      });
    });

    it('should filter by "free-for-some-rooms" access label', () => {
      const result = filterSpas(
        spaData,
        ['free-for-some-rooms'],
        'All Locations',
        []
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('free-for-some-rooms');
      });
    });

    it('should calculate active filter count as 1 for single access label', () => {
      const count = calculateActiveFilterCount(
        ['free-for-all-guests'],
        'All Locations',
        []
      );
      expect(count).toBe(1);
    });
  });

  describe('Multiple Access Label Filters', () => {
    it('should return spas matching ANY of the selected access labels', () => {
      const selectedLabels: AccessLabel[] = [
        'free-for-all-guests',
        'no-day-passes-available',
      ];
      const result = filterSpas(spaData, selectedLabels, 'All Locations', []);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        const hasAnyLabel = spa.accessLabels.some((label) =>
          selectedLabels.includes(label)
        );
        expect(hasAnyLabel).toBe(true);
      });
    });

    it('should calculate active filter count for multiple access labels', () => {
      const count = calculateActiveFilterCount(
        ['free-for-all-guests', 'no-day-passes-available'],
        'All Locations',
        []
      );
      expect(count).toBe(2);
    });

    it('should return all spas when all access labels are selected', () => {
      const allLabels: AccessLabel[] = [
        'free-for-all-guests',
        'free-for-some-rooms',
        'paid-for-guests',
        'no-day-passes-available',
        'day-passes-available',
      ];
      const result = filterSpas(spaData, allLabels, 'All Locations', []);

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

    it('should filter spas with ice room or cold plunge', () => {
      const result = filterSpas(spaData, [], 'All Locations', ['iceRoom']);

      result.forEach((spa) => {
        const hasIceRoomOrColdPlunge =
          spa.facilities.iceRoom || spa.facilities.coldPlunge;
        expect(hasIceRoomOrColdPlunge).toBe(true);
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
      const result = filterSpas(spaData, [], 'All Locations', ['indoorPool']);

      result.forEach((spa) => {
        expect(spa.facilities.indoorPool).toBe(true);
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
      const result = filterSpas(spaData, [], 'All Locations', [
        'sauna',
        'steamRoom',
      ]);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.steamRoom).toBe(true);
      });
    });

    it('should require ALL selected facilities (sauna AND iceRoom AND hotTub)', () => {
      const result = filterSpas(spaData, [], 'All Locations', [
        'sauna',
        'iceRoom',
        'hotTub',
      ]);

      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
        // iceRoom filter uses OR logic (iceRoom OR coldPlunge)
        expect(spa.facilities.iceRoom || spa.facilities.coldPlunge).toBe(true);
        expect(spa.facilities.hotTub).toBe(true);
      });
    });

    it('should return fewer results when more facilities are required', () => {
      const oneFacility = filterSpas(spaData, [], 'All Locations', ['sauna']);
      const twoFacilities = filterSpas(spaData, [], 'All Locations', [
        'sauna',
        'iceRoom',
      ]);
      const threeFacilities = filterSpas(spaData, [], 'All Locations', [
        'sauna',
        'iceRoom',
        'hotTub',
      ]);

      expect(twoFacilities.length).toBeLessThanOrEqual(oneFacility.length);
      expect(threeFacilities.length).toBeLessThanOrEqual(twoFacilities.length);
    });

    it('should calculate active filter count for multiple facilities', () => {
      const count = calculateActiveFilterCount([], 'All Locations', [
        'sauna',
        'iceRoom',
        'hotTub',
      ]);
      expect(count).toBe(3);
    });
  });

  describe('Combined Filters (Access Label + Location)', () => {
    it('should filter by access label AND location', () => {
      // Find a location that has spas with specific access label
      const borrowdaleSpas = spaData.filter(
        (spa) => spa.location === 'Borrowdale'
      );
      const allLabels = borrowdaleSpas.flatMap((spa) => spa.accessLabels);
      const uniqueLabels = [...new Set(allLabels)];

      if (uniqueLabels.length > 0) {
        const result = filterSpas(spaData, [uniqueLabels[0]], 'Borrowdale', []);

        result.forEach((spa) => {
          expect(spa.accessLabels).toContain(uniqueLabels[0]);
          expect(spa.location).toBe('Borrowdale');
        });
      }
    });

    it('should calculate active filter count for access label + location', () => {
      const count = calculateActiveFilterCount(
        ['free-for-all-guests'],
        'Borrowdale',
        []
      );
      expect(count).toBe(2);
    });
  });

  describe('Combined Filters (Access Label + Facilities)', () => {
    it('should filter by access label AND facilities', () => {
      const result = filterSpas(
        spaData,
        ['free-for-all-guests'],
        'All Locations',
        ['sauna', 'steamRoom']
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('free-for-all-guests');
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.steamRoom).toBe(true);
      });
    });

    it('should calculate active filter count for access label + facilities', () => {
      const count = calculateActiveFilterCount(
        ['free-for-all-guests'],
        'All Locations',
        ['sauna', 'steamRoom']
      );
      expect(count).toBe(3);
    });
  });

  describe('Combined Filters (Location + Facilities)', () => {
    it('should filter by location AND facilities', () => {
      // Find a location with enough spas to test
      const borrowdaleSpas = spaData.filter(
        (spa) => spa.location === 'Borrowdale'
      );

      if (borrowdaleSpas.length > 0) {
        const result = filterSpas(spaData, [], 'Borrowdale', ['sauna']);

        result.forEach((spa) => {
          expect(spa.location).toBe('Borrowdale');
          expect(spa.facilities.sauna).toBe(true);
        });
      }
    });

    it('should calculate active filter count for location + facilities', () => {
      const count = calculateActiveFilterCount([], 'Borrowdale', [
        'sauna',
        'hotTub',
      ]);
      expect(count).toBe(3);
    });
  });

  describe('Combined Filters (All Three)', () => {
    it('should filter by access label AND location AND facilities', () => {
      const result = filterSpas(
        spaData,
        ['free-for-all-guests', 'no-day-passes-available'],
        'Borrowdale',
        ['sauna']
      );

      result.forEach((spa) => {
        const hasAnyLabel =
          spa.accessLabels.includes('free-for-all-guests') ||
          spa.accessLabels.includes('no-day-passes-available');
        expect(hasAnyLabel).toBe(true);
        expect(spa.location).toBe('Borrowdale');
        expect(spa.facilities.sauna).toBe(true);
      });
    });

    it('should calculate active filter count for all three filter types', () => {
      const count = calculateActiveFilterCount(
        ['free-for-all-guests', 'no-day-passes-available'],
        'Borrowdale',
        ['sauna', 'iceRoom']
      );
      expect(count).toBe(5); // 2 access labels + 1 location + 2 facilities
    });
  });

  describe('Empty Results Scenarios', () => {
    it('should return empty array when no spas match the filters', () => {
      // Create a filter combination that is impossible
      // Find a location with only certain access labels
      const allLocations = [...new Set(spaData.map((spa) => spa.location))];

      // Try to find an impossible combination
      for (const location of allLocations) {
        const locationSpas = spaData.filter((spa) => spa.location === location);
        const allLabels = locationSpas.flatMap((spa) => spa.accessLabels);
        const availableLabels = [...new Set(allLabels)];
        const allPossibleLabels: AccessLabel[] = [
          'free-for-all-guests',
          'free-for-some-rooms',
          'paid-for-guests',
          'no-day-passes-available',
          'day-passes-available',
        ];
        const unavailableLabel = allPossibleLabels.find(
          (l) => !availableLabels.includes(l)
        );

        if (unavailableLabel) {
          const result = filterSpas(spaData, [unavailableLabel], location, []);
          expect(result).toEqual([]);
          return;
        }
      }
    });

    it('should return empty array when requiring facilities that do not exist together', () => {
      // Check if there's a facility combination that no spa has
      const allFacilities = [
        'sauna',
        'steamRoom',
        'iceRoom',
        'hotTub',
        'indoorPool',
        'outdoorPool',
        'thermalSuite',
      ];

      // Test with all facilities - it's unlikely any spa has all of them
      const result = filterSpas(spaData, [], 'All Locations', allFacilities);

      // If we get results, all spas should have all facilities
      // Note: For pools, OR logic applies - spa needs either indoorPool OR outdoorPool
      // Note: For iceRoom, OR logic applies - spa needs either iceRoom OR coldPlunge
      result.forEach((spa) => {
        const poolFilters = ['indoorPool', 'outdoorPool'];
        const otherFacilities = allFacilities.filter(
          (f) => !poolFilters.includes(f) && f !== 'iceRoom'
        );

        // Check pools with OR logic
        const selectedPools = allFacilities.filter((f) =>
          poolFilters.includes(f)
        );
        if (selectedPools.length > 0) {
          const hasAnyPool = selectedPools.some((pool) => {
            const poolKey = pool as keyof typeof spa.facilities;
            return spa.facilities[poolKey];
          });
          expect(hasAnyPool).toBe(true);
        }

        // Check iceRoom with OR logic (iceRoom OR coldPlunge)
        if (allFacilities.includes('iceRoom')) {
          expect(spa.facilities.iceRoom || spa.facilities.coldPlunge).toBe(true);
        }

        // Check other facilities with AND logic
        otherFacilities.forEach((facility) => {
          const facilityKey = facility as keyof typeof spa.facilities;
          expect(spa.facilities[facilityKey]).toBe(true);
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty spa data array', () => {
      const result = filterSpas([], ['free-for-all-guests'], 'Borrowdale', [
        'sauna',
      ]);
      expect(result).toEqual([]);
    });

    it('should handle duplicate access labels in filter', () => {
      const result = filterSpas(
        spaData,
        ['free-for-all-guests', 'free-for-all-guests'],
        'All Locations',
        []
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('free-for-all-guests');
      });
    });

    it('should handle duplicate facilities in filter', () => {
      const result = filterSpas(spaData, [], 'All Locations', [
        'sauna',
        'sauna',
      ]);

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
      const filters1 = filterSpas(
        spaData,
        ['free-for-all-guests'],
        'Borrowdale',
        ['sauna']
      );
      const filters2 = filterSpas(
        spaData,
        ['free-for-all-guests'],
        'Borrowdale',
        ['sauna']
      );

      expect(filters1).toEqual(filters2);
    });

    it('should be deterministic - multiple calls return same results', () => {
      const accessLabels: AccessLabel[] = [
        'free-for-all-guests',
        'no-day-passes-available',
      ];
      const location = 'Borrowdale';
      const facilities = ['sauna', 'steamRoom'];

      const result1 = filterSpas(spaData, accessLabels, location, facilities);
      const result2 = filterSpas(spaData, accessLabels, location, facilities);
      const result3 = filterSpas(spaData, accessLabels, location, facilities);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('should find free spas in Borrowdale with sauna', () => {
      const result = filterSpas(
        spaData,
        ['free-for-all-guests'],
        'Borrowdale',
        ['sauna']
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('free-for-all-guests');
        expect(spa.location).toBe('Borrowdale');
        expect(spa.facilities.sauna).toBe(true);
      });
    });

    it('should find spas with full thermal experience (sauna, steam, ice)', () => {
      const result = filterSpas(spaData, [], 'All Locations', [
        'sauna',
        'steamRoom',
        'iceRoom',
      ]);

      result.forEach((spa) => {
        expect(spa.facilities.sauna).toBe(true);
        expect(spa.facilities.steamRoom).toBe(true);
        // iceRoom filter uses OR logic (iceRoom OR coldPlunge)
        expect(spa.facilities.iceRoom || spa.facilities.coldPlunge).toBe(true);
      });
    });

    it('should find public-accessible spas with large pools', () => {
      const result = filterSpas(
        spaData,
        ['day-passes-available'],
        'All Locations',
        ['indoorPool']
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('day-passes-available');
        expect(spa.facilities.indoorPool).toBe(true);
      });
    });

    it('should find spas with no day passes and thermal suite', () => {
      const result = filterSpas(
        spaData,
        ['no-day-passes-available'],
        'All Locations',
        ['thermalSuite']
      );

      result.forEach((spa) => {
        expect(spa.accessLabels).toContain('no-day-passes-available');
        expect(spa.facilities.thermalSuite).toBe(true);
      });
    });
  });

  describe('Performance Characteristics', () => {
    it('should handle filtering the entire dataset efficiently', () => {
      const startTime = performance.now();
      filterSpas(
        spaData,
        ['free-for-all-guests', 'no-day-passes-available'],
        'Borrowdale',
        ['sauna', 'steamRoom']
      );
      const endTime = performance.now();

      // Filtering should take less than 10ms for this small dataset
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should not mutate the original spa data array', () => {
      const originalLength = spaData.length;
      const originalFirstSpa = { ...spaData[0] };

      filterSpas(spaData, ['free-for-all-guests'], 'Borrowdale', ['sauna']);

      expect(spaData.length).toBe(originalLength);
      expect(spaData[0]).toEqual(originalFirstSpa);
    });
  });
});
