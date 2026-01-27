/**
 * Map of location names to their URL slugs for location pages
 * Add new locations here as location pages are created
 */
export const locationPageSlugs: Record<string, string> = {
  Windermere: 'windermere',
  Ambleside: 'ambleside',
  'Appleby-in-Westmorland': 'appleby-in-westmorland',
  Backbarrow: 'backbarrow',
  Bassenthwaite: 'bassenthwaite',
  // Add more locations as pages are created:
  // 'Keswick': 'keswick',
  // 'Bowness-on-Windermere': 'bowness-on-windermere',
  // 'Ullswater': 'ullswater',
  // etc.
};

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

