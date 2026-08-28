#!/usr/bin/env node
// Fetch-tier registry for /refresh-day-passes.
//
// Tier assignment used to live only in SKILL.md prose, which meant nothing
// could reason about it: a run could not ask "is this spa on the right tier?"
// or "what else could I try?" without a human reading the document. Swan spent
// months on `html` while its marketing page carried 3 of its 8 prices, and one
// of those three was £14 out of date, because nothing ever asked the question.
//
// This is that prose as data. `tier-adequacy.mjs` reads it.

/** Tiers in ascending order of price AUTHORITY — see AUTHORITY below. */
export const TIERS = [
  'html',
  'blocked',
  'pdf',
  'portal-trybe',
  'portal-onejourney',
  'portal-onejourney-api',
];

/**
 * How much a tier's prices can be trusted when two sources disagree.
 *
 * THE POLICY, stated once: **the price a customer can actually transact at
 * beats marketing copy.** A booking portal is what takes the money; a spa's
 * own page is advertising and goes stale without anyone noticing. Swan's page
 * said £65 for a package the booking engine charged £79.
 *
 * A brochure PDF sits above a web page (it is dated and usually the contractual
 * price list) but below a portal (it is still not the checkout).
 *
 * This ranking NEVER silently overwrites data. It decides which source a run
 * should prefer, and any disagreement is reported either way.
 */
export const AUTHORITY = {
  html: 1,
  blocked: 1, // same page, just fetched through a browser
  pdf: 2,
  'portal-trybe': 3,
  'portal-onejourney': 3,
  'portal-onejourney-api': 3,
};

/** True when a tier reads a real booking system rather than published copy. */
export function isTransactable(tier) {
  return (AUTHORITY[tier] ?? 0) >= 3;
}

/**
 * Per-spa tier configuration.
 *
 * `alternatives` lists tiers known to be reachable for that spa but not in use
 * — the candidates an adequacy check may probe. An empty list means we have no
 * evidence another tier would work, not that one could not exist.
 */
export const TIER_REGISTRY = {
  1: { name: 'Lodore Falls', tier: 'html' },
  2: { name: 'Armathwaite Hall', tier: 'pdf' },
  4: { name: 'Daffodil', tier: 'html' },
  5: {
    name: 'Swan Hotel Spa',
    tier: 'portal-onejourney-api',
    vendor: 'onejourney',
    tenant: 'theswan',
    propertyId: 165,
    // Migrated from html on 2026-08-28. Kept as a reachable alternative
    // because the tenant does server-render, but the API is one 8 KB call
    // against 8 page fetches, and only the API probes bookability.
    alternatives: ['portal-onejourney'],
    migratedFrom: 'html',
    migratedOn: '2026-08-28',
  },
  6: { name: 'Macdonald Old England', tier: 'blocked' },
  7: { name: 'Low Wood Bay', tier: 'html' },
  9: {
    name: 'Lakeside',
    tier: 'portal-onejourney-api',
    vendor: 'onejourney',
    propertyId: 340,
    // Storefront does NOT server-render — an empty "queries":[] slot. The SSR
    // tier is not an option here, however similar the vendor looks.
    alternatives: [],
  },
  10: { name: 'Beech Hill', tier: 'html' },
  12: { name: 'North Lakes', tier: 'portal-trybe', vendor: 'trybe' },
  13: { name: 'Whitewater', tier: 'html' },
  14: { name: 'Another Place', tier: 'html' },
  15: {
    name: 'Appleby',
    tier: 'portal-onejourney',
    vendor: 'onejourney',
    propertyId: 320,
    // The API tier would also serve Appleby and would cut its run from 11
    // pages / 1,233 KB to one small file — but switching means re-verifying
    // all 11 passes, so it stays a deliberate migration, not a silent one.
    alternatives: ['portal-onejourney-api'],
  },
  16: { name: 'Netherwood', tier: 'html' },
  17: { name: 'Grange', tier: 'html' },
  19: { name: 'Underscar', tier: 'portal-trybe', vendor: 'trybe' },
};

/** Registry entry for a spa id, or null when the spa is not registered. */
export function tierFor(spaId) {
  return TIER_REGISTRY[Number(spaId)] ?? null;
}

/**
 * The onejourney JSON API catalogue endpoint for a property.
 * There is NO `/store` prefix on this route family — that belongs only to the
 * site-level routes, which is what makes a guessed path 404.
 */
export function onejourneyCatalogueUrl(propertyId, lang = 'en') {
  return `https://api.onejourney.travel/${propertyId}/spa-packages/${lang}`;
}

/**
 * Recover a onejourney `propertyId` from a storefront page's own payload.
 * This is how Swan's 165 and Lakeside's 340 were found, so an adequacy check
 * can discover a candidate tier for an unregistered spa rather than needing a
 * human to look it up first.
 */
export function extractPropertyId(storefrontHtml) {
  const m = String(storefrontHtml ?? '').match(/"property":\s*\{\s*"id":\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

/** Does this onejourney storefront server-render its catalogue? */
export function serverRendersCatalogue(storefrontHtml) {
  const s = String(storefrontHtml ?? '');
  if (/"queries":\s*\[\s*\]/.test(s)) return false;
  return /"queries":\s*\[\s*\{/.test(s);
}
