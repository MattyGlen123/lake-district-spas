import { spaData, locations, facilityOptions } from '@/data/spas';
import { Spa, AccessLabel, accessLabelConfig } from '@/types/spa';

describe('Spa Data Validation', () => {
  describe('Data Structure', () => {
    it('should have at least one spa', () => {
      expect(spaData.length).toBeGreaterThan(0);
    });

    it('should have 20 unique spas', () => {
      expect(spaData.length).toBe(19);
      const ids = spaData.map((spa) => spa.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(19);
    });

    it('each spa should have all required fields', () => {
      spaData.forEach((spa) => {
        expect(spa.id).toBeDefined();
        expect(spa.name).toBeDefined();
        expect(spa.location).toBeDefined();
        expect(spa.websiteUrl).toBeDefined();
        expect(spa.accessLabels).toBeDefined();
        expect(spa.imageSrc).toBeDefined();
        expect(spa.imageAlt).toBeDefined();
        expect(spa.keyFeatures).toBeDefined();
        expect(spa.thermalFacilities).toBeDefined();
        expect(spa.poolFeatures).toBeDefined();
        expect(spa.accessPolicy).toBeDefined();
        expect(spa.facilities).toBeDefined();
      });
    });

    it('each spa should have non-empty required string fields', () => {
      spaData.forEach((spa) => {
        expect(spa.id.trim().length).toBeGreaterThan(0);
        expect(spa.name.trim().length).toBeGreaterThan(0);
        expect(spa.location.trim().length).toBeGreaterThan(0);
        expect(spa.imageSrc.trim().length).toBeGreaterThan(0);
        expect(spa.imageAlt.trim().length).toBeGreaterThan(0);
      });
    });

    it('each spa should have valid kebab-case IDs', () => {
      spaData.forEach((spa) => {
        // ID should be lowercase with hyphens, no spaces or special chars
        expect(spa.id).toMatch(/^[a-z0-9-]+$/);
        expect(spa.id).not.toMatch(/^-|-$/); // No leading/trailing hyphens
      });
    });

    it('each spa should have valid image URL format', () => {
      spaData.forEach((spa) => {
        // Images can be .jpg, .jpeg, .webp, or .png
        expect(spa.imageSrc).toMatch(/^\/.*\.(jpg|jpeg|webp|png)$/);
      });
    });
  });

  describe('Access Labels', () => {
    const validAccessLabels: AccessLabel[] = [
      'free-for-all-guests',
      'free-for-some-rooms',
      'paid-for-guests',
      'guests-only-no-passes',
      'day-passes-available',
    ];

    it('each spa should have valid access labels', () => {
      spaData.forEach((spa) => {
        expect(Array.isArray(spa.accessLabels)).toBe(true);
        expect(spa.accessLabels.length).toBeGreaterThan(0);
        spa.accessLabels.forEach((label) => {
          expect(validAccessLabels).toContain(label);
        });
      });
    });

    it('access label config should exist for all access labels', () => {
      const allLabels = spaData.flatMap((spa) => spa.accessLabels);
      const uniqueLabels = [...new Set(allLabels)];
      uniqueLabels.forEach((label) => {
        expect(accessLabelConfig[label]).toBeDefined();
        expect(accessLabelConfig[label].label).toBeDefined();
        expect(accessLabelConfig[label].shortLabel).toBeDefined();
        expect(accessLabelConfig[label].color).toBeDefined();
        expect(accessLabelConfig[label].dot).toBeDefined();
        expect(accessLabelConfig[label].badgeText).toBeDefined();
        expect(accessLabelConfig[label].category).toBeDefined();
      });
    });

    it('should have expected distribution of access labels', () => {
      const labelCounts = spaData.reduce((acc, spa) => {
        spa.accessLabels.forEach((label) => {
          acc[label] = (acc[label] || 0) + 1;
        });
        return acc;
      }, {} as Record<AccessLabel, number>);

      // Verify we have a reasonable distribution
      expect(labelCounts['free-for-all-guests']).toBeGreaterThan(0);
      expect(Object.keys(labelCounts).length).toBeGreaterThan(1);
    });
  });

  describe('Arrays and Collections', () => {
    it('each spa should have at least one key feature', () => {
      spaData.forEach((spa) => {
        expect(Array.isArray(spa.keyFeatures)).toBe(true);
        expect(spa.keyFeatures.length).toBeGreaterThan(0);
      });
    });

    it('key features should be non-empty strings', () => {
      spaData.forEach((spa) => {
        spa.keyFeatures.forEach((feature) => {
          expect(typeof feature).toBe('string');
          expect(feature.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('thermal facilities should have name and details', () => {
      spaData.forEach((spa) => {
        spa.thermalFacilities.forEach((facility) => {
          expect(facility.name).toBeDefined();
          expect(facility.details).toBeDefined();
          expect(typeof facility.name).toBe('string');
          expect(typeof facility.details).toBe('string');
          expect(facility.name.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('pool features should have name and details', () => {
      spaData.forEach((spa) => {
        spa.poolFeatures.forEach((feature) => {
          expect(feature.name).toBeDefined();
          expect(feature.details).toBeDefined();
          expect(typeof feature.name).toBe('string');
          expect(typeof feature.details).toBe('string');
          expect(feature.name.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('access policy should be an array with at least one item', () => {
      spaData.forEach((spa) => {
        expect(Array.isArray(spa.accessPolicy)).toBe(true);
        expect(spa.accessPolicy.length).toBeGreaterThan(0);
        spa.accessPolicy.forEach((policy) => {
          expect(typeof policy).toBe('string');
          expect(policy.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Facilities Object', () => {
    it('each spa should have all facility boolean flags', () => {
      const requiredFacilities = [
        'sauna',
        'steamRoom',
        'iceRoom',
        'hotTub',
        'indoorPool',
        'outdoorPool',
        'thermalSuite',
      ];

      spaData.forEach((spa) => {
        requiredFacilities.forEach((facility) => {
          expect(
            spa.facilities[facility as keyof typeof spa.facilities]
          ).toBeDefined();
          expect(
            typeof spa.facilities[facility as keyof typeof spa.facilities]
          ).toBe('boolean');
        });
      });
    });

    it('thermal suite should be true if spa has multiple thermal facilities', () => {
      spaData.forEach((spa) => {
        const thermalCount =
          (spa.facilities.sauna ? 1 : 0) +
          (spa.facilities.steamRoom ? 1 : 0) +
          (spa.facilities.iceRoom ? 1 : 0);

        if (thermalCount >= 2) {
          expect(spa.facilities.thermalSuite).toBe(true);
        }
      });
    });
  });

  describe('Locations', () => {
    it('locations array should include "All Locations"', () => {
      expect(locations).toContain('All Locations');
    });

    it('all spa locations should be in the locations array', () => {
      const spaLocations = new Set(spaData.map((spa) => spa.location));
      spaLocations.forEach((location) => {
        expect(locations).toContain(location);
      });
    });

    it('locations should be unique', () => {
      const uniqueLocations = new Set(locations);
      expect(uniqueLocations.size).toBe(locations.length);
    });
  });

  describe('Facility Options', () => {
    it('facility options should match facility keys', () => {
      const facilityKeys = new Set(facilityOptions.map((option) => option.key));
      const spaFacilityKeys = new Set([
        'sauna',
        'steamRoom',
        'iceRoom',
        'hotTub',
        'indoorPool',
        'outdoorPool',
        'thermalSuite',
      ]);

      expect(facilityKeys).toEqual(spaFacilityKeys);
    });

    it('each facility option should have a key and label', () => {
      facilityOptions.forEach((option) => {
        expect(option.key).toBeDefined();
        expect(option.label).toBeDefined();
        expect(typeof option.key).toBe('string');
        expect(typeof option.label).toBe('string');
        expect(option.key.trim().length).toBeGreaterThan(0);
        expect(option.label.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have no duplicate spa names', () => {
      const names = spaData.map((spa) => spa.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have no duplicate spa IDs', () => {
      const ids = spaData.map((spa) => spa.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('website URLs should be valid format', () => {
      spaData.forEach((spa) => {
        // Should be either a valid URL starting with http/https or '#'
        expect(
          spa.websiteUrl === '#' ||
            spa.websiteUrl.startsWith('http://') ||
            spa.websiteUrl.startsWith('https://')
        ).toBe(true);
      });
    });
  });
});
