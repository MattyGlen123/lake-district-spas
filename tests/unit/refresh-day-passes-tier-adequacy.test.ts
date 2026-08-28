// Tier-adequacy assessment for /refresh-day-passes.
//
// A run gates the prices it can find and flags the ones it cannot — but never
// asked whether the SOURCE could answer at all. Swan sat on the html tier while
// its marketing page carried 3 of its 8 packages, so five passes were flagged
// every run indefinitely and reported as five pass problems rather than one
// source problem. These tests pin the coverage signal and the authority policy
// that decides which source wins a disagreement.
import {
  COVERAGE_FLOOR,
  assessCoverage,
  comparePriceSources,
  recommendTier,
} from '../../.claude/skills/refresh-day-passes/scripts/tier-adequacy.mjs';
import {
  AUTHORITY,
  isTransactable,
  tierFor,
  onejourneyCatalogueUrl,
  extractPropertyId,
  serverRendersCatalogue,
} from '../../.claude/skills/refresh-day-passes/scripts/tiers.mjs';

const grounded = (passId: string) => ({ passId, grounded: true, reason: 'grounded' });
const missing = (passId: string) => ({
  passId,
  grounded: false,
  reason: 'quote-not-found-in-artifact',
});
const poisoned = (passId: string) => ({
  passId,
  grounded: false,
  reason: 'poison-word:voucher',
});

describe('tier registry', () => {
  it('ranks a booking portal above published copy', () => {
    expect(AUTHORITY['portal-onejourney-api']).toBeGreaterThan(AUTHORITY.pdf);
    expect(AUTHORITY.pdf).toBeGreaterThan(AUTHORITY.html);
  });

  it('treats a Playwright-rendered page as no more authoritative than curl', () => {
    // Same marketing page, just fetched through a browser.
    expect(AUTHORITY.blocked).toBe(AUTHORITY.html);
  });

  it('knows which tiers read a real booking system', () => {
    expect(isTransactable('portal-trybe')).toBe(true);
    expect(isTransactable('portal-onejourney-api')).toBe(true);
    expect(isTransactable('html')).toBe(false);
    expect(isTransactable('pdf')).toBe(false);
  });

  it('records Swan on the API tier after its migration', () => {
    const swan = tierFor(5);
    expect(swan!.tier).toBe('portal-onejourney-api');
    expect(swan!.propertyId).toBe(165);
    expect(swan!.migratedFrom).toBe('html');
  });

  it('records that Lakeside has no SSR alternative', () => {
    // Its storefront returns an empty "queries":[] slot — same vendor as
    // Appleby, different capability. Never generalise one spa's rule.
    expect(tierFor(9)!.alternatives).toEqual([]);
  });

  it('returns null for an unregistered spa', () => {
    expect(tierFor(999)).toBeNull();
  });

  it('builds the catalogue URL without a /store prefix', () => {
    // The /store prefix belongs only to site-level routes; guessing it 404s.
    expect(onejourneyCatalogueUrl(165)).toBe('https://api.onejourney.travel/165/spa-packages/en');
    expect(onejourneyCatalogueUrl(340)).not.toContain('/store');
  });

  it('recovers a propertyId from a storefront payload', () => {
    expect(extractPropertyId('...{"property":{"id":165,"name":"The Swan"}}...')).toBe(165);
    expect(extractPropertyId('nothing here')).toBeNull();
  });

  it('detects whether a storefront server-renders its catalogue', () => {
    expect(serverRendersCatalogue('..."queries":[{"state":{"data":...')).toBe(true);
    expect(serverRendersCatalogue('..."queries":[]...')).toBe(false);
  });
});

describe('assessCoverage', () => {
  it('reports full coverage', () => {
    const c = assessCoverage([grounded('a'), grounded('b')]);
    expect(c.coverage).toBe(1);
    expect(c.sourceIncomplete).toBe(false);
  });

  it('flags an incomplete source when prices are simply absent', () => {
    const c = assessCoverage([grounded('a'), missing('b'), missing('c')]);
    expect(c.coverage).toBeCloseTo(1 / 3);
    expect(c.sourceIncomplete).toBe(true);
    expect(c.notFoundIds).toEqual(['b', 'c']);
  });

  // A poisoned span is a quoting problem, not evidence the source is missing
  // data — migrating tier would not fix it.
  it('does not blame the source for a non-missing failure', () => {
    const c = assessCoverage([grounded('a'), poisoned('b')]);
    expect(c.sourceIncomplete).toBe(false);
    expect(c.ungroundedIds).toEqual(['b']);
    expect(c.notFoundIds).toEqual([]);
  });

  it('handles an empty result set', () => {
    expect(assessCoverage([]).coverage).toBe(0);
    expect(assessCoverage().total).toBe(0);
  });
});

