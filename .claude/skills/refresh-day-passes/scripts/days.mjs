#!/usr/bin/env node
// Day-of-week derivation from the availability probe (issue 15, part 1).
//
// WHY
// `daysAvailable` is prose we copied off a marketing page months ago. The
// availability probe already tells us, from the booking engine itself, exactly
// which dates a package can be booked on — so the real answer is sitting in
// data we fetch every run and simply was not being read.
//
// On the Swan run (2026-08-28) this mattered: two booking items had been
// repurposed and their day coverage had CROSSED OVER relative to our slugs.
// Our `…-weekday` pass (stored Mon–Thu) pointed at an item bookable only on
// Fridays; our `…-weekend` pass (stored Sat–Sun) pointed at one bookable
// Sun–Thu. The package names said so, and the probe proved it independently.
//
// WHAT THIS IS NOT
// This never rewrites data on its own. It PROPOSES a value and reports whether
// that contradicts what we store. A contradiction is a review item, in the same
// spirit as a gate demotion — because absence of a slot is not proof of
// exclusion (a package sold out on every probed Tuesday looks identical to one
// that never runs on Tuesdays). Deciding between those needs a human, so the
// confidence signal below exists to say when we are guessing.

/** Monday-first, matching how the data file's ranges read. */
export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Monday-first weekday index (0–6) for an ISO `YYYY-MM-DD` date.
 * Parsed as UTC on purpose: a local-time parse shifts the date across midnight
 * in some zones and silently reports the wrong day.
 */
export function weekdayIndex(isoDate) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return (d.getUTCDay() + 6) % 7; // getUTCDay: 0=Sun -> our 0=Mon
}

/** Weekday name for an ISO date, or null if unparseable. */
export function weekdayOf(isoDate) {
  const i = weekdayIndex(isoDate);
  return i === null ? null : WEEKDAYS[i];
}

/**
 * Express a set of weekday indices the way the data file does.
 *
 * The existing values ('Monday-Sunday', 'Monday-Thursday', 'Saturday-Sunday',
 * 'Sunday-Thursday') are all CONTIGUOUS RUNS on a 7-day cycle, and some of them
 * wrap past Sunday — 'Sunday-Thursday' is Sun,Mon,Tue,Wed,Thu. So the run is
 * found with wrap-around, which reproduces every existing convention rather
 * than inventing a new one.
 *
 * A set that is not one contiguous run (e.g. Mon/Wed/Fri) has no range form and
 * is rendered as a comma list — deliberately awkward, because it means the
 * source is doing something our schema does not model.
 */
export function formatWeekdays(indices) {
  const set = [...new Set(indices)].sort((a, b) => a - b);
  if (set.length === 0) return null;
  if (set.length === 7) return 'Monday-Sunday';
  if (set.length === 1) return WEEKDAYS[set[0]];

  // Find a start whose forward run covers the whole set.
  for (const start of set) {
    const run = [];
    for (let step = 0; step < 7; step++) {
      const idx = (start + step) % 7;
      if (!set.includes(idx)) break;
      run.push(idx);
    }
    if (run.length === set.length) {
      return `${WEEKDAYS[run[0]]}-${WEEKDAYS[run[run.length - 1]]}`;
    }
  }
  return set.map((i) => WEEKDAYS[i]).join(', ');
}

/**
 * Parse a stored `daysAvailable` string back into weekday indices, so a stored
 * value and a derived one can be compared as sets rather than as strings
 * ('Sunday-Thursday' and 'Sunday - Thursday' mean the same thing).
 *
 * Returns null when the string is not a form we model — better to report
 * "cannot compare" than to invent a comparison.
 */
export function parseDaysAvailable(text) {
  if (typeof text !== 'string' || !text.trim()) return null;
  const canon = (s) => {
    const t = s.trim().toLowerCase();
    const i = WEEKDAYS.findIndex((d) => d.toLowerCase() === t);
    return i === -1 ? null : i;
  };

  const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
  const out = new Set();

  for (const part of parts) {
    const range = part.split(/\s*(?:-|–|—|\bto\b)\s*/i).filter(Boolean);
    if (range.length === 2) {
      const a = canon(range[0]);
      const b = canon(range[1]);
      if (a === null || b === null) return null;
      for (let step = 0; step < 7; step++) {
        const idx = (a + step) % 7;
        out.add(idx);
        if (idx === b) break;
      }
      continue;
    }
    const single = canon(part);
    if (single === null) return null;
    out.add(single);
  }

  return out.size ? [...out].sort((x, y) => x - y) : null;
}

/**
 * Derive day coverage for ONE probe item.
 *
 * @param probeItem an entry of `availabilityProbe.items`
 * @param probeBlock the whole `availabilityProbe` (for the window dates)
 * @returns null when there is nothing to derive from — an item the probe could
 *          not reach, or one with no bookable date at all (that is gate 6's
 *          business, not ours; a package with zero slots tells us nothing about
 *          which days it runs).
 */
