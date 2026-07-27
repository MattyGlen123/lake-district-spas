// Gate 1 (exact-quote grounding) for /refresh-day-passes.
// Spawns the real script — same interface the skill uses at run time.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const GATE = join(process.cwd(), '.claude/skills/refresh-day-passes/scripts/gate.mjs');

interface GateResult {
  passId: string;
  grounded: boolean;
  reason: string;
}

let dir: string;

function runGate(artifactHtml: string, checks: object[]): GateResult[] {
  const artifact = join(dir, 'artifact.html');
  const checksPath = join(dir, 'checks.json');
  writeFileSync(artifact, artifactHtml);
  writeFileSync(checksPath, JSON.stringify(checks));
  const out = execFileSync('node', [GATE, artifact, checksPath], { encoding: 'utf8' });
  return JSON.parse(out).results;
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'gate-test-'));
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('refresh-day-passes gate script', () => {
  const artifact = `<html><body>
    <h3>Rejuvenate   Spa Day</h3>
    <p>All day access &mdash; &pound;140.00 per person</p>
    <h3>Relax Spa Day</h3>
    <p>&#163;115 per person</p>
    <p>Spa Access &ndash; 3 hours for &pound;45</p>
    <p>Treatment room 140 upstairs</p>
  </body></html>`;

  it('grounds a quote that matches modulo whitespace/entity normalization', () => {
    const [r] = runGate(artifact, [
      {
        passId: 'rejuvenate',
        quote: 'Rejuvenate Spa Day</h3> <p>All day access — £140.00 per person',
        figureGBP: 140,
      },
    ]);
    expect(r).toEqual({ passId: 'rejuvenate', grounded: true, reason: 'grounded' });
  });

  it('decodes numeric entities (&#163; -> £)', () => {
    const [r] = runGate(artifact, [
      { passId: 'relax', quote: '£115 per person', figureGBP: 115 },
    ]);
    expect(r.grounded).toBe(true);
  });

  it('fails a quote that does not appear in the artifact', () => {
    const [r] = runGate(artifact, [
      { passId: 'rejuvenate', quote: 'Rejuvenate Spa Day now £140', figureGBP: 140 },
    ]);
    expect(r).toEqual({
      passId: 'rejuvenate',
      grounded: false,
      reason: 'quote-not-found-in-artifact',
    });
  });

  it('fails when the figure is not inside the quote', () => {
    const [r] = runGate(artifact, [
      { passId: 'rejuvenate', quote: 'Rejuvenate Spa Day', figureGBP: 140 },
    ]);
    expect(r).toEqual({ passId: 'rejuvenate', grounded: false, reason: 'figure-not-in-quote' });
  });

  it('rejects a bare number without a £ sign (no false grounding on "room 140")', () => {
    const [r] = runGate(artifact, [
      { passId: 'rejuvenate', quote: 'Treatment room 140 upstairs', figureGBP: 140 },
    ]);
    expect(r.grounded).toBe(false);
    expect(r.reason).toBe('figure-not-in-quote');
  });

  it('does not match a figure that is a prefix of a larger price (£45 vs £450)', () => {
    const [r] = runGate('<p>Deluxe package &pound;450</p>', [
      { passId: 'spa-access', quote: 'Deluxe package £450', figureGBP: 45 },
    ]);
    expect(r.grounded).toBe(false);
  });

  it('fails an empty quote', () => {
    const [r] = runGate(artifact, [{ passId: 'x', quote: '', figureGBP: 45 }]);
    expect(r).toEqual({ passId: 'x', grounded: false, reason: 'empty-quote' });
  });
});
