#!/usr/bin/env node
// Deterministic verification gate for /refresh-day-passes (PRD §5).
// Gate 1 (exact-quote grounding) is implemented; gates 2-5 plug into
// runCheck() below in later slices.
//
// Usage: node gate.mjs <artifact-path> <checks.json>
//
// checks.json: [{ "passId": string, "quote": string, "figureGBP": number }]
//   quote     - verbatim contiguous span from the fetch artifact
//   figureGBP - the price the quote must ground (stored price for
//               verified-unchanged, proposed price for a change)
//
// stdout: JSON { artifact, results: [{ passId, grounded, reason }] }
// Exit 0 even when checks fail (gate failure -> flag lane, never a run
// failure). Exit 1 only on usage/IO error.

import { readFileSync } from 'node:fs';

// Whitespace/entity normalization ONLY (PRD §5 gate 1). No tag
// stripping, no case folding - the quote must be a real span of the
// artifact.
const NAMED_ENTITIES = {
  amp: '&',
  nbsp: ' ',
  pound: '£',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
};

export function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, name) ? NAMED_ENTITIES[name] : m,
    );
}

export function normalize(s) {
  return decodeEntities(s)
    .replace(/[\s\u00a0\u1680\u2000-\u200b\u202f\u205f\u3000\ufeff]+/g, ' ')
    .trim();
}

// The stored figure must appear inside the quote as a GBP price:
// £140, £ 140, £140.00. A bare number is NOT accepted (too easy to
// match a duration or a room number).
// Later-slice explicit cases (PRD §3/§5): pence conversion (portal
// tier, 14000 -> 140) and per-couple ×2 arithmetic plug in here.
export function figureInQuote(quoteNorm, figureGBP) {
  const n = String(figureGBP).replace(/\./g, '\\.');
  const re = new RegExp(`£\\s?${n}(\\.00)?(?![\\d.])`);
  return re.test(quoteNorm);
}

export function runCheck(artifactNorm, check) {
  const quoteNorm = normalize(check.quote ?? '');
  if (!quoteNorm) {
    return { passId: check.passId, grounded: false, reason: 'empty-quote' };
  }
  if (!artifactNorm.includes(quoteNorm)) {
    return { passId: check.passId, grounded: false, reason: 'quote-not-found-in-artifact' };
  }
  if (!figureInQuote(quoteNorm, check.figureGBP)) {
    return { passId: check.passId, grounded: false, reason: 'figure-not-in-quote' };
  }
  // Later gates plug in here, each demoting to a flag reason:
  //   gate 2 contiguity (name + price in one span)
  //   gate 3 poison words (member|membership|resident|voucher|deposit|per month, ±200 chars)
  //   gate 4 PDF vintage
  //   gate 5 plausibility bounds (>±40% move, outside £20-£400)
  return { passId: check.passId, grounded: true, reason: 'grounded' };
}

function main() {
  const [artifactPath, checksPath] = process.argv.slice(2);
  if (!artifactPath || !checksPath) {
    console.error('usage: node gate.mjs <artifact-path> <checks.json>');
    process.exit(1);
  }
  const artifactNorm = normalize(readFileSync(artifactPath, 'utf8'));
  const checks = JSON.parse(readFileSync(checksPath, 'utf8'));
  const results = checks.map((c) => runCheck(artifactNorm, c));
  console.log(JSON.stringify({ artifact: artifactPath, results }, null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