export function deriveDaysForItem(probeItem, probeBlock = {}) {
  if (!probeItem || !Array.isArray(probeItem.datesWithSlots)) return null;
  const dates = probeItem.datesWithSlots.filter(Boolean);
  if (dates.length === 0) return null;

  const seen = new Map(); // weekday index -> times observed with slots
  for (const d of dates) {
    const i = weekdayIndex(d);
    if (i === null) continue;
    seen.set(i, (seen.get(i) ?? 0) + 1);
  }
  if (seen.size === 0) return null;

  // How many times did the probe window actually offer each weekday? Without
  // this we cannot tell "never runs on Tuesday" from "the window contained no
  // Tuesday", and would report a confident answer built on no observation.
  const opportunities = windowOpportunities(probeBlock, probeItem);

  const indices = [...seen.keys()].sort((a, b) => a - b);
  const observations = WEEKDAYS.map((name, i) => ({
    weekday: name,
    seen: seen.get(i) ?? 0,
    opportunities: opportunities[i] ?? 0,
  }));

  // Confidence is a claim about the WINDOW, not about the package.
  //
  // A single sighting is already proof a weekday runs, so the included set is
  // never in doubt. The only thing we can get wrong is EXCLUSION — and the way
  // to be wrong is a window too short to have asked. Requiring every weekday to
  // have been offered at least twice is that check.
  //
  // Deliberately NOT requiring a weekday to be free on every occurrence: real
  // packages sell out. Swan's own probe ran from a Friday inside the booking
  // notice period, so almost every package showed 13/14 rather than 14/14 —
  // scoring that as "unconfident" would have made the signal useless on the
  // very run it was built for. A possible sell-out shows up in `observations`
  // for a human to read, rather than suppressing the whole result.
  const minOpportunities = Math.min(...opportunities);
  const confident = minOpportunities >= 2;

  return {
    weekdays: indices.map((i) => WEEKDAYS[i]),
    daysAvailable: formatWeekdays(indices),
    confident,
    // Included weekdays that were free on some but not all of their chances —
    // consistent with selling out, and worth a glance before trusting a range.
    partialDays: indices
      .filter((i) => (seen.get(i) ?? 0) < (opportunities[i] ?? 0))
      .map((i) => WEEKDAYS[i]),
    observations,
    datesObserved: dates.length,
    windowCoverage: minOpportunities,
  };
}

/** How many times each weekday appears in the probe window. */
function windowOpportunities(probeBlock, probeItem) {
  const counts = Array(7).fill(0);
  const start = probeBlock?.startDate;
  const days = probeBlock?.windowDays ?? probeItem?.daysProbed;
  if (!start || !days) return counts;
  const base = new Date(`${start}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) return counts;
  for (let n = 0; n < days; n++) {
    const d = new Date(base.getTime() + n * 86400000);
    counts[(d.getUTCDay() + 6) % 7] += 1;
  }
  return counts;
}

/**
 * Compare a stored `daysAvailable` against what the probe shows.
 *
 * @returns {{ status, storedDays, derivedDays, storedText, derivedText, confident }}
 *   status is one of:
 *     'match'            stored agrees with the source
 *     'contradiction'    they disagree — REVIEW, never auto-applied
 *     'unknown-stored'   stored text is not a form we can parse
 *     'no-derivation'    probe gave us nothing to compare against
 */
export function compareDays(storedText, probeItem, probeBlock = {}) {
  const derived = deriveDaysForItem(probeItem, probeBlock);
  if (!derived) {
    return { status: 'no-derivation', storedText, derivedText: null, confident: false };
  }
  const stored = parseDaysAvailable(storedText);
  if (!stored) {
    return {
      status: 'unknown-stored',
      storedText,
      derivedText: derived.daysAvailable,
      derivedDays: derived.weekdays,
      confident: derived.confident,
      observations: derived.observations,
    };
  }
  const storedNames = stored.map((i) => WEEKDAYS[i]);
  const same =
    storedNames.length === derived.weekdays.length &&
    storedNames.every((d) => derived.weekdays.includes(d));

  return {
    status: same ? 'match' : 'contradiction',
    storedText,
    storedDays: storedNames,
    derivedText: derived.daysAvailable,
    derivedDays: derived.weekdays,
    confident: derived.confident,
    observations: derived.observations,
  };
}

/**
 * Compare every probed item in an artifact against the spa's stored passes.
 *
 * @param artifact parsed `spa-<id>.json` (must carry `availabilityProbe`)
 * @param passes   [{ id, daysAvailable, bookingUrl }]
 */
export function compareDaysForSpa(artifact, passes) {
  const items = artifact?.availabilityProbe?.items;
  if (!Array.isArray(items)) return [];
  const byId = new Map(items.map((i) => [String(i.itemId), i]));

  return passes.map((pass) => {
    const itemId = String(pass.bookingUrl ?? '').split('/').filter(Boolean).pop();
    const item = byId.get(itemId);
    return {
      passId: pass.id,
      itemId,
      ...compareDays(pass.daysAvailable, item, artifact.availabilityProbe),
    };
  });
}
