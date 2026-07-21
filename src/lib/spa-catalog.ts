import { AccessLabel, Spa } from '@/types/spa';
import { matchesFacilityFilters } from '@/lib/facility-matching';
import { countActiveFilters as sumActiveFilters, countIf, countSelected } from '@/lib/filter-utils';

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

  if (!matchesFacilityFilters(spa.facilities, filters.facilities)) return false;

  return true;
}

export function countActiveFilters(filters: SpaFiltersState): number {
  return sumActiveFilters(filters, [
    countSelected((f) => f.accessLabels),
    countIf((f) => f.location !== 'All Locations'),
    countSelected((f) => f.facilities),
  ]);
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
