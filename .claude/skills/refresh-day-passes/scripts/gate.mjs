#!/usr/bin/env node
// Deterministic verification gates for /refresh-day-passes (PRD §5).
// Implemented: gate 1 (exact-quote grounding + arithmetic cases),
// gate 2 (contiguity), gate 3 (poison words), gate 5 (plausibility).
// Gate 4 (PDF vintage) belongs to the pdf-tier slice and plugs into
// runCheck() the same way.
//
// No gate consults the model's opinion of itself: every verdict is a
// grep/arithmetic check against the SAVED fetch artifact.
//
// Usage: node gate.mjs <artifact-path> <checks.json>
//
// checks.json: [{
//   "passId":     string,   // existing DayPassOption id
//   "passName":   string,   // pass name / booking-item title (gate 2)
//   "quote":      string,   // verbatim contiguous span from the artifact
//   "figureGBP":  number,   // price entering the PR, in GBP
//   "storedGBP":  number?,  // current stored price (gate 5 % move)
//   "arithmetic": "none"|"pence"|"per-couple"?,   // default "none"
//   "quotedFigure": number? // figure literally in the quote:
//                           //   pence      -> integer pence (figureGBP*100)
//                           //   per-couple -> per-person GBP (figureGBP/2)
// }]
//
// stdout: JSON { artifact, gates, summary, results: [{ passId, grounded,
//   reason, gate, quote, figureGBP, movePct?, poisonWords? }] }
// Exit 0 even when checks fail (gate failure -> flag lane, never a run
// failure). Exit 1 only on usage/IO error.

import { readFileSync } from 'node:fs';

// --- spec constants (PRD §5) ------------------------------------------
export const PRICE_MIN_GBP = 20;
export const PRICE_MAX_GBP = 400;
export const MAX_MOVE_PCT = 40;
export const POISON_CONTEXT_CHARS = 200;
// member/membership/resident/voucher/deposit matched as prefixes so
// plurals and -ship suffixes hit; the leading \b keeps "remember" out.
export const POISON_RE = /\b(?:member|resident|voucher|deposit)|per month/gi;

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
    .replace(/[\s   -​  　﻿]+/g, ' ')
    .trim();
}

// --- gate 1: arithmetic cases (PRD §3 rule 5, §5 gate 1) ---------------
// Resolves what figure the quote must literally contain, and proves the
// GBP figure entering the PR follows from it by arithmetic.
export function resolveArithmetic(check) {
  const mode = check.arithmetic ?? 'none';
  const figure = check.figureGBP;
  if (typeof figure !== 'number' || !Number.isFinite(figure)) {
    return { ok: false, mode, reason: 'figure-not-a-number' };
  }
  if (mode === 'none') {
    return { ok: true, mode, kind: 'gbp', quotedFigure: figure };
  }
  if (mode === 'pence') {
    // Portal tier: source JSON quotes pence integers (14000 -> £140).
    const pence = Math.round(figure * 100);
    if (Math.abs(figure * 100 - pence) > 1e-6) {
      return { ok: false, mode, reason: 'arithmetic-mismatch' };
    }
    if (check.quotedFigure !== undefined && check.quotedFigure !== pence) {
      return { ok: false, mode, reason: 'arithmetic-mismatch' };
    }
    return { ok: true, mode, kind: 'pence', quotedFigure: pence };
  }
  if (mode === 'per-couple') {
    // Source quotes a per-person price; priceGBP stores the group total.
    const perPerson = check.quotedFigure;
    if (typeof perPerson !== 'number' || !Number.isFinite(perPerson)) {
      return { ok: false, mode, reason: 'arithmetic-missing-per-person' };
    }
    if (Math.abs(perPerson * 2 - figure) > 0.005) {
      return { ok: false, mode, reason: 'arithmetic-mismatch' };
    }
    return { ok: true, mode, kind: 'gbp', quotedFigure: perPerson };
  }
  return { ok: false, mode, reason: 'unknown-arithmetic-mode' };
}

// The figure must appear inside the quote as a GBP price: £140, £ 140,
// £140.00. A bare number is NOT accepted (too easy to match a duration
// or a room number). Pence-mode figures are raw JSON integers, so they
// are matched as standalone numbers instead.
export function figureInQuote(quoteNorm, figure, kind = 'gbp') {
  if (kind === 'pence') {
    const re = new RegExp(`(?<![\\d.])${String(figure)}(?![\\d.])`);
    return re.test(quoteNorm);
  }
  const forms = new Set([String(figure)]);
  if (Number.isFinite(figure)) forms.add(figure.toFixed(2));
  const alts = [...forms].map((f) => f.replace(/\./g, '\\.')).join('|');
  return new RegExp(`£\\s?(?:${alts})(?![\\d.])`).test(quoteNorm);
}

