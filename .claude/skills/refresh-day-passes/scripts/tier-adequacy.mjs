#!/usr/bin/env node
// Tier-adequacy assessment for /refresh-day-passes.
//
// THE QUESTION NOBODY WAS ASKING
// A run gates the prices it can find and flags the ones it cannot. What it
// never asked was whether the SOURCE was capable of answering in the first
// place. Swan sat on the `html` tier while its marketing page carried 3 of its
// 8 packages — so 5 passes were flagged every single run, indefinitely, and the
// run reported that as five pass-level problems rather than one source-level
// one. Worse, of the three prices the page did carry, one was £14 stale: the
// page said £65 for a package the booking engine charged £79.
//
// Coverage is the signal. A spa where most passes ground has a pass problem;
// a spa where most passes DON'T has a tier problem, and no amount of re-running
// will fix it.
//
// THE POLICY (see AUTHORITY in tiers.mjs)
// When two sources disagree about the same pass, the price a customer can
// actually transact at wins over published marketing copy. Every disagreement
// is reported either way — a source that is merely stale and a source that is
// wrong look identical from here, and only a human can tell them apart.
//
// NOTHING HERE FETCHES OR WRITES. It reads artifacts the run already produced
// and returns a recommendation.

import { AUTHORITY, isTransactable, tierFor } from './tiers.mjs';

/** Coverage below this means the tier itself is suspect, not the passes. */
export const COVERAGE_FLOOR = 1;

/**
 * How much of a spa's catalogue the current source actually grounded.
 *
 * @param gateResults the `results` array from gate.mjs
 */
export function assessCoverage(gateResults = []) {
  const total = gateResults.length;
  const grounded = gateResults.filter((r) => r.grounded).length;
  const ungrounded = gateResults.filter((r) => !r.grounded);

  // A pass can fail to ground for reasons that have nothing to do with the
  // source's completeness — a poisoned span, an implausible move. Only a
  // MISSING price argues the source is inadequate, so those are counted apart.
  const notFound = ungrounded.filter((r) =>
    ['empty-quote', 'quote-not-found-in-artifact', 'figure-not-in-quote'].includes(r.reason),
  );

  return {
    total,
    grounded,
    coverage: total === 0 ? 0 : grounded / total,
    ungroundedIds: ungrounded.map((r) => r.passId),
    notFoundIds: notFound.map((r) => r.passId),
    sourceIncomplete: notFound.length > 0,
  };
}

/**
 * Compare the same passes priced from two different sources.
 *
 * @param a {tier, checks:[{passId, figureGBP}]}
 * @param b {tier, checks:[{passId, figureGBP}]}
 * @returns per-pass agreement, plus which tier wins each disagreement
 */
export function comparePriceSources(a, b) {
  const bByPass = new Map((b.checks ?? []).map((c) => [c.passId, c]));
  const overlap = [];

  for (const ca of a.checks ?? []) {
    const cb = bByPass.get(ca.passId);
    if (!cb) continue;
    const agrees = Number(ca.figureGBP) === Number(cb.figureGBP);
    const authorityA = AUTHORITY[a.tier] ?? 0;
    const authorityB = AUTHORITY[b.tier] ?? 0;
    overlap.push({
      passId: ca.passId,
      [`${a.tier}GBP`]: ca.figureGBP,
      [`${b.tier}GBP`]: cb.figureGBP,
      agrees,
      // Equal authority is a genuine standoff, not a win for whichever tier
      // happened to be passed first — say so rather than pick.
      authoritative: agrees
        ? null
        : authorityA === authorityB
          ? 'tie'
          : authorityA > authorityB
            ? a.tier
            : b.tier,
    });
  }

  const divergences = overlap.filter((o) => !o.agrees);
  return {
    comparedPasses: overlap.length,
    agreements: overlap.length - divergences.length,
    divergences,
    overlap,
  };
}

/**
 * Recommend whether a spa should change tier.
 *
 * @param spaId
 * @param current   {tier, gateResults, checks}
 * @param candidate {tier, gateResults, checks} — optional probe of an alternative
 */
export function recommendTier(spaId, current, candidate = null) {
  const registry = tierFor(spaId);
  const currentCoverage = assessCoverage(current.gateResults);

  // One stable shape on every branch. A caller (or a type checker) should not
  // have to discriminate on `reason` to know whether `comparison` exists.
  const base = {
    spaId: Number(spaId),
    currentTier: current.tier,
    currentCoverage,
    candidateTier: candidate?.tier ?? null,
    candidateCoverage: candidate ? assessCoverage(candidate.gateResults) : null,
    knownAlternatives: registry?.alternatives ?? [],
    comparison: null,
    divergenceReview: [],
    regressions: [],
  };

  if (currentCoverage.coverage >= COVERAGE_FLOOR && !candidate) {
    return {
      ...base,
      migrate: false,
      reason: 'current-tier-adequate',
      summary: `${currentCoverage.grounded}/${currentCoverage.total} grounded; nothing to improve.`,
    };
  }

  if (!candidate) {
    return {
      ...base,
      migrate: false,
      reason: 'no-candidate-probed',
      summary:
        `${currentCoverage.grounded}/${currentCoverage.total} grounded. ` +
        `The source may be incomplete, but no alternative tier was probed, so there is nothing to compare.`,
    };
  }

  const candidateCoverage = base.candidateCoverage;
  const comparison = comparePriceSources(
    { tier: current.tier, checks: current.checks },
    { tier: candidate.tier, checks: candidate.checks },
  );

  // A candidate must ground a strict SUPERSET. Trading one blind spot for a
  // different one is not an improvement, however much better the headline
  // coverage looks.
  const currentGrounded = new Set(
    (current.gateResults ?? []).filter((r) => r.grounded).map((r) => r.passId),
  );
  const candidateGrounded = new Set(
    (candidate.gateResults ?? []).filter((r) => r.grounded).map((r) => r.passId),
  );
  const regressions = [...currentGrounded].filter((id) => !candidateGrounded.has(id));

  if (regressions.length) {
    return {
      ...base,
      migrate: false,
      reason: 'candidate-regresses',
      regressions,
      comparison,
      summary: `${candidate.tier} would LOSE ${regressions.length} pass(es) the current tier grounds.`,
    };
  }

  if (candidateGrounded.size <= currentGrounded.size) {
    return {
      ...base,
      migrate: false,
      reason: 'candidate-no-better',
      comparison,
      summary: `${candidate.tier} grounds no more than ${current.tier}; migration would buy nothing.`,
    };
  }

  return {
    ...base,
    migrate: true,
    reason: isTransactable(candidate.tier)
      ? 'candidate-covers-more-and-is-transactable'
      : 'candidate-covers-more',
    comparison,
    // Divergences do not block a migration to a more authoritative source —
    // they ARE the finding. Swan's £65-vs-£79 gap was the strongest argument
    // for migrating, not an argument against it. But it is always surfaced:
    // a migration silently changing a price is exactly what must not happen.
    divergenceReview: comparison.divergences,
    summary:
      `${candidate.tier} grounds ${candidateGrounded.size}/${candidateCoverage.total} vs ` +
      `${currentGrounded.size}/${currentCoverage.total} on ${current.tier}` +
      (comparison.divergences.length
        ? `; ${comparison.divergences.length} price disagreement(s) need review.`
        : '; sources agree on every overlapping price.'),
  };
}
