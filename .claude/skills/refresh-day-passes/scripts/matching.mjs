#!/usr/bin/env node
// Matching cascade for /refresh-day-passes (PRD §4, issue 05).
//
// Matches each fetched pass to an existing DayPassOption via three tiers:
//   1. booking-portal item id (stable path segment of bookingUrl) — auto-applies,
//      including a rename when the name differs.
//   2. exact normalized name — auto-applies.
//   3. structural similarity (price/duration/inclusions) — suggestion only,
//      "possible rename: X -> Y", never applied automatically.
//
// An existing pass matched by nothing -> missing-from-source flag (caller's job).
// A fetched pass matching nothing -> info note only (caller's job).
//
// Usage (CLI, for ad-hoc inspection): node matching.mjs <existing.json> <fetched.json>
//   existing.json: DayPassOption[] (id, packageName, priceGBP, spaDuration, included, bookingUrl)
//   fetched.json:  [{ name, priceGBP, spaDuration, included, bookingUrl }]
// stdout: JSON { matches, tier3Suggestions, missingFlags, unmatchedFetched }

import { readFileSync } from 'node:fs';

// Structural-similarity threshold (PRD §4 tier 3): scores at or above this
// render as a suggestion; below, the existing pass is a plain missing flag.
export const TIER3_THRESHOLD = 0.6;

/**
 * The stable path segment of a booking-portal URL (try.be / onejourney item
 * id). Query strings and fragments are stripped; trailing slashes ignored.
 */
export function extractBookingItemId(url) {
  if (!url) return null;
  const cleaned = String(url).split('?')[0].split('#')[0].replace(/\/+$/, '');
  const segments = cleaned.split('/').filter(Boolean);
  return segments.length ? segments[segments.length - 1] : null;
}

/** Lowercase, punctuation-collapsed name for exact-match comparison (tier 2). */
export function normalizeName(name) {
  return String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function priceSimilarity(a, b) {
  if (a == null || b == null) return 0;
  if (a === b) return 1;
  const diff = Math.abs(a - b) / Math.max(a, b);
  return Math.max(0, 1 - diff * 2);
}

function durationSimilarity(a, b) {
  if (a == null || b == null) return 0.5; // unknown on either side: neutral, don't punish
  return a === b ? 1 : 0;
}

function inclusionsSimilarity(a = [], b = []) {
  const setA = new Set(a.map((s) => String(s).toLowerCase().trim()));
  const setB = new Set(b.map((s) => String(s).toLowerCase().trim()));
  if (setA.size === 0 && setB.size === 0) return 0.5; // neither side has data: neutral
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0.5 : intersection / union;
}

/** Weighted price/duration/inclusions similarity, 0..1 (PRD §4 tier 3). */
export function structuralSimilarity(existing, fetched) {
  const price = priceSimilarity(existing.priceGBP, fetched.priceGBP);
  const duration = durationSimilarity(existing.spaDuration, fetched.spaDuration);
  const inclusions = inclusionsSimilarity(existing.included, fetched.included);
  return price * 0.5 + duration * 0.2 + inclusions * 0.3;
}

/**
 * Run the full three-tier matching cascade for one spa.
 *
 * @param existingPasses DayPassOption[] currently in src/data/day-passes/spa-<id>-day-passes.ts
 * @param fetchedPasses  [{ name, priceGBP, spaDuration?, included?, bookingUrl? }] extracted from the artifact
 */
export function matchPasses(existingPasses, fetchedPasses) {
  const usedExistingIds = new Set();
  const usedFetchedIdx = new Set();
  const matches = [];

  // Tier 1: booking-portal item id (auto-applies; auto-applies rename too).
  for (const existing of existingPasses) {
    const existingItemId = extractBookingItemId(existing.bookingUrl);
    if (!existingItemId) continue;
    const idx = fetchedPasses.findIndex(
      (f, i) => !usedFetchedIdx.has(i) && extractBookingItemId(f.bookingUrl) === existingItemId,
    );
    if (idx === -1) continue;
    const fetched = fetchedPasses[idx];
    usedExistingIds.add(existing.id);
    usedFetchedIdx.add(idx);
    const renamed = normalizeName(existing.packageName) !== normalizeName(fetched.name);
    matches.push({
      tier: 1,
      existingId: existing.id,
      fetchedName: fetched.name,
      rename: renamed ? { from: existing.packageName, to: fetched.name } : null,
    });
  }

  // Tier 2: exact normalized name (auto-applies; never a rename by definition).
  for (const existing of existingPasses) {
    if (usedExistingIds.has(existing.id)) continue;
    const idx = fetchedPasses.findIndex(
      (f, i) => !usedFetchedIdx.has(i) && normalizeName(f.name) === normalizeName(existing.packageName),
    );
    if (idx === -1) continue;
    usedExistingIds.add(existing.id);
    usedFetchedIdx.add(idx);
    matches.push({ tier: 2, existingId: existing.id, fetchedName: fetchedPasses[idx].name, rename: null });
  }

  // Tier 3: structural similarity — suggestion only, never applied here.
  const tier3Suggestions = [];
  for (const existing of existingPasses) {
    if (usedExistingIds.has(existing.id)) continue;
    let best = null;
    fetchedPasses.forEach((fetched, i) => {
      if (usedFetchedIdx.has(i)) return;
      const score = structuralSimilarity(existing, fetched);
      if (score >= TIER3_THRESHOLD && (!best || score > best.score)) {
        best = { idx: i, fetched, score };
      }
    });
    if (best) {
      usedFetchedIdx.add(best.idx);
      usedExistingIds.add(existing.id);
      tier3Suggestions.push({
        existingId: existing.id,
        existingName: existing.packageName,
        fetchedName: best.fetched.name,
        score: Number(best.score.toFixed(2)),
      });
    }
  }

  // Existing entry matched by nothing -> missing-from-source flag (data untouched).
  const missingFlags = existingPasses.filter((e) => !usedExistingIds.has(e.id)).map((e) => e.id);

  // Fetched pass matching nothing -> info note only (discovery stays out of scope).
  const unmatchedFetched = fetchedPasses.filter((_, i) => !usedFetchedIdx.has(i)).map((f) => f.name);

  return { matches, tier3Suggestions, missingFlags, unmatchedFetched };
}

function main() {
  const [existingPath, fetchedPath] = process.argv.slice(2);
  if (!existingPath || !fetchedPath) {
    console.error('usage: node matching.mjs <existing.json> <fetched.json>');
    process.exit(1);
  }
  const existingPasses = JSON.parse(readFileSync(existingPath, 'utf8'));
  const fetchedPasses = JSON.parse(readFileSync(fetchedPath, 'utf8'));
  console.log(JSON.stringify(matchPasses(existingPasses, fetchedPasses), null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
