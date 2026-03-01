import { AccessLabel, Spa } from '@/types/spa';

export interface SpaFiltersState {
  accessLabels: AccessLabel[];
  location: string;
  facilities: string[];
}

export type SpaSortOption = 'featured' | 'name-asc' | 'name-desc' | 'location-asc';

export const spaSortOptions: { value: SpaSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'location-asc', label: 'Location: A–Z' },
];

export function createDefaultSpaFilters(): SpaFiltersState {
  return {
    accessLabels: [],
    location: 'All Locations',
    facilities: [],
  };
}

export function applyFilters(spa: Spa, filters: SpaFiltersState): boolean {
  if (filters.accessLabels.length > 0) {
    const hasAnyLabel = spa.accessLabels.some((label) =>
      filters.accessLabels.includes(label)
    );
    if (!hasAnyLabel) return false;
  }

  if (filters.location !== 'All Locations' && spa.location !== filters.location) {
    return false;
  }

  if (filters.facilities.length > 0) {
    const poolFilters = ['indoorPool', 'outdoorPool'];
    const selectedPools = filters.facilities.filter((f) => poolFilters.includes(f));
    const hasIceRoomFilter = filters.facilities.includes('iceRoom');
    const otherFacilities = filters.facilities.filter(
      (f) => !poolFilters.includes(f) && f !== 'iceRoom'
    );

    if (selectedPools.length > 0) {
      const hasAnyPool = selectedPools.some((pool) => {
        const poolKey = pool as keyof typeof spa.facilities;
        return spa.facilities[poolKey];
      });
      if (!hasAnyPool) return false;
    }

    if (hasIceRoomFilter) {
      if (!spa.facilities.iceRoom && !spa.facilities.coldPlunge) return false;
    }

    if (otherFacilities.length > 0) {
      const hasAllOtherFacilities = otherFacilities.every((facility) => {
        const facilityKey = facility as keyof typeof spa.facilities;
        return spa.facilities[facilityKey];
      });
      if (!hasAllOtherFacilities) return false;
    }
  }

  return true;
}

export function countActiveFilters(filters: SpaFiltersState): number {
  return (
    filters.accessLabels.length +
    (filters.location !== 'All Locations' ? 1 : 0) +
    filters.facilities.length
  );
}

export function sortSpas(spas: Spa[], sortBy: SpaSortOption): Spa[] {
  switch (sortBy) {
    case 'featured':
      return [...spas];
    default:
      return [...spas].sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'location-asc':
            return a.location.localeCompare(b.location) || a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }
}
