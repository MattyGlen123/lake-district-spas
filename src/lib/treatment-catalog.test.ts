import {
  buildInitialTreatmentFilters,
  countActiveTreatmentFilters,
  filterTreatments,
  sortTreatments,
  TreatmentFiltersState,
} from '@/lib/treatment-catalog';
import { TreatmentWithSpa } from '@/data/treatments';
import { ALL_CATEGORY_GROUP_LABELS } from '@/lib/treatment-categories';

function makeTreatment(overrides: Partial<TreatmentWithSpa> = {}): TreatmentWithSpa {
  return {
    spaId: 1,
    spa: { id: 1, name: 'Test Spa' },
    name: 'Test Treatment',
    category: 'Massage Therapies',
    duration: '60 minutes',
    shortDescription: 'desc',
    description: 'desc',
    price: '£80',
    ...overrides,
  } as unknown as TreatmentWithSpa;
}

describe('treatment-catalog', () => {
  const spas = [{ id: 1, name: 'Test Spa' }];

  describe('filterTreatments', () => {
    it('filters by price bracket', () => {
      const cheap = makeTreatment({ price: '£50' });
      const pricey = makeTreatment({ price: '£200' });
      const result = filterTreatments([cheap, pricey], {
        ...buildInitialTreatmentFilters(spas),
        priceBrackets: ['under-75'],
      });
      expect(result).toEqual([cheap]);
    });

    it('filters by category group', () => {
      const massage = makeTreatment({ category: 'Massage Therapies' });
      const facial = makeTreatment({ category: 'Facial Treatments' });
      const result = filterTreatments([massage, facial], {
        ...buildInitialTreatmentFilters(spas),
        categories: ['Body & Massage'],
      });
      expect(result).toEqual([massage]);
    });

    it('filters by selected spas', () => {
      const spaOne = makeTreatment({ spa: { id: 1, name: 'One' } as never });
      const spaTwo = makeTreatment({ spa: { id: 2, name: 'Two' } as never });
      const filters: TreatmentFiltersState = {
        ...buildInitialTreatmentFilters(spas),
        spas: [1],
      };
      expect(filterTreatments([spaOne, spaTwo], filters)).toEqual([spaOne]);
    });
  });

  describe('sortTreatments', () => {
    it('sorts by price low to high and high to low', () => {
      const treatments = [
        makeTreatment({ price: '£150' }),
        makeTreatment({ price: '£50' }),
      ];
      expect(sortTreatments(treatments, 'price-low-high').map((t) => t.price)).toEqual([
        '£50',
        '£150',
      ]);
      expect(sortTreatments(treatments, 'price-high-low').map((t) => t.price)).toEqual([
        '£150',
        '£50',
      ]);
    });
  });

  describe('countActiveTreatmentFilters', () => {
    it('counts priceBrackets as one active filter regardless of how many are selected', () => {
      const filters: TreatmentFiltersState = {
        ...buildInitialTreatmentFilters(spas),
        priceBrackets: ['under-75', '75-100'],
      };
      expect(countActiveTreatmentFilters(filters, spas.length)).toBe(1);
    });

    it('counts categories as active once any group is deselected', () => {
      const filters: TreatmentFiltersState = {
        ...buildInitialTreatmentFilters(spas),
        categories: ALL_CATEGORY_GROUP_LABELS.slice(0, 1),
      };
      expect(countActiveTreatmentFilters(filters, spas.length)).toBe(1);
    });

    it('returns 0 when no filters are active', () => {
      const filters = buildInitialTreatmentFilters(spas);
      expect(countActiveTreatmentFilters(filters, spas.length)).toBe(0);
    });
  });
});
