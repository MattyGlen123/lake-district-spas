import {
  applyDayPassFilters,
  countActiveDayPassFilters,
  createDefaultDayPassFilters,
  DayPassFiltersState,
  sortDayPasses,
} from '@/lib/day-pass-catalog';
import { DayPassWithSpa } from '@/data/day-passes';
import { Spa } from '@/types/spa';

function makeSpa(id: number, facilities: Partial<Spa['facilities']> = {}): Spa {
  return {
    id,
    facilities: {
      sauna: false,
      steamRoom: false,
      iceRoom: false,
      hotTub: false,
      indoorPool: false,
      outdoorPool: false,
      coldPlunge: false,
      thermalSuite: false,
      infraredSauna: false,
      ...facilities,
    },
  } as unknown as Spa;
}

function makeDayPass(overrides: Partial<DayPassWithSpa> = {}): DayPassWithSpa {
  return {
    id: 'pass-1',
    packageName: 'Test Pass',
    priceGBP: 100,
    spaDuration: 3,
    treatmentsIncluded: false,
    refreshmentsIncluded: false,
    mealIncluded: false,
    spa: makeSpa(1),
    ...overrides,
  } as unknown as DayPassWithSpa;
}

describe('day-pass-catalog', () => {
  describe('applyDayPassFilters facility matching (delegates to shared matcher)', () => {
    const defaults = createDefaultDayPassFilters(500, [1, 2]);

    it('applies pool OR logic via the spa on the day pass', () => {
      const pass = makeDayPass({ spa: makeSpa(1, { outdoorPool: true }) });
      const filters: DayPassFiltersState = {
        ...defaults,
        facilities: ['indoorPool', 'outdoorPool'],
      };
      expect(applyDayPassFilters(pass, filters)).toBe(true);
    });

    it('matches iceRoom filter against a spa with only coldPlunge', () => {
      const pass = makeDayPass({ spa: makeSpa(1, { coldPlunge: true }) });
      const filters: DayPassFiltersState = { ...defaults, facilities: ['iceRoom'] };
      expect(applyDayPassFilters(pass, filters)).toBe(true);
    });

    it('rejects iceRoom filter when the spa has neither iceRoom nor coldPlunge', () => {
      const pass = makeDayPass({ spa: makeSpa(1) });
      const filters: DayPassFiltersState = { ...defaults, facilities: ['iceRoom'] };
      expect(applyDayPassFilters(pass, filters)).toBe(false);
    });

    it('requires non-pool/ice-room facilities with AND logic', () => {
      const pass = makeDayPass({ spa: makeSpa(1, { sauna: true }) });
      const filters: DayPassFiltersState = {
        ...defaults,
        facilities: ['sauna', 'hotTub'],
      };
      expect(applyDayPassFilters(pass, filters)).toBe(false);
    });
  });

  describe('applyDayPassFilters other rules', () => {
    const defaults = createDefaultDayPassFilters(500, [1, 2]);

    it('excludes passes over the max price', () => {
      const pass = makeDayPass({ priceGBP: 200 });
      expect(applyDayPassFilters(pass, { ...defaults, maxPrice: 100 })).toBe(false);
    });

    it('filters by selected spa ids', () => {
      const pass = makeDayPass({ spa: makeSpa(2) });
      expect(applyDayPassFilters(pass, { ...defaults, spas: [1] })).toBe(false);
      expect(applyDayPassFilters(pass, { ...defaults, spas: [2] })).toBe(true);
    });
  });

  describe('sortDayPasses', () => {
    it('sorts by price high to low and low to high', () => {
      const passes = [makeDayPass({ priceGBP: 50 }), makeDayPass({ priceGBP: 150 })];
      expect(sortDayPasses(passes, 'price-high-low').map((p) => p.priceGBP)).toEqual([
        150, 50,
      ]);
      expect(sortDayPasses(passes, 'price-low-high').map((p) => p.priceGBP)).toEqual([
        50, 150,
      ]);
    });
  });

  describe('countActiveDayPassFilters', () => {
    it('counts each selected facility individually', () => {
      const filters: DayPassFiltersState = {
        ...createDefaultDayPassFilters(500, [1, 2]),
        facilities: ['sauna', 'iceRoom'],
      };
      expect(countActiveDayPassFilters(filters, 500, 2)).toBe(2);
    });

    it('counts maxPrice and spa-subset as a single active filter each', () => {
      const filters: DayPassFiltersState = {
        ...createDefaultDayPassFilters(500, [1, 2]),
        maxPrice: 200,
        spas: [1],
      };
      expect(countActiveDayPassFilters(filters, 500, 2)).toBe(2);
    });
  });
});
