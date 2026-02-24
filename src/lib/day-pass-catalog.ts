import { DayPassWithSpa } from '@/data/day-passes';

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

  if (filters.facilities.length > 0) {
    const poolFilters = ['indoorPool', 'outdoorPool'];
    const selectedPools = filters.facilities.filter((facility) =>
      poolFilters.includes(facility)
    );
    const hasIceRoomFilter = filters.facilities.includes('iceRoom');
    const otherFacilities = filters.facilities.filter(
      (facility) => !poolFilters.includes(facility) && facility !== 'iceRoom'
    );

    if (selectedPools.length > 0) {
      const hasAnyPool = selectedPools.some((pool) => {
        const poolKey = pool as keyof typeof dayPass.spa.facilities;
        return dayPass.spa.facilities[poolKey];
      });
      if (!hasAnyPool) return false;
    }

    if (hasIceRoomFilter) {
      if (!dayPass.spa.facilities.iceRoom && !dayPass.spa.facilities.coldPlunge) {
        return false;
      }
    }

    if (otherFacilities.length > 0) {
      const hasAllOtherFacilities = otherFacilities.every((facility) => {
        const key = facility as keyof typeof dayPass.spa.facilities;
        return dayPass.spa.facilities[key];
      });
      if (!hasAllOtherFacilities) return false;
    }
  }

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
  return (
    (filters.maxPrice < maxPrice ? 1 : 0) +
    filters.durations.length +
    (filters.treatmentsIncluded === true ? 1 : 0) +
    (filters.refreshmentsIncluded === true ? 1 : 0) +
    (filters.mealIncluded === true ? 1 : 0) +
    filters.partyTypes.length +
    filters.facilities.length +
    (filters.spas.length < availableSpaCount ? 1 : 0)
  );
}
