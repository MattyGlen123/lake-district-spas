#!/usr/bin/env node
// Rename engine for /refresh-day-passes (PRD §4, issue 05).
//
// On a rename (tier-1 auto-apply from matching.mjs, or a human-approved
// tier-3/successor later): re-slug the id to `<spa-prefix>-<slug-of-new-name>`
// (existing convention), auto-rewrite MECHANICAL references in the same PR
// (`dayPassId="…"` props, function-call id args, `#<id>` anchor fragments) so
// `priced-content.test.ts` stays green, and FLAG — never rewrite — prose
// mentions of the old name (case-insensitive, file:line + context).
//
// Slug collision (re-slug produces an id already in use at that spa) -> flag,
// never invent a disambiguated id.
//
// Everything in this module is pure (string/array in, plain object out) so
// it's unit-testable without touching the filesystem. The CLI at the bottom
// wires it to real repo files for actual runs.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/** URL-friendly slug, matching the existing id convention (see priced-content.ts getTreatmentId). */
export function slugify(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Derive the `<spa-prefix>` shared by a spa's day-pass ids, given the pass
 * being renamed. Ids follow `<spa-prefix>-<slug-of-name>` — so the most
 * reliable source is the id/name pair actually being renamed: strip the old
 * name's slug off the end of the old id. Falls back to the longest common
 * dash-token prefix among sibling ids (for a drifted id that doesn't cleanly
 * end with its own name's slug). Returns null if neither works.
 */
export function deriveSpaPrefix(existingId, existingName, siblingIds = []) {
  const oldSlug = slugify(existingName);
  if (oldSlug && existingId === oldSlug) return '';
  if (oldSlug && existingId.endsWith(`-${oldSlug}`)) {
    return existingId.slice(0, existingId.length - oldSlug.length - 1);
  }

  const others = siblingIds.filter((id) => id !== existingId);
  if (others.length) {
    const tokenLists = others.map((id) => id.split('-'));
    const minLen = Math.min(...tokenLists.map((t) => t.length));
    const common = [];
    for (let i = 0; i < minLen; i++) {
      const tok = tokenLists[0][i];
      if (tokenLists.every((t) => t[i] === tok)) common.push(tok);
      else break;
    }
    if (common.length) return common.join('-');
  }
  return null;
}

/** Re-slug an id for a rename. `ok: false` when the spa-prefix can't be derived. */
export function reslug(existingId, existingName, newName, siblingIds = []) {
  const prefix = deriveSpaPrefix(existingId, existingName, siblingIds);
  if (prefix === null) return { ok: false, reason: 'cannot-derive-prefix' };
  const newSlug = slugify(newName);
  const newId = prefix ? `${prefix}-${newSlug}` : newSlug;
  return { ok: true, newId, prefix };
}

/** True when `newId` collides with another id already in use at the same spa. */
export function checkSlugCollision(newId, allIdsForSpa, existingId) {
  return allIdsForSpa.some((id) => id !== existingId && id === newId);
}

/**
 * Full rename plan: re-slug + collision check. Never invents a
 * disambiguated id on collision — that case is `applied: false`.
 */
export function planRename(existingId, existingName, newName, siblingIds = []) {
  const r = reslug(existingId, existingName, newName, siblingIds);
  if (!r.ok) return { applied: false, reason: r.reason };
  if (r.newId === existingId) return { applied: false, reason: 'no-change', newId: r.newId };
  if (checkSlugCollision(r.newId, siblingIds, existingId)) {
    return { applied: false, reason: 'slug-collision', newId: r.newId };
  }
  return { applied: true, newId: r.newId };
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rewrite MECHANICAL references to a day-pass id within one file's content:
 * quoted id literals (`dayPassId="old-id"`, `getDayPassPrice(spa.id, 'old-id')`,
 * the data file's own `id: 'old-id'` field) and markdown anchor fragments
 * (`#old-id`). Returns the new content plus how many rewrites were made.
 * Does NOT touch prose — see findProseMentions.
 */
export function rewriteMechanicalRefs(content, oldId, newId) {
  let count = 0;
  const escapedOld = escapeRe(oldId);

  const quoted = new RegExp(`(['"])${escapedOld}\\1`, 'g');
  let next = content.replace(quoted, (_m, q) => {
    count++;
    return `${q}${newId}${q}`;
  });

  const anchor = new RegExp(`#${escapedOld}\\b`, 'g');
  next = next.replace(anchor, () => {
    count++;
    return `#${newId}`;
  });

  return { content: next, count };
}

/**
 * Find case-insensitive prose mentions of the OLD PACKAGE NAME (not the id)
 * in a file's content — flagged, never rewritten. One hit per occurrence,
 * with file:line + trimmed line context.
 */
export function findProseMentions(content, oldName, fileLabel) {
  const needle = String(oldName ?? '').trim().toLowerCase();
  if (!needle) return [];
  const hits = [];
  content.split('\n').forEach((line, i) => {
    const lower = line.toLowerCase();
    let idx = lower.indexOf(needle);
    while (idx !== -1) {
      hits.push({ file: fileLabel, line: i + 1, context: line.trim() });
      idx = lower.indexOf(needle, idx + needle.length);
    }
  });
  return hits;
}

/**
 * Apply a rename across a set of in-memory files (content/blog MDX,
 * src/data/faqs FAQ generators, and the owning day-pass data file):
 * rewrite mechanical refs everywhere, update the data file's `id` and
 * `packageName` fields, and flag (don't rewrite) prose mentions of the old
 * name in every OTHER file.
 *
 * @param files [{ path, content, isDataFile? }] — isDataFile marks the one
 *   `src/data/day-passes/spa-<id>-day-passes.ts` file owning this pass;
 *   its packageName field is updated in addition to mechanical id refs.
 */
export function applyRenameToFiles(files, { oldId, newId, oldName, newName }) {
  const updatedFiles = [];
  const proseFlags = [];

  for (const file of files) {
    let { content } = file;
    let totalRewrites = 0;

    const { content: mechContent, count } = rewriteMechanicalRefs(content, oldId, newId);
    content = mechContent;
    totalRewrites += count;

    if (file.isDataFile) {
      const packageNameRe = new RegExp(`(packageName:\\s*)(['"])${escapeRe(oldName)}\\2`, 'g');
      const before = content;
      content = content.replace(packageNameRe, (_m, prefix, q) => `${prefix}${q}${newName}${q}`);
      if (content !== before) totalRewrites += 1;
    } else {
      // Prose mentions are flagged, never rewritten — scan every non-data file.
      proseFlags.push(...findProseMentions(content, oldName, file.path));
    }

    if (content !== file.content) {
      updatedFiles.push({ path: file.path, content, rewrites: totalRewrites });
    }
  }

  return { updatedFiles, proseFlags };
}

// ---------------------------------------------------------------------------
// CLI: wires the pure functions above to real repo files for an actual run.
// Not exercised by unit tests (those call the pure functions directly) —
// kept thin on purpose.

function walk(dir, matchExt) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, matchExt));
    else if (extname(full) === matchExt) out.push(full);
  }
  return out;
}

