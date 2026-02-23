/**
 * Map of location names to their URL slugs for location pages
 * Add new locations here as location pages are created
 */
export const locationPageSlugs: Record<string, string> = {
  Windermere: 'windermere',
  Ambleside: 'ambleside',
  'Appleby-in-Westmorland': 'appleby-in-westmorland',
  Backbarrow: 'backbarrow',
  'Newby Bridge': 'newby-bridge',
  Bassenthwaite: 'bassenthwaite',
  Borrowdale: 'borrowdale',
  'Grange-over-Sands': 'grange-over-sands',
  Grasmere: 'grasmere',
  'Great Langdale': 'great-langdale',
  Penrith: 'penrith',
  Ullswater: 'ullswater',
  'Bowness-on-Windermere': 'bowness-on-windermere',
  // Add more locations as pages are created:
  // 'Keswick': 'keswick',
  // etc.
};

export interface LocationMeta {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}

export const locationMetadata: LocationMeta[] = [
  {
    name: 'Windermere',
    slug: 'windermere',
    image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
    tagline: "England's largest lake, with world-class spas to match",
  },
  {
    name: 'Ambleside',
    slug: 'ambleside',
    image: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
    tagline: 'A charming fell-side town with tranquil spa retreats',
  },
  {
    name: 'Bowness-on-Windermere',
    slug: 'bowness-on-windermere',
    image: '/images/locations/bowness-on-windermere-lake-district-spa-breaks.jpg',
    tagline: 'Lakeside village with boutique wellness escapes',
  },
  {
    name: 'Grasmere',
    slug: 'grasmere',
    image: '/images/locations/grasmere-lake-district-spa-breaks.jpg',
    tagline: "Wordsworth's village, surrounded by dramatic fells",
  },
  {
    name: 'Borrowdale',
    slug: 'borrowdale',
    image: '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
    tagline: 'A secluded valley of ancient oak woods and quiet spas',
  },
  {
    name: 'Great Langdale',
    slug: 'great-langdale',
    image: '/images/locations/great-langdale-lake-district-spa-breaks.jpg',
    tagline: 'Wild fell country at the heart of the Lake District',
  },
  {
    name: 'Ullswater',
    slug: 'ullswater',
    image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
    tagline: "England's most beautiful lake and outstanding spa destinations",
  },
  {
    name: 'Bassenthwaite',
    slug: 'bassenthwaite',
    image: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
    tagline: 'Remote lakeside tranquillity in the northern Lakes',
  },
  {
    name: 'Penrith',
    slug: 'penrith',
    image: '/images/locations/penrith-lake-district-spa-breaks.jpg',
    tagline: 'The gateway to the Lake District, close to Ullswater',
  },
  {
    name: 'Newby Bridge',
    slug: 'newby-bridge',
    image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
    tagline: 'Where the southern Lakes meet open countryside',
  },
  {
    name: 'Backbarrow',
    slug: 'backbarrow',
    image: '/images/locations/backbarrow-lake-district-spa-breaks.jpg',
    tagline: 'A quiet corner of the Furness Fells, near Windermere',
  },
  {
    name: 'Grange-over-Sands',
    slug: 'grange-over-sands',
    image: '/images/locations/grange-over-sands-lake-district-spa-breaks.jpg',
    tagline: 'An elegant Edwardian resort town on Morecambe Bay',
  },
  {
    name: 'Appleby-in-Westmorland',
    slug: 'appleby-in-westmorland',
    image: '/images/locations/appleby-in-westmorland-lake-district-spa-breaks.jpg',
    tagline: 'A historic market town on the edge of the Lakes',
  },
];

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

