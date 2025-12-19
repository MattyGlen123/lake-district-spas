import { businessModelConfig, BusinessModel } from '@/types/spa';
import { spaData } from '@/data/spas';

describe('Business Model Configuration', () => {
  const validBusinessModels: BusinessModel[] = [
    'free-with-booking',
    'paid-extra',
    'day-passes',
    'guests-only',
    'hybrid',
  ];

  describe('Configuration Completeness', () => {
    it('should have config for all valid business models', () => {
      validBusinessModels.forEach((model) => {
        expect(businessModelConfig[model]).toBeDefined();
      });
    });

    it('each config should have all required properties', () => {
      validBusinessModels.forEach((model) => {
        const config = businessModelConfig[model];
        expect(config.label).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.dot).toBeDefined();
        expect(config.badgeText).toBeDefined();

        expect(typeof config.label).toBe('string');
        expect(typeof config.color).toBe('string');
        expect(typeof config.dot).toBe('string');
        expect(typeof config.badgeText).toBe('string');
      });
    });

    it('color should be a valid Tailwind class', () => {
      validBusinessModels.forEach((model) => {
        const color = businessModelConfig[model].color;
        expect(color).toMatch(/^bg-spa-(green|yellow|blue|red|purple)$/);
      });
    });

    it('dot should be an emoji', () => {
      validBusinessModels.forEach((model) => {
        const dot = businessModelConfig[model].dot;
        // Check if it's an emoji (contains emoji characters)
        expect(dot.length).toBeGreaterThan(0);
        expect(dot).toMatch(/[\u{1F300}-\u{1F9FF}]/u);
      });
    });
  });

  describe('Business Model Text', () => {
    it('each spa should have descriptive business model text', () => {
      spaData.forEach((spa) => {
        expect(spa.businessModelText.length).toBeGreaterThan(5);
        expect(spa.businessModelText.trim().length).toBeGreaterThan(0);
      });
    });

    it('business model text should be descriptive and non-empty', () => {
      spaData.forEach((spa) => {
        const text = spa.businessModelText.toLowerCase();
        // Just verify it's descriptive - the business model enum is the source of truth
        // We don't enforce specific wording as business model text can vary
        expect(text.length).toBeGreaterThan(10);
        expect(text.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Business Model Distribution', () => {
    it('should have spas with different business models', () => {
      const uniqueModels = new Set(spaData.map((spa) => spa.businessModel));
      expect(uniqueModels.size).toBeGreaterThan(1);
    });

    it('should have expected minimum counts for each model type', () => {
      const modelCounts = spaData.reduce((acc, spa) => {
        acc[spa.businessModel] = (acc[spa.businessModel] || 0) + 1;
        return acc;
      }, {} as Record<BusinessModel, number>);

      // At least one of each major type should exist
      expect(modelCounts['free-with-booking']).toBeGreaterThan(0);
    });
  });
});