describe('comparePriceSources', () => {
  const html = { tier: 'html', checks: [{ passId: 'a', figureGBP: 65 }, { passId: 'b', figureGBP: 150 }] };
  const api = { tier: 'portal-onejourney-api', checks: [{ passId: 'a', figureGBP: 79 }, { passId: 'b', figureGBP: 150 }] };

  it('only compares passes both sources priced', () => {
    const r = comparePriceSources(html, { tier: 'html', checks: [{ passId: 'a', figureGBP: 65 }] });
    expect(r.comparedPasses).toBe(1);
  });

  it('finds the disagreement and awards it to the transactable source', () => {
    const r = comparePriceSources(html, api);
    expect(r.divergences).toHaveLength(1);
    expect(r.divergences[0].passId).toBe('a');
    expect(r.divergences[0].authoritative).toBe('portal-onejourney-api');
  });

  it('counts agreements', () => {
    expect(comparePriceSources(html, api).agreements).toBe(1);
  });

  it('calls equal-authority disagreements a tie rather than picking one', () => {
    const a = { tier: 'html', checks: [{ passId: 'x', figureGBP: 10 }] };
    const b = { tier: 'blocked', checks: [{ passId: 'x', figureGBP: 20 }] };
    expect(comparePriceSources(a, b).divergences[0].authoritative).toBe('tie');
  });
});

describe('recommendTier', () => {
  it('leaves an adequate tier alone', () => {
    const r = recommendTier(1, { tier: 'html', gateResults: [grounded('a')], checks: [] });
    expect(r.migrate).toBe(false);
    expect(r.reason).toBe('current-tier-adequate');
  });

  it('does not migrate on a hunch when no alternative was probed', () => {
    const r = recommendTier(1, { tier: 'html', gateResults: [grounded('a'), missing('b')], checks: [] });
    expect(r.migrate).toBe(false);
    expect(r.reason).toBe('no-candidate-probed');
  });

  // Trading one blind spot for another is not an improvement.
  it('refuses a candidate that loses a pass the current tier grounds', () => {
    const r = recommendTier(
      1,
      { tier: 'html', gateResults: [grounded('a'), grounded('b'), missing('c')], checks: [] },
      { tier: 'portal-trybe', gateResults: [grounded('a'), missing('b'), grounded('c')], checks: [] },
    );
    expect(r.migrate).toBe(false);
    expect(r.reason).toBe('candidate-regresses');
    expect(r.regressions).toEqual(['b']);
  });

  it('refuses a candidate that is merely equal', () => {
    const r = recommendTier(
      1,
      { tier: 'html', gateResults: [grounded('a'), missing('b')], checks: [] },
      { tier: 'portal-trybe', gateResults: [grounded('a'), missing('b')], checks: [] },
    );
    expect(r.migrate).toBe(false);
    expect(r.reason).toBe('candidate-no-better');
  });

  it('recommends a strictly better, transactable candidate', () => {
    const r = recommendTier(
      1,
      { tier: 'html', gateResults: [grounded('a'), missing('b')], checks: [] },
      { tier: 'portal-onejourney-api', gateResults: [grounded('a'), grounded('b')], checks: [] },
    );
    expect(r.migrate).toBe(true);
    expect(r.reason).toBe('candidate-covers-more-and-is-transactable');
  });
});

// The real decision from 2026-08-28, replayed. The html page carried 3 of 8
// packages and disagreed with the booking engine on one of those three.
describe('regression: the Swan tier decision', () => {
  const PASSES = [
    'swan-summer-glow-spa-escape',
    'swan-champagne-truffle-spa-day',
    'swan-thermal-access-afternoon-tea',
    'swan-holte-socials-night-friday',
    'swan-holte-after-hours-sunday-thursday',
    'swan-treatment-thermal-package',
    'swan-full-works-spa-day',
    'swan-holte-restorative-ritual',
  ];

  const htmlRun = {
    tier: 'html',
    gateResults: PASSES.map((p, i) => (i < 3 ? grounded(p) : missing(p))),
    checks: [
      { passId: 'swan-summer-glow-spa-escape', figureGBP: 150 },
      { passId: 'swan-champagne-truffle-spa-day', figureGBP: 150 },
      { passId: 'swan-thermal-access-afternoon-tea', figureGBP: 65 },
    ],
  };

  const apiRun = {
    tier: 'portal-onejourney-api',
    gateResults: PASSES.map(grounded),
    checks: [
      { passId: 'swan-summer-glow-spa-escape', figureGBP: 150 },
      { passId: 'swan-champagne-truffle-spa-day', figureGBP: 150 },
      { passId: 'swan-thermal-access-afternoon-tea', figureGBP: 79 },
    ],
  };

  it('scores the html tier as an incomplete source, not five bad passes', () => {
    const c = assessCoverage(htmlRun.gateResults);
    expect(c.coverage).toBeLessThan(COVERAGE_FLOOR);
    expect(c.sourceIncomplete).toBe(true);
    expect(c.notFoundIds).toHaveLength(5);
  });

  it('recommends the migration', () => {
    const r = recommendTier(5, htmlRun, apiRun);
    expect(r.migrate).toBe(true);
    expect(r.currentCoverage.grounded).toBe(3);
    expect(r.candidateCoverage!.grounded).toBe(8);
  });

  it('surfaces the £65-vs-£79 disagreement rather than applying it silently', () => {
    const r = recommendTier(5, htmlRun, apiRun);
    expect(r.divergenceReview).toHaveLength(1);
    const d = r.divergenceReview![0];
    expect(d.passId).toBe('swan-thermal-access-afternoon-tea');
    expect(d.htmlGBP).toBe(65);
    expect(d['portal-onejourney-apiGBP']).toBe(79);
    expect(d.authoritative).toBe('portal-onejourney-api');
  });

  it('agrees on the two prices both sources carried correctly', () => {
    const r = recommendTier(5, htmlRun, apiRun);
    expect(r.comparison!.agreements).toBe(2);
  });
});
