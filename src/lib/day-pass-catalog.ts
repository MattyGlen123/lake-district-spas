import { DayPassWithSpa } from '@/data/day-passes';
import { matchesFacilityFilters } from '@/lib/facility-matching';
import { countActiveFilters as sumActiveFilters, countIf, countSelected } from '@/lib/filter-utils';

export interface DayPassFiltersState {
  maxPrice: number;
  durations: number[];
  treatmentsIncluded: boolean | null;
  refreshmentsIncluded: boolean | null;
  mealIncluded: boolean | null;
  partyTypes: string[];
  facilities: string[];
  spas: number[];
}

export type DayPassSortOption =
  | 'price-high-low'
  | 'price-low-high'
  | 'duration-shortest'
  | 'duration-longest';

export const dayPassSortOptions: { value: DayPassSortOption; label: string }[] = [
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'duration-shortest', label: 'Duration: Shortest First' },
  { value: 'duration-longest', label: 'Duration: Longest First' },
];

export function createDefaultDayPassFilters(
  maxPrice: number,
  spaIds: number[]
): DayPassFiltersState {
  return {
    maxPrice,
    durations: [],
    treatmentsIncluded: null,
    refreshmentsIncluded: null,
    mealIncluded: null,
    partyTypes: [],
    facilities: [],
    spas: spaIds,
  };
}

export function applyDayPassFilters(
  dayPass: DayPassWithSpa,
  filters: DayPassFiltersState
): boolean {
  if (dayPass.priceGBP > filters.maxPrice) return false;

  if (
    filters.durations.length > 0 &&
    !filters.durations.includes(dayPass.spaDuration)
  ) {
    return false;
  }

  const inclusionFilters: boolean[] = [];
  if (filters.treatmentsIncluded === true) {
    inclusionFilters.push(dayPass.treatmentsIncluded);
  }
  if (filters.refreshmentsIncluded === true) {
    inclusionFilters.push(dayPass.refreshmentsIncluded);
  }
  if (filters.mealIncluded === true) {
    inclusionFilters.push(dayPass.mealIncluded);
  }
  if (inclusionFilters.length > 0 && inclusionFilters.some((value) => !value)) {
    return false;
  }

  if (filters.partyTypes.length > 0) {
    let matchesPartyType = false;
    for (const type of filters.partyTypes) {
      if (type === 'Single') {
        if (!dayPass.requiredNumbers && !dayPass.pricePerPerson) {
          matchesPartyType = true;
          break;
        }
      } else if (type === 'Couples') {
        if (
          dayPass.requiredNumbers?.includes('2') ||
          dayPass.requiredNumbers?.toLowerCase().includes('couple')
        ) {
          matchesPartyType = true;
          break;
        }
      } else if (type === 'Groups') {
        if (
          dayPass.requiredNumbers?.includes('-') ||
          dayPass.requiredNumbers?.toLowerCase().includes('group')
        ) {
          matchesPartyType = true;
          break;
        }
      }
    }

    if (!matchesPartyType) {
      return false;
    }
  }

  if (!matchesFacilityFilters(dayPass.spa.facilities, filters.facilities)) return false;

  if (filters.spas.length > 0 && !filters.spas.includes(dayPass.spa.id)) {
    return false;
  }

  return true;
}

export function sortDayPasses(
  dayPasses: DayPassWithSpa[],
  sortBy: DayPassSortOption
): DayPassWithSpa[] {
  const sorted = [...dayPasses];
  switch (sortBy) {
    case 'price-high-low':
      return sorted.sort((a, b) => b.priceGBP - a.priceGBP);
    case 'price-low-high':
      return sorted.sort((a, b) => a.priceGBP - b.priceGBP);
    case 'duration-shortest':
      return sorted.sort((a, b) => a.spaDuration - b.spaDuration);
    case 'duration-longest':
      return sorted.sort((a, b) => b.spaDuration - a.spaDuration);
    default:
      return sorted;
  }
}

export function countActiveDayPassFilters(
  filters: DayPassFiltersState,
  maxPrice: number,
  availableSpaCount: number
): number {
  return sumActiveFilters(filters, [
    countIf((f) => f.maxPrice < maxPrice),
    countSelected((f) => f.durations),
    countIf((f) => f.treatmentsIncluded === true),
    countIf((f) => f.refreshmentsIncluded === true),
    countIf((f) => f.mealIncluded === true),
    countSelected((f) => f.partyTypes),
    countSelected((f) => f.facilities),
    countIf((f) => f.spas.length < availableSpaCount),
  ]);
}