function main() {
  const [repoRoot, spaId, oldId, newId, oldName, newName] = process.argv.slice(2);
  if (!repoRoot || !spaId || !oldId || !newId || !oldName || !newName) {
    console.error(
      'usage: node rename.mjs <repo-root> <spa-id> <old-id> <new-id> <old-name> <new-name>',
    );
    process.exit(1);
  }

  const dataFilePath = join(repoRoot, 'src/data/day-passes', `spa-${spaId}-day-passes.ts`);
  const blogFiles = walk(join(repoRoot, 'content/blog'), '.mdx');
  const faqFiles = walk(join(repoRoot, 'src/data/faqs'), '.tsx');

  const files = [
    { path: dataFilePath, content: readFileSync(dataFilePath, 'utf8'), isDataFile: true },
    ...blogFiles.map((p) => ({ path: p, content: readFileSync(p, 'utf8') })),
    ...faqFiles.map((p) => ({ path: p, content: readFileSync(p, 'utf8') })),
  ];

  const { updatedFiles, proseFlags } = applyRenameToFiles(files, { oldId, newId, oldName, newName });
  for (const f of updatedFiles) writeFileSync(f.path, f.content);

  console.log(
    JSON.stringify(
      {
        updatedFiles: updatedFiles.map((f) => ({ path: f.path, rewrites: f.rewrites })),
        proseFlags,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
