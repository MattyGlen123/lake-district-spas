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
  it('returns the correct slug for a known location', () => {
    expect(getLocationPageSlug('Windermere')).toBe('windermere');
    expect(getLocationPageSlug('Borrowdale')).toBe('borrowdale');
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
  it('returns the correct full path for a known location', () => {
    expect(getLocationPagePath('Windermere')).toBe('/location/spas-in-windermere');
    expect(getLocationPagePath('Borrowdale')).toBe('/location/spas-in-borrowdale');
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

  it('image paths start with / and reference a valid image extension', () => {
    locationMetadata.forEach((meta) => {
      expect(meta.image).toMatch(/^\/.*\.(jpg|jpeg|webp|png)$/);
    });
  });
});

describe('spaData location consistency', () => {
  it('every spa location that has a page exists in locationPageSlugs', () => {
    const spaLocationsWithPages = spaData
      .map((s) => s.location)
      .filter((loc) => locationPageSlugs[loc] !== undefined);

    spaLocationsWithPages.forEach((loc) => {
      expect(typeof locationPageSlugs[loc]).toBe('string');
    });
  });
});
