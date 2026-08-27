#!/usr/bin/env node
// Withdrawal (auto-delete) engine for /refresh-day-passes (PRD §4a, issue 14).
//
// A pass whose source page is gone AND which the spa no longer lists is
// withdrawn, not merely unreadable. From 2026-08-27 the run deletes such
// entries automatically — a deliberate reversal of the original
// never-auto-delete rule (PRD §8), taken because month after month of
// re-flagging the same dead package is noise a human has to clear by hand.
//
// Deletion is irreversible in the data (recoverable only from git), so it
// is deliberately hard to trigger. FIVE conditions must ALL hold; any one
// missing leaves the pass exactly where it is today — a ⚠️ flag:
//
//   1. pageGone      - the pass's own source page returned 404/410. A fetch
//                      that merely failed (timeout, 403, 5xx) is NOT this:
//                      a bot-block or an outage is not a withdrawal.
//   2. absentFromIndex - the package is absent from the spa's own offers /
//                      day-pass listing page, which was fetched THIS run.
//                      Two independent signals, not one.
//   3. noSuccessor   - classifySuccessors offered no strict-1:1 successor.
//                      A renamed package is a rename, never a deletion.
//   4. priorSighting - a previous run recorded the same pass as a
//                      withdrawal candidate. Nothing is deleted the first
//                      time it is seen missing, so a site migration that
//                      404s every URL for a week deletes nothing.
//   5. noReferences  - nothing in the repo still points at the pass id.
//
// On (5): `getDayPassPrice` returns null for an unknown id and every known
// call site falls back to a HARDCODED literal, e.g.
//   {itsAllGoodWeekdayPrice || '£170'}
// So deleting a referenced pass does not break the build or fail a test —
// it silently freezes a dead package's price into the page and keeps
// advertising it. That is precisely the class of stale claim the gates
// exist to prevent, so a referenced pass is NOT deleted: it demotes to a
// ⚠️ flag listing the references to clean up first. Clean them, and the
// next run deletes it with no further prompting.
//
// Usage (CLI): node withdraw.mjs <repo-root> <spa-id> <pass-id> <pass-name>
// stdout: JSON { plan, updatedFiles, references }
// Exit 0 applied · 3 blocked (see plan.reason) · 1 usage/IO error.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

/** Reasons a candidate is NOT deleted, in evaluation order. */
export const BLOCK_REASONS = {
  pageGone: 'page-not-gone',
  absentFromIndex: 'still-listed-by-spa',
  noSuccessor: 'successor-suggested',
  priorSighting: 'first-sighting',
  noReferences: 'has-references',
};

/**
 * Decide whether one candidate pass may be deleted. Every condition is a
 * fact established elsewhere (fetch log, offers index, successor engine,
 * prior run ledger, reference scan) — this function only combines them,
 * so it stays deterministic and unit-testable.
 *
 * @returns {{ withdraw: boolean, reason: string, failed: string[] }}
 */
export function classifyWithdrawal(signals) {
  const order = ['pageGone', 'absentFromIndex', 'noSuccessor', 'priorSighting', 'noReferences'];
  const failed = order.filter((k) => signals[k] !== true);
  if (failed.length === 0) return { withdraw: true, reason: 'withdrawn', failed: [] };
  return { withdraw: false, reason: BLOCK_REASONS[failed[0]], failed };
}

/**
 * Every mechanical reference to a pass id in one file: quoted id literals
 * (`dayPassId="…"`, `getDayPassPrice(spa.id, '…')`) and `#<id>` anchors.
 * Mirrors rewriteMechanicalRefs in rename.mjs, but REPORTS instead of
 * rewriting — a deletion has no new id to rewrite to.
 */
