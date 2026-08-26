#!/usr/bin/env node
// Evidence trimming + bundling for /refresh-day-passes (PRD §5).
//
// A committed fetch artifact exists so any figure in the PR can be
// re-proved later. Committing whole pages does that but does not scale:
// a full 22-spa run is ~5-6 MB and ~65 files EVERY month, and git keeps
// every version forever.
//
// This script reduces the committed artifact to the spans the gate
// actually reads — every occurrence of every quote, plus enough
// surrounding context that gate 3's poison-word scan sees exactly what
// it would have seen in the full page — and bundles a spa's per-pass
// pages into ONE artifact.
//
// The safety property is enforced here, not asserted: the script runs
// the real gate against the full page(s) AND the trimmed bundle and
// exits 2 unless every verdict is identical. A lossy trim cannot ship.
//
// Usage:
//   node trim-artifact.mjs <checks.json> <trimmed-out> <full-artifact> [<full-artifact>...]
//
// stdout: JSON { segments, fullBytes, trimmedBytes, reductionPct,
//                checked, identical, mismatches }
// Exit 0 verified equivalent · 2 verdicts differ (or a quote is missing
// from every input) · 1 usage/IO error.

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { runCheck, normalize, POISON_CONTEXT_CHARS } from './gate.mjs';

// Raw-character padding kept either side of each quote occurrence.
// Must comfortably exceed POISON_CONTEXT_CHARS (200) AFTER whitespace
// normalization — normalize() collapses runs of whitespace, so raw
// padding shrinks. 10x gives headroom for whitespace-heavy HTML, and
// verifyEquivalence() catches any case where it still is not enough.
export const DEFAULT_PAD = POISON_CONTEXT_CHARS * 10;

// Neutral filler between segments so two windows can never bleed into
// each other's poison-context range. Contains no poison words and no
// characters that survive as text worth quoting.
export const SEGMENT_SEPARATOR = `\n${'='.repeat(POISON_CONTEXT_CHARS * 2)}\n`;

/** Every [start,end) window around every occurrence of `needle` in `haystack`. */
export function collectWindows(haystack, needle, pad = DEFAULT_PAD) {
  const windows = [];
  if (!needle) return windows;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    windows.push([Math.max(0, i - pad), Math.min(haystack.length, i + needle.length + pad)]);
    i = haystack.indexOf(needle, i + 1);
  }
  return windows;
}

/** Merge overlapping/adjacent windows so no span is ever cut in half. */
export function mergeWindows(windows) {
  const sorted = [...windows].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const w of sorted) {
    const last = merged[merged.length - 1];
    if (last && w[0] <= last[1]) last[1] = Math.max(last[1], w[1]);
    else merged.push([...w]);
  }
  return merged;
}

/**
 * Build the trimmed text for one source document given the quotes that
 * must survive in it. Returns null when none of the quotes appear here
 * (this document contributes nothing to the bundle).
 */
export function trimDocument(content, quotes, pad = DEFAULT_PAD) {
  const windows = [];
  for (const q of quotes) windows.push(...collectWindows(content, q, pad));
  if (!windows.length) return null;
  return mergeWindows(windows)
    .map(([a, b]) => content.slice(a, b))
    .join(SEGMENT_SEPARATOR);
}

/**
 * Run every check against both artifacts and compare the verdicts that
 * matter: grounded, the demoting reason/gate, and the poison words found.
 */
export function verifyEquivalence(fullText, trimmedText, checks) {
  const fullNorm = normalize(fullText);
  const trimNorm = normalize(trimmedText);
  const mismatches = [];
  for (const c of checks) {
    const a = runCheck(fullNorm, c);
    const b = runCheck(trimNorm, c);
    if (
      a.grounded !== b.grounded ||
      a.reason !== b.reason ||
      a.gate !== b.gate ||
      String(a.poisonWords) !== String(b.poisonWords)
    ) {
      mismatches.push({
        passId: c.passId,
        full: { grounded: a.grounded, reason: a.reason, gate: a.gate, poisonWords: a.poisonWords },
        trimmed: { grounded: b.grounded, reason: b.reason, gate: b.gate, poisonWords: b.poisonWords },
      });
    }
  }
  return { checked: checks.length, identical: checks.length - mismatches.length, mismatches };
}

function main() {
  const [checksPath, outPath, ...fullPaths] = process.argv.slice(2);
  if (!checksPath || !outPath || !fullPaths.length) {
    console.error(
      'usage: node trim-artifact.mjs <checks.json> <trimmed-out> <full-artifact> [<full-artifact>...]',
    );
    process.exit(1);
  }

  const checks = JSON.parse(readFileSync(checksPath, 'utf8'));
  const quotes = checks.map((c) => c.quote ?? '').filter(Boolean);

  const docs = fullPaths.map((p) => readFileSync(p, 'utf8'));
  const pieces = [];
  for (const doc of docs) {
    const t = trimDocument(doc, quotes);
    if (t !== null) pieces.push(t);
  }

  // A quote present in NO input is a hard error: the trimmed artifact
  // would silently lack evidence the PR is about to cite.
  const fullBundle = docs.join(SEGMENT_SEPARATOR);
  const missing = checks
    .filter((c) => c.quote && !fullBundle.includes(c.quote))
    .map((c) => c.passId);

  const trimmed = pieces.join(SEGMENT_SEPARATOR);
  writeFileSync(outPath, trimmed);

  const verdict = verifyEquivalence(fullBundle, trimmed, checks);
  const fullBytes = fullPaths.reduce((n, p) => n + statSync(p).size, 0);
  const trimmedBytes = Buffer.byteLength(trimmed);

  const report = {
    segments: pieces.length,
    inputs: fullPaths.length,
    fullBytes,
    trimmedBytes,
    reductionPct: fullBytes ? Number((100 - (trimmedBytes / fullBytes) * 100).toFixed(1)) : 0,
    quotesMissingFromSource: missing,
    ...verdict,
  };
  console.log(JSON.stringify(report, null, 2));
  process.exit(verdict.mismatches.length === 0 && missing.length === 0 ? 0 : 2);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
