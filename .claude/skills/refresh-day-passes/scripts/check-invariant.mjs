#!/usr/bin/env node
// Post-run invariant check for /refresh-day-passes (PRD §6):
// after a run, stale `lastVerified` = EXACTLY the failed/flagged set
// for the spas targeted.
//
// Usage: node check-invariant.mjs <run-dir> <run-date> <spa-ids-csv> [data-dir]
//   run-dir    - .claude/content-out/refresh-runs/<date>/
//   run-date   - YYYY-MM-DD the run bumps lastVerified to
//   spa-ids-csv- targeted spa ids, e.g. "6" or "6,10"
//   data-dir   - defaults to src/data/day-passes (override for fixtures)
//
// Expectation per targeted spa:
//   no <run-dir>/spa-<id>-gate-results.json  -> fetch failed: every pass
//     must be stale (lastVerified !== run-date)
//   gate results present -> grounded passes must have
//     lastVerified === run-date; ungrounded (flagged) must be stale
//
// stdout: JSON report. Exit 0 invariant holds · 2 violations · 1 usage/IO.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function parseDataFile(src) {
  // One `id:` and one `lastVerified:` per DayPassOption entry, in order.
  const ids = [...src.matchAll(/^\s*id:\s*'([^']+)'/gm)].map((m) => m[1]);
  const dates = [...src.matchAll(/^\s*lastVerified:\s*'(\d{4}-\d{2}-\d{2})'/gm)].map((m) => m[1]);
  if (ids.length !== dates.length) {
    throw new Error(`id/lastVerified count mismatch: ${ids.length} ids, ${dates.length} dates`);
  }
  return ids.map((id, i) => ({ id, lastVerified: dates[i] }));
}

export function checkSpa({ spaId, passes, gateResults, runDate }) {
  const violations = [];
  if (!gateResults) {
    // Fetch failed: excluded spa, nothing may be bumped.
    for (const p of passes) {
      if (p.lastVerified === runDate) {
        violations.push({ passId: p.id, expected: 'stale (fetch failed)', actual: runDate });
      }
    }
    return { spaId, fetched: false, passes: passes.length, violations };
  }
  const verdicts = new Map(gateResults.results.map((r) => [r.passId, r.grounded]));
  for (const p of passes) {
    const grounded = verdicts.get(p.id);
    if (grounded === undefined) {
      violations.push({ passId: p.id, expected: 'a gate verdict', actual: 'not in gate results' });
    } else if (grounded && p.lastVerified !== runDate) {
      violations.push({ passId: p.id, expected: `fresh (${runDate})`, actual: p.lastVerified });
    } else if (!grounded && p.lastVerified === runDate) {
      violations.push({ passId: p.id, expected: 'stale (flagged)', actual: runDate });
    }
  }
  for (const r of gateResults.results) {
    if (!passes.some((p) => p.id === r.passId)) {
      violations.push({ passId: r.passId, expected: 'a data entry', actual: 'not in data file' });
    }
  }
  return { spaId, fetched: true, passes: passes.length, violations };
}

function main() {
  const [runDir, runDate, spaCsv, dataDir = 'src/data/day-passes'] = process.argv.slice(2);
  if (!runDir || !runDate || !spaCsv) {
    console.error('usage: node check-invariant.mjs <run-dir> <run-date> <spa-ids-csv> [data-dir]');
    process.exit(1);
  }
  const spas = spaCsv.split(',').map((s) => s.trim()).filter(Boolean);
  const report = spas.map((spaId) => {
    const passes = parseDataFile(readFileSync(join(dataDir, `spa-${spaId}-day-passes.ts`), 'utf8'));
    const gatePath = join(runDir, `spa-${spaId}-gate-results.json`);
    const gateResults = existsSync(gatePath) ? JSON.parse(readFileSync(gatePath, 'utf8')) : null;
    return checkSpa({ spaId, passes, gateResults, runDate });
  });
  const ok = report.every((r) => r.violations.length === 0);
  console.log(JSON.stringify({ runDate, ok, report }, null, 2));
  process.exit(ok ? 0 : 2);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main();
}
