// Matching cascade for /refresh-day-passes (PRD §4, issue 05).
// Direct import — the module is pure functions, no filesystem/process work.
import {
  extractBookingItemId,
  normalizeName,
  structuralSimilarity,
  matchPasses,
  TIER3_THRESHOLD,
} from '../../.claude/skills/refresh-day-passes/scripts/matching.mjs';

interface ExistingPass {
  id: string;
  packageName: string;
  priceGBP: number;
  spaDuration?: number;
  included?: string[];
  bookingUrl?: string;
}

interface FetchedPass {
  name: string;
  priceGBP: number;
  spaDuration?: number;
  included?: string[];
  bookingUrl?: string;
}

describe('extractBookingItemId', () => {
  it('extracts the trailing path segment', () => {
    expect(extractBookingItemId('https://whitewaterhotel.onejourney.travel/spa/days/6199')).toBe(
      '6199',
    );
  });

  it('strips query strings and fragments', () => {
    expect(extractBookingItemId('https://example.com/spa/days/6199?utm=x#foo')).toBe('6199');
  });

  it('ignores a trailing slash', () => {
    expect(extractBookingItemId('https://example.com/spa/days/6199/')).toBe('6199');
  });

  it('returns null for missing/empty urls', () => {
    expect(extractBookingItemId(undefined)).toBeNull();
    expect(extractBookingItemId('')).toBeNull();
  });
});

describe('normalizeName', () => {
  it('lowercases and collapses punctuation/whitespace', () => {
    expect(normalizeName('  Twilight   Spa!! ')).toBe('twilight spa');
    expect(normalizeName('Twilight Spa')).toBe(normalizeName('twilight-spa'));
  });
});

describe('structuralSimilarity', () => {
  it('scores an identical price/duration/inclusions pass as 1', () => {
    const a = { priceGBP: 90, spaDuration: 4, included: ['Afternoon tea', 'Pool access'] };
    const b = { priceGBP: 90, spaDuration: 4, included: ['afternoon tea', 'pool access'] };
    expect(structuralSimilarity(a, b)).toBeCloseTo(1, 2);
  });

  it('scores a wildly different pass low', () => {
    const a = { priceGBP: 50, spaDuration: 2, included: ['Sauna'] };
    const b = { priceGBP: 300, spaDuration: 8, included: ['Fireworks'] };
    expect(structuralSimilarity(a, b)).toBeLessThan(TIER3_THRESHOLD);
  });
});

