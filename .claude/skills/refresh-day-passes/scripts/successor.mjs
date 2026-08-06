#!/usr/bin/env node
// Successor suggestions + `--accept-successor` for /refresh-day-passes (PRD §4, issue 06).
//
// Layers on top of matching.mjs's per-spa matchPasses() output. PRD §4:
// "seasonal replacement = rename-plus (strict 1:1): exactly one vanished
// existing pass structurally matching one new pass -> tier-3 'possible
// successor: X -> Y' with match evidence". Everything else left in the
// vanished/unmatched pool for a spa (multi-candidate ambiguity, no-predecessor
// additions, apparent merges) stays a plain ⚠️ missing-flag / ℹ️ note --
// discovery stays out of scope, so classifySuccessors never guesses a
// pairing beyond the strict 1:1 case, even when matchPasses's greedy tier-3
// pass happened to pick a "winner".
//
// Accepting a suggestion (`--accept-successor <existing-id>`) runs it through
// the SAME rename engine as a tier-1 auto-rename -- applySuccessor composes
// rename.mjs's planRename + applyRenameToFiles -- so nothing is ever
// added/renamed without the flag->accept round-trip.

import { readFileSync } from 'node:fs';
import { TIER3_THRESHOLD } from './matching.mjs';
import { planRename, applyRenameToFiles } from './rename.mjs';

function inclusionsOverlap(a = [], b = []) {
  const setA = new Set(a.map((s) => String(s).toLowerCase().trim()));
  const setB = new Set(b.map((s) => String(s).toLowerCase().trim()));
  const intersection = [...setA].filter((x) => setB.has(x));
  const unionSize = new Set([...setA, ...setB]).size;
  return { intersection, unionSize };
}

/**
 * Human-readable match evidence for a successor suggestion: price, shape
 * (duration + inclusions overlap), availability (daysAvailable, when both
 * sides have it), and positional replacement (same index in their
 * respective lists) -- the evidence categories named in PRD §4.
 */
export function buildSuccessorEvidence(existing, fetched, score, existingIndex, fetchedIndex) {
  const lines = [];

  lines.push(
    existing.priceGBP === fetched.priceGBP
      ? `price: £${existing.priceGBP} (unchanged)`
      : `price: £${existing.priceGBP} -> £${fetched.priceGBP}`,
  );

  if (existing.spaDuration != null && fetched.spaDuration != null) {
    lines.push(
      existing.spaDuration === fetched.spaDuration
        ? `duration: ${existing.spaDuration}h (unchanged)`
        : `duration: ${existing.spaDuration}h -> ${fetched.spaDuration}h`,
    );
  }

  const { intersection, unionSize } = inclusionsOverlap(existing.included, fetched.included);
  if (unionSize > 0) {
    const shared = intersection.length ? ` (${intersection.join(', ')})` : '';
    lines.push(`shape: ${intersection.length}/${unionSize} inclusions shared${shared}`);
  }

  if (existing.daysAvailable && fetched.daysAvailable) {
    lines.push(
      existing.daysAvailable === fetched.daysAvailable
        ? `availability: ${existing.daysAvailable} (unchanged)`
        : `availability: ${existing.daysAvailable} -> ${fetched.daysAvailable}`,
    );
  }

  if (existingIndex != null && existingIndex !== -1 && existingIndex === fetchedIndex) {
    lines.push(`positional: both occupy list position ${existingIndex + 1}`);
  }

  lines.push(`structural score: ${score} (threshold ${TIER3_THRESHOLD})`);
  return lines;
}

/**
 * Classify one spa's matchPasses() result under the strict 1:1 successor
 * rule (PRD §4). Needs the raw existing/fetched pass arrays -- not just the
 * id/name summary in tier3Suggestions -- to build match evidence.
 *
 * A successor requires the WHOLE spa's post-tier-1/2 leftover pool to be
 * exactly one vanished existing pass and one unmatched fetched pass (a
 * tier-3 hit already consumed one of each into tier3Suggestions, so the
 * pool size is missingFlags.length + tier3Suggestions.length on each side).
 * Any other shape -- two+ vanished passes, two+ unmatched passes, a
 * no-predecessor addition, an apparent merge -- demotes any tier3Suggestions
 * back to plain flags/notes rather than guessing a pairing.
 *
 * @returns {
 *   successors: [{ existingId, existingName, fetchedName, score, evidence: string[] }],
 *   missingFlags: string[],      // plain ⚠️ flags (includes demoted candidates)
 *   unmatchedFetched: string[],  // plain ℹ️ notes (includes demoted candidates)
 * }
 */
