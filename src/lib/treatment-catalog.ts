import {
  ALL_CATEGORY_GROUP_LABELS,
  CATEGORY_GROUPS,
  PriceBracket,
} from '@/components/TreatmentFilters';
import { TreatmentWithSpa, parseTreatmentPrice } from '@/data/treatments';

export interface TreatmentFiltersState {
  priceBrackets: PriceBracket[];
  categories: string[];
  spas: number[];
}

export type TreatmentSortOption =
  | 'name-asc'
  | 'price-low-high'
  | 'price-high-low';

export const treatmentSortOptions: { value: TreatmentSortOption; label: string }[] = [
  { value: 'name-asc', label: 'A–Z' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];

export function buildInitialTreatmentFilters(
  spas: { id: number; name: string }[]
): TreatmentFiltersState {
  return {
    priceBrackets: [],
    categories: [...ALL_CATEGORY_GROUP_LABELS],
    spas: spas.map((spa) => spa.id),
  };
}

function matchesPriceBracket(price: string, bracket: PriceBracket): boolean {
  const value = parseTreatmentPrice(price);
  switch (bracket) {
    case 'under-75':
      return value < 75;
    case '75-100':
      return value >= 75 && value <= 100;
    case '100-150':
      return value > 100 && value <= 150;
    case '150-plus':
      return value > 150;
  }
}

export function filterTreatments(
  allTreatments: TreatmentWithSpa[],
  filters: TreatmentFiltersState
): TreatmentWithSpa[] {
  return allTreatments.filter((treatment) => {
    if (filters.priceBrackets.length > 0) {
      if (!treatment.price) return false;
      const matchesAny = filters.priceBrackets.some((bracket) =>
        matchesPriceBracket(treatment.price!, bracket)
      );
      if (!matchesAny) return false;
    }

    if (filters.categories.length < ALL_CATEGORY_GROUP_LABELS.length) {
      const allowedCategories = CATEGORY_GROUPS.filter((group) =>
        filters.categories.includes(group.label)
      ).flatMap((group) => group.categories);

      if (!allowedCategories.includes(treatment.category)) return false;
    }

    if (filters.spas.length > 0 && !filters.spas.includes(treatment.spa.id)) {
      return false;
    }

    return true;
  });
}

export function sortTreatments(
  treatments: TreatmentWithSpa[],
  sortBy: TreatmentSortOption
): TreatmentWithSpa[] {
  const sorted = [...treatments];
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low-high':
      return sorted.sort(
        (a, b) =>
          parseTreatmentPrice(a.price ?? '0') - parseTreatmentPrice(b.price ?? '0')
      );
    case 'price-high-low':
      return sorted.sort(
        (a, b) =>
          parseTreatmentPrice(b.price ?? '0') - parseTreatmentPrice(a.price ?? '0')
      );
    default:
      return sorted;
  }
}

export function countActiveTreatmentFilters(
  filters: TreatmentFiltersState,
  availableSpaCount: number
): number {
  return (
    (filters.priceBrackets.length > 0 ? 1 : 0) +
    (filters.categories.length < ALL_CATEGORY_GROUP_LABELS.length ? 1 : 0) +
    (filters.spas.length < availableSpaCount ? 1 : 0)
  );
}