export function findIdReferences(content, passId, fileLabel) {
  const escaped = String(passId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(['"])${escaped}\\1|#${escaped}\\b`, 'g');
  const hits = [];
  content.split('\n').forEach((line, i) => {
    if (re.test(line)) hits.push({ file: fileLabel, line: i + 1, context: line.trim() });
    re.lastIndex = 0;
  });
  return hits;
}

/**
 * Index of the `{` opening the object literal that contains `from`, and of
 * its matching `}`. String-aware so an apostrophe or a brace inside a
 * description can't throw the count off.
 */
export function findEnclosingObject(src, from) {
  let start = -1;
  let depth = 0;
  for (let i = from; i >= 0; i--) {
    const c = src[i];
    if (c === '}') depth++;
    else if (c === '{') {
      if (depth === 0) { start = i; break; }
      depth--;
    }
  }
  if (start === -1) return null;

  let quote = null;
  depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return { start, end: i + 1 };
    }
  }
  return null;
}

/**
 * Remove one DayPassOption entry from a spa's day-pass data file, leaving
 * the surrounding array syntactically valid (trailing comma and the blank
 * line the entry occupied are consumed with it).
 */
export function removeEntryFromDataFile(content, passId) {
  const needle = `id: '${passId}'`;
  const at = content.indexOf(needle);
  if (at === -1) return { content, removed: false };
  const span = findEnclosingObject(content, at);
  if (!span) return { content, removed: false };

  let { start, end } = span;
  // Consume a trailing comma + newline, else a preceding one, so the array
  // never ends up with `},\n]` or `}{`.
  const after = content.slice(end);
  const trailing = /^,\s*\n/.exec(after);
  if (trailing) {
    end += trailing[0].length;
  } else {
    const before = content.slice(0, start);
    const preceding = /,\s*\n\s*$/.exec(before);
    if (preceding) start -= preceding[0].length;
  }
  // Drop the indentation left on the entry's own line.
  const lineStart = content.lastIndexOf('\n', start) + 1;
  if (content.slice(lineStart, start).trim() === '') start = lineStart;

  return { content: content.slice(0, start) + content.slice(end), removed: true };
}

/**
 * Apply a withdrawal across in-memory files: drop the entry from its data
 * file, and report (never rewrite) references and prose mentions elsewhere.
 * By the time this runs, classifyWithdrawal has already established there
 * are no references — the scan here is the belt-and-braces second look, and
 * a non-empty result means the caller skipped the gate.
 *
 * @param files [{ path, content, isDataFile? }]
 */
export function applyWithdrawalToFiles(files, { passId, passName }) {
  const updatedFiles = [];
  const references = [];

  for (const file of files) {
    if (file.isDataFile) {
      const { content, removed } = removeEntryFromDataFile(file.content, passId);
      if (removed) updatedFiles.push({ path: file.path, content, removedEntry: passId });
      continue;
    }
    references.push(...findIdReferences(file.content, passId, file.path));
  }

  return { updatedFiles, references, passName };
}

// ---------------------------------------------------------------------------
// CLI: wires the pure functions above to real repo files.

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
  const [repoRoot, spaId, passId, passName] = process.argv.slice(2);
  if (!repoRoot || !spaId || !passId || !passName) {
    console.error('usage: node withdraw.mjs <repo-root> <spa-id> <pass-id> <pass-name>');
    process.exit(1);
  }

  const dataPath = join(repoRoot, 'src/data/day-passes', `spa-${spaId}-day-passes.ts`);
  const candidates = [
    ...walk(join(repoRoot, 'content/blog'), '.mdx'),
    ...walk(join(repoRoot, 'src/data/faqs'), '.tsx'),
    ...walk(join(repoRoot, 'src/data/location-faqs'), '.tsx'),
  ];

  const files = [
    { path: relative(repoRoot, dataPath), content: readFileSync(dataPath, 'utf8'), isDataFile: true },
    ...candidates.map((p) => ({ path: relative(repoRoot, p), content: readFileSync(p, 'utf8') })),
  ];

  const { updatedFiles, references } = applyWithdrawalToFiles(files, { passId, passName });

  // Condition 5 is enforced here too: never write while references live.
  if (references.length) {
    console.log(JSON.stringify(
      { plan: { applied: false, reason: 'has-references' }, updatedFiles: [], references },
      null, 2,
    ));
    process.exit(3);
  }
  if (!updatedFiles.length) {
    console.log(JSON.stringify(
      { plan: { applied: false, reason: 'entry-not-found' }, updatedFiles: [], references },
      null, 2,
    ));
    process.exit(3);
  }

  for (const f of updatedFiles) writeFileSync(join(repoRoot, f.path), f.content);
  console.log(JSON.stringify(
    { plan: { applied: true, reason: 'withdrawn', passId, passName }, updatedFiles: updatedFiles.map((f) => f.path), references },
    null, 2,
  ));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
