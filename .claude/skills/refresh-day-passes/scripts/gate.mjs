#!/usr/bin/env node
// Deterministic verification gates for /refresh-day-passes (PRD §5).
// Implemented: gate 1 (exact-quote grounding + arithmetic cases),
// gate 2 (contiguity), gate 3 (poison words), gate 4 (PDF vintage,
// pdf-tier only), gate 5 (plausibility), gate 6 (bookability, portal
// tiers, opt-in per check).
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
//   "arithmetic": "none"|"pence"|"gbp-integer"|"per-couple"?,  // default "none"
//   "quotedFigure": number?, // figure literally in the quote:
//                           //   pence       -> integer pence (figureGBP*100)
//                           //   gbp-integer -> the same whole-pound integer
//                           //   per-couple  -> per-person GBP (figureGBP/2)
//   "pdfVintage": {          // pdf tier only; omitted -> gate 4 is a no-op
//     "documentYear":  number,  // year the evidence points to
//     "evidenceType":  "filename"|"cover-date"|"valid-until",
//     "evidence":      string,  // filename type: the PDF source URL
//                                // (checked against the URL string, not
//                                // the text-layer artifact); cover-date /
//                                // valid-until: a verbatim quote, checked
//                                // against the artifact like any quote
//     "runYear":       number?  // defaults to the current calendar year
//   }?,
//   "bookability": {         // portal tiers; omitted -> gate 6 is a no-op
//     "itemId":        number|string, // booking-item id, must appear in evidence
//     "daysProbed":    number,  // days actually checked (>= 1)
//     "daysWithSlots": number,  // of those, how many had >= 1 timeslot
//     "evidence":      string   // verbatim span of the artifact's
//                                // `availabilityProbe` block carrying both
//                                // the itemId and the counts
//   }?
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
// Raised 40 -> 75 on 2026-08-28. A booking item can be REPURPOSED rather than
// repriced (Swan item 14258 went from a £35 Mon-Thu pass to a £59 Friday one,
// +68.6%), and gate 5 cannot tell a repriced pass from a replaced one. 40%
// re-flagged such passes every run with no way to ever resolve them, since the
// move is measured against a storedGBP that never changes while flagged.
// This is a deliberately looser net: gates 1-3 (grounding, contiguity, poison)
// remain the real defence against a wrong figure. See PRD §5 rule 5.
export const MAX_MOVE_PCT = 75;
// Derived so the reason can never drift from the constant it reports.
export const MOVE_EXCEEDS_REASON = `move-exceeds-${MAX_MOVE_PCT}pct`;
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
  if (mode === 'gbp-integer') {
    // try.be JSON-LD quotes whole pounds as a bare integer with no currency
    // symbol ("lowPrice":68), so `none` (which requires a literal £) and
    // `pence` (which requires figure*100) both reject it. The conversion is
    // the identity — the gate's job here is to prove the integer really is
    // in the span, and that we are not silently reading a pence figure as
    // pounds. A non-integer figure cannot have been read from this shape.
    if (!Number.isInteger(figure)) {
      return { ok: false, mode, reason: 'arithmetic-mismatch' };
    }
    if (check.quotedFigure !== undefined && check.quotedFigure !== figure) {
      return { ok: false, mode, reason: 'arithmetic-mismatch' };
    }
    return { ok: true, mode, kind: 'bare', quotedFigure: figure };
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
// or a room number). Pence- and gbp-integer-mode figures are raw JSON
// integers, so they are matched as standalone numbers instead — safe
// there because the span is a JSON fragment, not prose.
export function figureInQuote(quoteNorm, figure, kind = 'gbp') {
  if (kind === 'pence' || kind === 'bare') {
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

// --- gate 4: PDF vintage (PRD §5 gate 4, pdf tier only) ----------------
// Runs only when a check carries `pdfVintage` — every pdf-tier check
// must set it; other tiers omit it and gate 4 is a no-op for them.
// The extractor states document-year evidence (filename/URL year, a
// cover-page date, or a "valid until" line); this gate proves it the
// same deterministic way as every other gate rather than trusting the
// model's say-so:
//
//  - "filename": evidence is the PDF's source URL (recorded in the
//    fetch log, not the text layer — URLs aren't part of the extracted
//    artifact text) and must literally contain documentYear.
//  - "cover-date" / "valid-until": evidence is a verbatim quote that
//    must grep in the artifact (same grounding as gate 1) AND literally
//    contain documentYear.
//
// documentYear older than the run's year demotes with `pdf-vintage-stale`.
// A single stale document means every pass sourced from it is stale —
// the SKILL treats this as the WHOLE spa demoted to a fetch failure
// (brochure fetched fine; it's just evidence of an out-of-date one),
// never a per-pass flag.
export function pdfVintageCheck(vintage, artifactNorm) {
  if (vintage === undefined || vintage === null) return { ok: true }; // not a pdf-tier check
  const { documentYear, evidenceType, evidence, runYear } = vintage;
  if (typeof documentYear !== 'number' || !Number.isFinite(documentYear)) {
    return { ok: false, reason: 'pdf-vintage-year-missing' };
  }
  if (!['filename', 'cover-date', 'valid-until'].includes(evidenceType)) {
    return { ok: false, reason: 'pdf-vintage-evidence-type-invalid' };
  }
  const evidenceNorm = normalize(String(evidence ?? ''));
  if (!evidenceNorm) return { ok: false, reason: 'pdf-vintage-evidence-missing' };
  if (!evidenceNorm.includes(String(documentYear))) {
    return { ok: false, reason: 'pdf-vintage-year-not-in-evidence' };
  }
  if (evidenceType !== 'filename' && !artifactNorm.includes(evidenceNorm)) {
    return { ok: false, reason: 'pdf-vintage-evidence-not-found-in-artifact' };
  }
  const currentYear = typeof runYear === 'number' ? runYear : new Date().getFullYear();
  if (documentYear < currentYear) {
    return { ok: false, reason: 'pdf-vintage-stale' };
  }
  return { ok: true };
}

// --- gate 6: bookability (portal tiers; opt-in per check) --------------
// Runs only when a check carries `bookability` — omitted, it's a no-op.
//
// A pass can be listed, priced, and have a working booking page while
// being bookable on no date at all. Lakeside's "Fizz and Float" was
// exactly that: £39, a live page, and zero released timeslots on every
// date probed. Gates 1-5 all pass such a pass happily — the price really
// is on the page — so without this gate the only thing standing between
// us and republishing a phantom price forever is a human clicking
// through. That is the manual check this gate removes.
//
// `evidence` is a verbatim span of the artifact's `availabilityProbe`
// block (written by fetch-onejourney.mjs from real timeslot responses),
// proven by grep exactly like gate 1's quote — the counts are not taken
// on trust. It must also contain the itemId, so the numbers cannot be
// borrowed from a different pass's entry.
//
// `daysWithSlots: 0` demotes with `no-availability`. This is a per-pass
// ⚠️ flag: data untouched, no `lastVerified` bump, and NEVER an automatic
// deletion — removing a pass stays a human decision (PRD §1).
export function bookabilityCheck(bookability, artifactNorm) {
  if (bookability === undefined || bookability === null) return { ok: true };
  const { itemId, daysProbed, daysWithSlots, evidence } = bookability;
  if (!Number.isInteger(daysProbed) || daysProbed < 1) {
    return { ok: false, reason: 'bookability-days-probed-missing' };
  }
  if (!Number.isInteger(daysWithSlots) || daysWithSlots < 0) {
    return { ok: false, reason: 'bookability-days-with-slots-missing' };
  }
  if (daysWithSlots > daysProbed) {
    return { ok: false, reason: 'bookability-counts-inconsistent' };
  }
  const evidenceNorm = normalize(String(evidence ?? ''));
  if (!evidenceNorm) return { ok: false, reason: 'bookability-evidence-missing' };
  if (!artifactNorm.includes(evidenceNorm)) {
    return { ok: false, reason: 'bookability-evidence-not-found-in-artifact' };
  }
  // Tie the evidence to this pass, so one item's counts can't stand in
  // for another's.
  if (itemId === undefined || itemId === null || !evidenceNorm.includes(String(itemId))) {
    return { ok: false, reason: 'bookability-item-id-not-in-evidence' };
  }
  if (daysWithSlots === 0) {
    return { ok: false, reason: 'no-availability' };
  }
  return { ok: true };
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
    return { ok: false, reason: MOVE_EXCEEDS_REASON, movePct: pct };
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
  'pdf-vintage-year-missing': 4,
  'pdf-vintage-evidence-type-invalid': 4,
  'pdf-vintage-evidence-missing': 4,
  'pdf-vintage-year-not-in-evidence': 4,
  'pdf-vintage-evidence-not-found-in-artifact': 4,
  'pdf-vintage-stale': 4,
  'price-out-of-bounds': 5,
  [MOVE_EXCEEDS_REASON]: 5,
  'bookability-days-probed-missing': 6,
  'bookability-days-with-slots-missing': 6,
  'bookability-counts-inconsistent': 6,
  'bookability-evidence-missing': 6,
  'bookability-evidence-not-found-in-artifact': 6,
  'bookability-item-id-not-in-evidence': 6,
  'no-availability': 6,
};

export function runCheck(artifactNorm, check) {
  const quoteNorm = normalize(check.quote ?? '');
  const base = { passId: check.passId, quote: check.quote ?? '', figureGBP: check.figureGBP };
  const pct = movePct(check.storedGBP, check.figureGBP);
  if (pct !== null) base.movePct = pct;
  if (check.pdfVintage) base.documentYear = check.pdfVintage.documentYear;
  if (check.bookability) {
    base.daysProbed = check.bookability.daysProbed;
    base.daysWithSlots = check.bookability.daysWithSlots;
  }
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

  // gate 4 - PDF vintage (pdf tier only; no-op when pdfVintage is absent)
  const vintage = pdfVintageCheck(check.pdfVintage, artifactNorm);
  if (!vintage.ok) return demote(vintage.reason);

  // gate 5 - plausibility bounds, flag-never-block
  const plaus = plausibility(check);
  if (!plaus.ok) return demote(plaus.reason);

  // gate 6 - bookability (portal tiers; no-op when bookability is absent)
  const bookable = bookabilityCheck(check.bookability, artifactNorm);
  if (!bookable.ok) return demote(bookable.reason);

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
        gates: [
          '1 grounding+arithmetic',
          '2 contiguity',
          '3 poison words',
          '4 pdf vintage (pdf tier only)',
          '5 plausibility',
          '6 bookability (portal tiers, opt-in)',
        ],
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
