#!/usr/bin/env node
// Repurposed-item detection for /refresh-day-passes (issue 15).
//
// THE PROBLEM
// Gate 5 asks "is this price move plausible?" — which only means anything if
// the two prices describe the SAME product. A spa can retire a package and
// reuse its booking-item id for a different one, and then there is no "move"
// to be plausible about.
//
// Swan item 14258, 2026-08-28:
//     stored   Twilight Session          £35   Mon-Thu
//     source   Holte Socials Night - Fri £59   Friday only
//
// +68.6% tripped gate 5. The figure was correct — verified by hand — so the
// gate demoted a TRUE price. Worse, a demoted pass gets no data change and no
// lastVerified bump, so storedGBP stays £35 for ever and the identical +68.6%
// re-flags on every future run. That is the same "flagged forever" trap the
// withdrawal rule was written to end.
//
// THE FIX
// Detect the repurpose from evidence we already hold, and route it out of the
// plausibility comparison rather than widening the tolerance for everyone.
//
// TWO INDEPENDENT SIGNALS, BOTH REQUIRED
//   1. the source NAME changed  — from tier-1 matching's `rename`
//   2. the DAY COVERAGE changed — from the availability probe (days.mjs)
//
// Both, because either alone is ordinary:
//   * a name change alone is a seasonal rename (Winter Glow -> Summer Glow:
//     same product, same £150, same all-week availability). Waiving gate 5 on
//     that would blind us to a genuine mispricing on a renamed pass.
//   * a day change alone is a schedule tweak, not a new product.
//
// Price is deliberately NOT a signal. Using the size of the move to excuse the
// size of the move is circular, and a real seasonal repricing can be large and
// must still be checked.

import { compareDays } from './days.mjs';

export const REPURPOSE_REASONS = {
  repurposed: 'item-repurposed',
  nameOnly: 'name-changed-only',
  daysOnly: 'days-changed-only',
  neither: 'no-repurpose-signals',
  unconfidentDays: 'days-change-not-confident',
};

/**
 * Classify one pass from its two signals.
 *
 * @param nameChanged     did tier-1 matching report a rename?
 * @param daysComparison  a `compareDays` result, or null when unavailable
 * @returns {{ repurposed, reason, signals }}
 */
export function classifyRepurpose({ nameChanged, daysComparison } = {}) {
  const nameSignal = nameChanged === true;
  const daysContradict = daysComparison?.status === 'contradiction';
  // An unconfident day derivation is not evidence. A probe window too short to
  // offer every weekday twice cannot prove a day was dropped, and acting on it
  // would waive gate 5 on the strength of a gap in our own sampling.
  const daysConfident = daysComparison?.confident === true;
  const daysSignal = daysContradict && daysConfident;

  const signals = {
    nameChanged: nameSignal,
    daysChanged: daysContradict,
    daysConfident,
    storedDays: daysComparison?.storedText ?? null,
    derivedDays: daysComparison?.derivedText ?? null,
  };

  if (nameSignal && daysSignal) {
    return { repurposed: true, reason: REPURPOSE_REASONS.repurposed, signals };
  }
  if (nameSignal && daysContradict && !daysConfident) {
    return { repurposed: false, reason: REPURPOSE_REASONS.unconfidentDays, signals };
  }
  if (nameSignal) return { repurposed: false, reason: REPURPOSE_REASONS.nameOnly, signals };
  if (daysSignal) return { repurposed: false, reason: REPURPOSE_REASONS.daysOnly, signals };
  return { repurposed: false, reason: REPURPOSE_REASONS.neither, signals };
}

/**
 * Classify every pass of a spa in one pass over the run's own outputs.
 *
 * @param artifact  parsed `spa-<id>.json`, carrying `availabilityProbe`
 * @param passes    [{ id, daysAvailable, bookingUrl }] — stored entries
 * @param matches   matching.mjs `matches` array (for `rename` / `existingId`)
 * @returns [{ passId, itemId, repurposed, reason, signals, oldName, newName }]
 */
export function classifyRepurposeForSpa(artifact, passes, matches = []) {
  const probe = artifact?.availabilityProbe;
  const byItemId = new Map(
    (probe?.items ?? []).map((i) => [String(i.itemId), i]),
  );
  const matchByExistingId = new Map(
    matches.map((m) => [m.existingId ?? m.passId, m]),
  );

  return passes.map((pass) => {
    const itemId = String(pass.bookingUrl ?? '').split('/').filter(Boolean).pop();
    const match = matchByExistingId.get(pass.id);
    const daysComparison = probe
      ? compareDays(pass.daysAvailable, byItemId.get(itemId), probe)
      : null;

    const verdict = classifyRepurpose({
      nameChanged: Boolean(match?.rename),
      daysComparison,
    });

    return {
      passId: pass.id,
      itemId,
      oldName: match?.existingName ?? null,
      newName: match?.fetchedName ?? null,
      ...verdict,
    };
  });
}

/**
 * Stamp `repurposed: true` onto the checks whose passes were classified as
 * repurposed, so gate 5 knows to waive the move comparison for them.
 *
 * Kept separate from classification on purpose: deciding is one job, and
 * writing that decision into the gate's input is another. The caller can
 * inspect the classification before letting it affect a gate.
 */
export function applyRepurposeToChecks(checks, classifications) {
  const repurposed = new Set(
    classifications.filter((c) => c.repurposed).map((c) => c.passId),
  );
  return checks.map((c) =>
    repurposed.has(c.passId) ? { ...c, repurposed: true } : c,
  );
}
