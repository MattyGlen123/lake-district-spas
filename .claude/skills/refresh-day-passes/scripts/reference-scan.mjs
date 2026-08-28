#!/usr/bin/env node
// Shared reference scanner for /refresh-day-passes (issue 14).
//
// WHY THIS MODULE EXISTS
// `rename.mjs` and `withdraw.mjs` both need the same question answered — "what
// else in the repo cites this day-pass id?" — and they used to answer it with
// two hand-maintained directory lists that had silently drifted apart:
//
//   rename.mjs    content/blog, src/data/faqs
//   withdraw.mjs  content/blog, src/data/faqs, src/data/location-faqs
//   neither       src/app, src/components
//
// So a rename could leave a live reference dangling in a tree the renamer
// never looked at. That is exactly what happened on the Swan run (2026-08-28):
// renaming `swan-twilight-sessions-weekday` orphaned two references in
// `src/data/location-faqs/newby-bridge-faqs.tsx`, which had to be fixed by hand.
//
// WHY A MISSED REFERENCE IS DANGEROUS RATHER THAN NOISY
// `getDayPassPrice` returns `null` for an unknown id and every call site falls
// back to a hardcoded literal (`{twilightWeekdayPrice || '£35'}`). A dangling
// reference therefore does NOT break the build, fail a test, or leave a visible
// gap — it silently freezes a dead package's price into the page. There is no
// loud failure to catch it, which is precisely why the scan must be exhaustive.
//
// One list, used by both callers. Adding a tree here fixes both at once.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

/**
 * Every tree that may cite a day-pass id, with the extensions worth reading.
 *
 * `.ts` sits alongside `.tsx` deliberately: a plain `.ts` module under
 * `src/app` or `src/data` can hold an id array just as easily as a component
 * can, and reading a few extra files is far cheaper than missing one.
 */
export const REFERENCE_TREES = [
  { dir: 'content/blog', exts: ['.mdx'] },
  { dir: 'src/data/faqs', exts: ['.tsx', '.ts'] },
  { dir: 'src/data/location-faqs', exts: ['.tsx', '.ts'] },
  { dir: 'src/app', exts: ['.tsx', '.ts'] },
  { dir: 'src/components', exts: ['.tsx', '.ts'] },
];

/**
 * Recursively list files under `absDir` whose extension is in `exts`.
 *
 * A missing directory yields [] rather than throwing: the trees above are a
 * repo-shape assumption, and a scan that crashes because one optional folder
 * is absent would push callers back toward their own bespoke lists — the very
 * drift this module exists to prevent.
 */
export function walkTree(absDir, exts) {
  if (!existsSync(absDir)) return [];
  const out = [];
  for (const entry of readdirSync(absDir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(absDir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkTree(full, exts));
    else if (exts.includes(extname(full))) out.push(full);
  }
  return out;
}

/**
 * Read every candidate reference file in the repo.
 *
 * @returns [{ path, absPath, content }] — `path` is repo-relative, which is
 *          what both callers report and write back through.
 */
export function collectReferenceFiles(repoRoot, { trees = REFERENCE_TREES } = {}) {
  const files = [];
  const seen = new Set();
  for (const { dir, exts } of trees) {
    for (const absPath of walkTree(join(repoRoot, dir), exts)) {
      if (seen.has(absPath)) continue;
      seen.add(absPath);
      files.push({
        path: relative(repoRoot, absPath),
        absPath,
        content: readFileSync(absPath, 'utf8'),
      });
    }
  }
  return files;
}

/** Escape a string for literal use inside a RegExp. */
export function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The one definition of "this file cites that id": a quoted string literal
 * (`'id'` / `"id"`) or an anchor fragment (`#id`).
 *
 * Both forms are MECHANICAL — safe to rewrite on a rename and unambiguous to
 * report on a withdrawal. Prose mentions of a package's human NAME are handled
 * separately and are never rewritten.
 */
export function idReferencePattern(passId) {
  const escaped = escapeRe(passId);
  return new RegExp(`(['"])${escaped}\\1|#${escaped}\\b`, 'g');
}

/** Line-by-line hits of `passId` in `content`, labelled with `fileLabel`. */
export function findIdReferences(content, passId, fileLabel) {
  const re = idReferencePattern(passId);
  const hits = [];
  content.split('\n').forEach((line, i) => {
    if (re.test(line)) hits.push({ file: fileLabel, line: i + 1, context: line.trim() });
    re.lastIndex = 0;
  });
  return hits;
}