describe('matchPasses cascade', () => {
  it('tier 1: matches by booking-portal item id with no rename when names agree', () => {
    const existing: ExistingPass[] = [
      {
        id: 'whitewater-pure-pampering',
        packageName: 'Pure Pampering',
        priceGBP: 90,
        spaDuration: 4,
        bookingUrl: 'https://whitewaterhotel.onejourney.travel/spa/days/6201',
      },
    ];
    const fetched: FetchedPass[] = [
      {
        name: 'Pure Pampering',
        priceGBP: 95,
        spaDuration: 4,
        bookingUrl: 'https://whitewaterhotel.onejourney.travel/spa/days/6201',
      },
    ];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toEqual([
      { tier: 1, existingId: 'whitewater-pure-pampering', fetchedName: 'Pure Pampering', rename: null },
    ]);
    expect(result.missingFlags).toEqual([]);
    expect(result.unmatchedFetched).toEqual([]);
  });

  it('tier 1: a differing name on the same booking-portal item id auto-applies a rename', () => {
    const existing: ExistingPass[] = [
      {
        id: 'swan-winter-glow',
        packageName: 'Winter Glow',
        priceGBP: 80,
        bookingUrl: 'https://swanhotel.trybe.example/spa/days/1234',
      },
    ];
    const fetched: FetchedPass[] = [
      {
        name: 'Spring Awakening',
        priceGBP: 80,
        bookingUrl: 'https://swanhotel.trybe.example/spa/days/1234',
      },
    ];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toEqual([
      {
        tier: 1,
        existingId: 'swan-winter-glow',
        fetchedName: 'Spring Awakening',
        rename: { from: 'Winter Glow', to: 'Spring Awakening' },
      },
    ]);
  });

  it('tier 2: exact normalized name match when booking urls do not line up', () => {
    const existing: ExistingPass[] = [
      { id: 'beech-hill-relax-spa-day', packageName: 'Relax Spa Day', priceGBP: 115 },
    ];
    const fetched: FetchedPass[] = [{ name: 'Relax Spa Day', priceGBP: 115 }];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toEqual([
      { tier: 2, existingId: 'beech-hill-relax-spa-day', fetchedName: 'Relax Spa Day', rename: null },
    ]);
  });

  it('dead bookingUrl + changed name falls all the way to tier 3 (suggestion only)', () => {
    const existing: ExistingPass[] = [
      {
        id: 'swan-winter-glow',
        packageName: 'Winter Glow',
        priceGBP: 80,
        spaDuration: 2,
        included: ['Thermal access', 'Glass of prosecco'],
        // stale/dead item id — no longer present on the live booking portal
        bookingUrl: 'https://swanhotel.trybe.example/spa/days/9999',
      },
    ];
    const fetched: FetchedPass[] = [
      {
        name: 'Spring Awakening',
        priceGBP: 82,
        spaDuration: 2,
        included: ['Thermal access', 'Glass of prosecco'],
        bookingUrl: 'https://swanhotel.trybe.example/spa/days/1111',
      },
    ];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toEqual([]);
    expect(result.tier3Suggestions).toHaveLength(1);
    expect(result.tier3Suggestions[0]).toMatchObject({
      existingId: 'swan-winter-glow',
      existingName: 'Winter Glow',
      fetchedName: 'Spring Awakening',
    });
    expect(result.tier3Suggestions[0].score).toBeGreaterThanOrEqual(TIER3_THRESHOLD);
    expect(result.missingFlags).toEqual([]);
    expect(result.unmatchedFetched).toEqual([]);
  });

  it('an existing pass matched by nothing is a missing-from-source flag', () => {
    const existing: ExistingPass[] = [
      { id: 'daffodil-discontinued-pass', packageName: 'Discontinued Pass', priceGBP: 60, spaDuration: 2 },
    ];
    const fetched: FetchedPass[] = [
      { name: 'Totally Different Package', priceGBP: 400, spaDuration: 8, included: ['Helicopter transfer'] },
    ];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toEqual([]);
    expect(result.tier3Suggestions).toEqual([]);
    expect(result.missingFlags).toEqual(['daffodil-discontinued-pass']);
    expect(result.unmatchedFetched).toEqual(['Totally Different Package']);
  });

  it('a fetched pass matching nothing existing is an info note only, never invented as data', () => {
    const existing: ExistingPass[] = [
      { id: 'grange-classic-day-spa', packageName: 'Classic Day Spa', priceGBP: 70, spaDuration: 3 },
    ];
    const fetched: FetchedPass[] = [
      { name: 'Classic Day Spa', priceGBP: 70, spaDuration: 3 },
      { name: 'Brand New Autumn Package', priceGBP: 120, spaDuration: 5 },
    ];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toHaveLength(1);
    expect(result.unmatchedFetched).toEqual(['Brand New Autumn Package']);
  });

  it('does not double-match: each existing/fetched pass consumed at most once', () => {
    const existing: ExistingPass[] = [
      { id: 'a', packageName: 'Same Name', priceGBP: 50 },
      { id: 'b', packageName: 'Same Name', priceGBP: 50 },
    ];
    const fetched: FetchedPass[] = [{ name: 'Same Name', priceGBP: 50 }];
    const result = matchPasses(existing, fetched);
    expect(result.matches).toHaveLength(1);
    expect(result.missingFlags).toEqual(['b']);
  });
});
