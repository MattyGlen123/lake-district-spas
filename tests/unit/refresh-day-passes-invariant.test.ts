// Post-run invariant check for /refresh-day-passes (PRD §6): stale
// lastVerified = exactly the failed/flagged set for targeted spas.
// Spawns the real script — same interface the skill uses at run time.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHECK = join(process.cwd(), '.claude/skills/refresh-day-passes/scripts/check-invariant.mjs');
const RUN_DATE = '2026-08-01';

let dir: string;
let runDir: string;
let dataDir: string;

interface SpaReport {
  spaId: string;
  fetched: boolean;
  passes: number;
  violations: { passId: string; expected: string; actual: string }[];
}

function dataFile(entries: { id: string; lastVerified: string }[]): string {
  const blocks = entries
    .map(
      (e) => `    {
      id: '${e.id}',
      packageName: 'X',
      priceGBP: 100,
      lastVerified: '${e.lastVerified}',
    },`,
    )
    .join('\n');
  return `export const passes = {\n  options: [\n${blocks}\n  ],\n};\n`;
}

function runCheck(
  spa: string,
  entries: { id: string; lastVerified: string }[],
  gateResults: { passId: string; grounded: boolean }[] | null,
): { ok: boolean; exitCode: number; report: SpaReport[] } {
  writeFileSync(join(dataDir, `spa-${spa}-day-passes.ts`), dataFile(entries));
  const gatePath = join(runDir, `spa-${spa}-gate-results.json`);
  rmSync(gatePath, { force: true });
  if (gateResults) {
    writeFileSync(gatePath, JSON.stringify({ artifact: 'x', results: gateResults }));
  }
  try {
    const out = execFileSync('node', [CHECK, runDir, RUN_DATE, spa, dataDir], {
      encoding: 'utf8',
    });
    return { exitCode: 0, ...JSON.parse(out) };
  } catch (e) {
    const err = e as { status: number; stdout: string };
    return { exitCode: err.status, ...JSON.parse(err.stdout) };
  }
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'invariant-test-'));
  runDir = join(dir, 'run');
  dataDir = join(dir, 'data');
  mkdirSync(runDir);
  mkdirSync(dataDir);
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('refresh-day-passes invariant check script', () => {
  it('holds when grounded passes are bumped and flagged passes are stale', () => {
    const { ok, exitCode, report } = runCheck(
      '13',
      [
        { id: 'a', lastVerified: RUN_DATE },
        { id: 'b', lastVerified: '2026-01-22' },
      ],
      [
        { passId: 'a', grounded: true },
        { passId: 'b', grounded: false },
      ],
    );
    expect(ok).toBe(true);
    expect(exitCode).toBe(0);
    expect(report[0].fetched).toBe(true);
  });

  it('holds for a fetch-failed spa (no gate results) when nothing was bumped', () => {
    const { ok, report } = runCheck(
      '99',
      [
        { id: 'a', lastVerified: '2026-01-22' },
        { id: 'b', lastVerified: '2026-01-22' },
      ],
      null,
    );
    expect(ok).toBe(true);
    expect(report[0].fetched).toBe(false);
  });

  it('flags a bump on a fetch-failed spa', () => {
    const { ok, exitCode, report } = runCheck(
      '99',
      [{ id: 'a', lastVerified: RUN_DATE }],
      null,
    );
    expect(ok).toBe(false);
    expect(exitCode).toBe(2);
    expect(report[0].violations).toEqual([
      { passId: 'a', expected: 'stale (fetch failed)', actual: RUN_DATE },
    ]);
  });

  it('flags a grounded pass that was not bumped', () => {
    const { ok, report } = runCheck(
      '13',
      [{ id: 'a', lastVerified: '2026-01-22' }],
      [{ passId: 'a', grounded: true }],
    );
    expect(ok).toBe(false);
    expect(report[0].violations[0]).toEqual({
      passId: 'a',
      expected: `fresh (${RUN_DATE})`,
      actual: '2026-01-22',
    });
  });

  it('flags an ungrounded (flagged-lane) pass that was bumped anyway', () => {
    const { ok, report } = runCheck(
      '13',
      [{ id: 'a', lastVerified: RUN_DATE }],
      [{ passId: 'a', grounded: false }],
    );
    expect(ok).toBe(false);
    expect(report[0].violations[0]).toEqual({
      passId: 'a',
      expected: 'stale (flagged)',
      actual: RUN_DATE,
    });
  });

  it('flags a data entry with no gate verdict and a verdict with no data entry', () => {
    const { ok, report } = runCheck(
      '13',
      [{ id: 'a', lastVerified: '2026-01-22' }],
      [{ passId: 'ghost', grounded: true }],
    );
    expect(ok).toBe(false);
    const expected = report[0].violations.map((v) => v.expected);
    expect(expected).toContain('a gate verdict');
    expect(expected).toContain('a data entry');
  });
});
