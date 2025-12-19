import { spaData, locations, facilityOptions } from '@/data/spas';
import { Spa, BusinessModel, businessModelConfig } from '@/types/spa';

describe('Spa Data Validation', () => {
  describe('Data Structure', () => {
    it('should have at least one spa', () => {
      expect(spaData.length).toBeGreaterThan(0);
    });

    it('should have 22 unique spas', () => {
      expect(spaData.length).toBe(22);
      const ids = spaData.map((spa) => spa.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(22);
    });

    it('each spa should have all required fields', () => {
      spaData.forEach((spa) => {
        expect(spa.id).toBeDefined();
        expect(spa.name).toBeDefined();
        expect(spa.location).toBeDefined();
        expect(spa.websiteUrl).toBeDefined();
        expect(spa.businessModel).toBeDefined();
        expect(spa.businessModelText).toBeDefined();
        expect(spa.imageUrl).toBeDefined();
        expect(spa.keyFeatures).toBeDefined();
        expect(spa.thermalFacilities).toBeDefined();
        expect(spa.poolFeatures).toBeDefined();
        expect(spa.accessPolicy).toBeDefined();
        expect(spa.goodToKnow).toBeDefined();
        expect(spa.facilities).toBeDefined();
      });
    });

    it('each spa should have non-empty required string fields', () => {
      spaData.forEach((spa) => {
        expect(spa.id.trim().length).toBeGreaterThan(0);
        expect(spa.name.trim().length).toBeGreaterThan(0);
        expect(spa.location.trim().length).toBeGreaterThan(0);
        expect(spa.businessModelText.trim().length).toBeGreaterThan(0);
        expect(spa.imageUrl.trim().length).toBeGreaterThan(0);
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
        expect(spa.imageUrl).toMatch(/^\/spa-.*\.jpg$/);
      });
    });
  });

  describe('Business Models', () => {
    const validBusinessModels: BusinessModel[] = [
      'free-with-booking',
      'paid-extra',
      'day-passes',
      'guests-only',
      'hybrid',
    ];

    it('each spa should have a valid business model', () => {
      spaData.forEach((spa) => {
        expect(validBusinessModels).toContain(spa.businessModel);
      });
    });

    it('business model config should exist for all business models', () => {
      const usedModels = new Set(spaData.map((spa) => spa.businessModel));
      usedModels.forEach((model) => {
        expect(businessModelConfig[model]).toBeDefined();
        expect(businessModelConfig[model].label).toBeDefined();
        expect(businessModelConfig[model].color).toBeDefined();
        expect(businessModelConfig[model].dot).toBeDefined();
        expect(businessModelConfig[model].badgeText).toBeDefined();
      });
    });

    it('should have expected distribution of business models', () => {
      const modelCounts = spaData.reduce((acc, spa) => {
        acc[spa.businessModel] = (acc[spa.businessModel] || 0) + 1;
        return acc;
      }, {} as Record<BusinessModel, number>);

      // Verify we have a reasonable distribution
      expect(modelCounts['free-with-booking']).toBeGreaterThan(0);
      expect(Object.keys(modelCounts).length).toBeGreaterThan(1);
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

    it('goodToKnow should be an array', () => {
      spaData.forEach((spa) => {
        expect(Array.isArray(spa.goodToKnow)).toBe(true);
        spa.goodToKnow.forEach((item) => {
          expect(typeof item).toBe('string');
          if (item.trim().length > 0) {
            expect(item.trim().length).toBeGreaterThan(0);
          }
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
        'poolOver15m',
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
        'poolOver15m',
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
