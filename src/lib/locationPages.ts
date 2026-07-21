/**
 * Map of location names to their URL slugs, and small metadata used by
 * LocationsGrid / FeaturedLocations / Breadcrumbs / SideMenu.
 *
 * Both are derived from `locationPageConfigs` in `src/data/locations.ts` —
 * that file is the single source of truth. Add a new location page there,
 * not here.
 */
import { locationPageConfigs } from '@/data/locations';

export const locationPageSlugs: Record<string, string> = Object.fromEntries(
  locationPageConfigs.map((location) => [location.name, location.slug])
);

export interface LocationMeta {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}

export const locationMetadata: LocationMeta[] = locationPageConfigs.map(
  (location) => ({
    name: location.name,
    slug: location.slug,
    image: location.image,
    tagline: location.tagline,
  })
);

/**
 * Get the location page URL slug for a given location name
 * Returns null if no location page exists
 */
export function getLocationPageSlug(location: string): string | null {
  return locationPageSlugs[location] || null;
}

/**
 * Get the full location page URL path for a given location name
 * Returns null if no location page exists
 */
export function getLocationPagePath(location: string): string | null {
  const slug = getLocationPageSlug(location);
  return slug ? `/location/spas-in-${slug}` : null;
}