// --- gate 2: contiguity ------------------------------------------------
export function stripTags(s) {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// The quote is already proven to be one contiguous span of the artifact
// (gate 1 greps it verbatim); contiguity additionally requires the pass
// name / booking-item title to live in that same span.
export function nameInQuote(quoteNorm, passName) {
  const target = String(passName ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  if (!target) return false;
  return (
    quoteNorm.toLowerCase().includes(target) ||
    stripTags(quoteNorm).toLowerCase().includes(target)
  );
}

// --- gate 3: poison words ---------------------------------------------
export function poisonWordsIn(s) {
  const found = new Set();
  for (const m of s.matchAll(POISON_RE)) found.add(m[0].toLowerCase());
  return [...found];
}

// Span itself plus +/-POISON_CONTEXT_CHARS of artifact context, at every
// occurrence of the span (a span repeated on the page is poisoned if any
// of its occurrences sits next to a poison word).
export function poisonAround(artifactNorm, quoteNorm) {
  const found = new Set(poisonWordsIn(quoteNorm));
  let i = artifactNorm.indexOf(quoteNorm);
  while (i !== -1) {
    const from = Math.max(0, i - POISON_CONTEXT_CHARS);
    const to = Math.min(artifactNorm.length, i + quoteNorm.length + POISON_CONTEXT_CHARS);
    for (const w of poisonWordsIn(artifactNorm.slice(from, to))) found.add(w);
    i = artifactNorm.indexOf(quoteNorm, i + 1);
  }
  return [...found];
}

// --- gate 5: plausibility bounds --------------------------------------
export function movePct(storedGBP, figureGBP) {
  if (typeof storedGBP !== 'number' || !Number.isFinite(storedGBP) || storedGBP === 0) return null;
  return Math.round(((figureGBP - storedGBP) / storedGBP) * 1000) / 10;
}

export function plausibility(check) {
  const pct = movePct(check.storedGBP, check.figureGBP);
  if (check.figureGBP < PRICE_MIN_GBP || check.figureGBP > PRICE_MAX_GBP) {
    return { ok: false, reason: 'price-out-of-bounds', movePct: pct };
  }
  if (pct !== null && Math.abs(pct) > MAX_MOVE_PCT) {
    return { ok: false, reason: 'move-exceeds-40pct', movePct: pct };
  }
  return { ok: true, movePct: pct };
}

const GATE_OF = {
  'empty-quote': 1,
  'quote-not-found-in-artifact': 1,
  'figure-not-in-quote': 1,
  'figure-not-a-number': 1,
  'arithmetic-mismatch': 1,
  'arithmetic-missing-per-person': 1,
  'unknown-arithmetic-mode': 1,
  'missing-pass-name': 2,
  'pass-name-not-in-quote': 2,
  'price-out-of-bounds': 5,
  'move-exceeds-40pct': 5,
};

export function runCheck(artifactNorm, check) {
  const quoteNorm = normalize(check.quote ?? '');
  const base = { passId: check.passId, quote: check.quote ?? '', figureGBP: check.figureGBP };
  const pct = movePct(check.storedGBP, check.figureGBP);
  if (pct !== null) base.movePct = pct;
  const demote = (reason, extra = {}) => ({
    ...base,
    grounded: false,
    reason,
    gate: GATE_OF[reason] ?? (reason.startsWith('poison-word') ? 3 : null),
    ...extra,
  });

  // gate 1 - exact-quote grounding (+ arithmetic cases)
  if (!quoteNorm) return demote('empty-quote');
  if (!artifactNorm.includes(quoteNorm)) return demote('quote-not-found-in-artifact');
  const arith = resolveArithmetic(check);
  if (!arith.ok) return demote(arith.reason);
  if (!figureInQuote(quoteNorm, arith.quotedFigure, arith.kind)) {
    return demote('figure-not-in-quote');
  }

  // gate 2 - contiguity: name + price in the one span
  if (!String(check.passName ?? '').trim()) return demote('missing-pass-name');
  if (!nameInQuote(quoteNorm, check.passName)) return demote('pass-name-not-in-quote');

  // gate 3 - poison words in the span or +/-200 chars of context
  const poison = poisonAround(artifactNorm, quoteNorm);
  if (poison.length) return demote(`poison-word:${poison[0]}`, { poisonWords: poison });

  // gate 4 (PDF vintage) plugs in here with the pdf tier.

  // gate 5 - plausibility bounds, flag-never-block
  const plaus = plausibility(check);
  if (!plaus.ok) return demote(plaus.reason);

  return { ...base, grounded: true, reason: 'grounded', gate: null };
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
  const summary = {
    checked: results.length,
    grounded: results.filter((r) => r.grounded).length,
    flagged: results.filter((r) => !r.grounded).length,
  };
  console.log(
    JSON.stringify(
      {
        artifact: artifactPath,
        gates: ['1 grounding+arithmetic', '2 contiguity', '3 poison words', '5 plausibility'],
        constants: { PRICE_MIN_GBP, PRICE_MAX_GBP, MAX_MOVE_PCT, POISON_CONTEXT_CHARS },
        summary,
        results,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
