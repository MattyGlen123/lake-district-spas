import { describe, it, expect } from 'vitest';
import {
  locationPageSlugs,
  locationMetadata,
  getLocationPageSlug,
  getLocationPagePath,
} from '@/lib/locationPages';
import { spaData } from '@/data/spas';

describe('locationPageSlugs', () => {
  it('contains at least 13 location entries', () => {
    expect(Object.keys(locationPageSlugs).length).toBeGreaterThanOrEqual(13);
  });

  it('all slug values are lowercase kebab-case with no spaces', () => {
    Object.values(locationPageSlugs).forEach((slug) => {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it('slug values are unique', () => {
    const slugs = Object.values(locationPageSlugs);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('location names (keys) are unique', () => {
    const names = Object.keys(locationPageSlugs);
    expect(new Set(names).size).toBe(names.length);
  });

  it('includes Windermere → windermere', () => {
    expect(locationPageSlugs['Windermere']).toBe('windermere');
  });

  it('includes Borrowdale → borrowdale', () => {
    expect(locationPageSlugs['Borrowdale']).toBe('borrowdale');
  });
});

describe('getLocationPageSlug()', () => {
  it('returns windermere for Windermere', () => {
    expect(getLocationPageSlug('Windermere')).toBe('windermere');
  });

  it('returns borrowdale for Borrowdale', () => {
    expect(getLocationPageSlug('Borrowdale')).toBe('borrowdale');
  });

  it('returns grasmere for Grasmere', () => {
    expect(getLocationPageSlug('Grasmere')).toBe('grasmere');
  });

  it('returns null for an unknown location', () => {
    expect(getLocationPageSlug('Nonexistent Place')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getLocationPageSlug('')).toBeNull();
  });

  it('is case-sensitive — lowercase does not match', () => {
    expect(getLocationPageSlug('windermere')).toBeNull();
  });
});

describe('getLocationPagePath()', () => {
  it('returns /location/spas-in-windermere for Windermere', () => {
    expect(getLocationPagePath('Windermere')).toBe('/location/spas-in-windermere');
  });

  it('returns /location/spas-in-borrowdale for Borrowdale', () => {
    expect(getLocationPagePath('Borrowdale')).toBe('/location/spas-in-borrowdale');
  });

  it('returns /location/spas-in-grasmere for Grasmere', () => {
    expect(getLocationPagePath('Grasmere')).toBe('/location/spas-in-grasmere');
  });

  it('returns null for an unknown location', () => {
    expect(getLocationPagePath('Nonexistent Place')).toBeNull();
  });

  it('path always starts with /location/spas-in-', () => {
    Object.keys(locationPageSlugs).forEach((name) => {
      const path = getLocationPagePath(name);
      expect(path).toMatch(/^\/location\/spas-in-/);
    });
  });
});

describe('locationMetadata', () => {
  it('has at least 13 entries', () => {
    expect(locationMetadata.length).toBeGreaterThanOrEqual(13);
  });

  it('each entry has a non-empty name, slug, image, and tagline', () => {
    locationMetadata.forEach((meta) => {
      expect(meta.name.length, `name empty for ${meta.slug}`).toBeGreaterThan(0);
      expect(meta.slug.length, `slug empty for ${meta.name}`).toBeGreaterThan(0);
      expect(meta.image.length, `image empty for ${meta.name}`).toBeGreaterThan(0);
      expect(meta.tagline.length, `tagline empty for ${meta.name}`).toBeGreaterThan(0);
    });
  });

  it('all metadata slugs match a value in locationPageSlugs', () => {
    const slugValues = new Set(Object.values(locationPageSlugs));
    locationMetadata.forEach((meta) => {
      expect(
        slugValues.has(meta.slug),
        `Slug "${meta.slug}" in locationMetadata not found in locationPageSlugs`,
      ).toBe(true);
    });
  });

  it('every locationPageSlugs entry has a corresponding metadata entry', () => {
    const metaSlugs = new Set(locationMetadata.map((m) => m.slug));
    Object.entries(locationPageSlugs).forEach(([name, slug]) => {
      expect(
        metaSlugs.has(slug),
        `Slug "${slug}" (${name}) in locationPageSlugs has no entry in locationMetadata`,
      ).toBe(true);
    });
  });

  it('image paths start with / and reference a valid image extension', () => {
    locationMetadata.forEach((meta) => {
      expect(meta.image).toMatch(/^\/.*\.(jpg|jpeg|webp|png)$/);
    });
  });
});

describe('spaData location consistency', () => {
  it('every locationPageSlugs entry has at least one spa in spaData', () => {
    const spaLocations = new Set(spaData.map((s) => s.location));
    Object.keys(locationPageSlugs).forEach((locationName) => {
      expect(
        spaLocations.has(locationName),
        `Location "${locationName}" has a page but no spas in spaData`,
      ).toBe(true);
    });
  });
});