export function classifySuccessors(existingPasses, fetchedPasses, matchResult) {
  const { tier3Suggestions, missingFlags, unmatchedFetched } = matchResult;

  const vanishedTotal = missingFlags.length + tier3Suggestions.length;
  const unmatchedTotal = unmatchedFetched.length + tier3Suggestions.length;
  const strict1to1 = vanishedTotal === 1 && unmatchedTotal === 1;

  if (strict1to1 && tier3Suggestions.length === 1) {
    const suggestion = tier3Suggestions[0];
    const existingIndex = existingPasses.findIndex((e) => e.id === suggestion.existingId);
    const fetchedIndex = fetchedPasses.findIndex((f) => f.name === suggestion.fetchedName);
    const existing = existingIndex === -1 ? null : existingPasses[existingIndex];
    const fetched = fetchedIndex === -1 ? null : fetchedPasses[fetchedIndex];
    const evidence =
      existing && fetched
        ? buildSuccessorEvidence(existing, fetched, suggestion.score, existingIndex, fetchedIndex)
        : [`structural score: ${suggestion.score} (threshold ${TIER3_THRESHOLD})`];

    return {
      successors: [{ ...suggestion, evidence }],
      missingFlags: [],
      unmatchedFetched: [],
    };
  }

  // Not strict 1:1 (or the sole pair never cleared the similarity bar) --
  // demote any tier3Suggestions this spa produced back to plain flags/notes
  // instead of framing them as a successor. Covers multi-candidate
  // ambiguity, no-predecessor additions, and apparent merges (PRD §4).
  return {
    successors: [],
    missingFlags: [...missingFlags, ...tier3Suggestions.map((s) => s.existingId)],
    unmatchedFetched: [...unmatchedFetched, ...tier3Suggestions.map((s) => s.fetchedName)],
  };
}

/**
 * Apply an accepted successor suggestion (`--accept-successor <existing-id>`)
 * through the SAME rename engine as a tier-1 auto-rename: re-slug the id,
 * rewrite mechanical refs, flag (never rewrite) prose. `successor` is one
 * entry from classifySuccessors()'s `successors` array (or an equivalent
 * `{ existingId, existingName, fetchedName }` re-derived from evidence.md /
 * the PR on the accepting re-run).
 */
export function applySuccessor(successor, siblingIds, files) {
  const plan = planRename(successor.existingId, successor.existingName, successor.fetchedName, siblingIds);
  if (!plan.applied) {
    return { plan, updatedFiles: [], proseFlags: [] };
  }
  const { updatedFiles, proseFlags } = applyRenameToFiles(files, {
    oldId: successor.existingId,
    newId: plan.newId,
    oldName: successor.existingName,
    newName: successor.fetchedName,
  });
  return { plan, updatedFiles, proseFlags };
}

// ---------------------------------------------------------------------------
// CLI: ad-hoc inspection, same pattern as matching.mjs/rename.mjs --
// classifies a spa's existing/fetched/matchResult JSON into successors vs
// flags. The skill procedure's `--accept-successor` step wires
// classifySuccessors + applySuccessor directly against real repo files
// rather than going through this CLI.

function main() {
  const [existingPath, fetchedPath, matchResultPath] = process.argv.slice(2);
  if (!existingPath || !fetchedPath || !matchResultPath) {
    console.error('usage: node successor.mjs <existing.json> <fetched.json> <matchResult.json>');
    process.exit(1);
  }
  const existingPasses = JSON.parse(readFileSync(existingPath, 'utf8'));
  const fetchedPasses = JSON.parse(readFileSync(fetchedPath, 'utf8'));
  const matchResult = JSON.parse(readFileSync(matchResultPath, 'utf8'));
  console.log(JSON.stringify(classifySuccessors(existingPasses, fetchedPasses, matchResult), null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
