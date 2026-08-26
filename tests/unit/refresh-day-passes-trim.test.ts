// Evidence trimming + bundling (trim-artifact.mjs).
// Direct import — pure functions, no filesystem work except the guarded CLI.
import {
  DEFAULT_PAD,
  SEGMENT_SEPARATOR,
  collectWindows,
  mergeWindows,
  trimDocument,
  verifyEquivalence,
} from '../../.claude/skills/refresh-day-passes/scripts/trim-artifact.mjs';

describe('collectWindows', () => {
  it('finds a window around every occurrence, not just the first', () => {
    const hay = `${'x'.repeat(50)}NEEDLE${'y'.repeat(50)}NEEDLE${'z'.repeat(50)}`;
    expect(collectWindows(hay, 'NEEDLE', 10)).toHaveLength(2);
  });

  it('clamps windows to the document bounds', () => {
    const [w] = collectWindows('NEEDLE tail', 'NEEDLE', 1000);
    expect(w[0]).toBe(0);
    expect(w[1]).toBe('NEEDLE tail'.length);
  });

  it('returns nothing for an absent or empty needle', () => {
    expect(collectWindows('abc', 'zzz', 10)).toEqual([]);
    expect(collectWindows('abc', '', 10)).toEqual([]);
  });
});

describe('mergeWindows', () => {
  it('merges overlapping windows so a span is never cut in half', () => {
    expect(mergeWindows([[0, 100], [50, 200], [400, 500]])).toEqual([[0, 200], [400, 500]]);
  });

  it('leaves disjoint windows alone and sorts them', () => {
    expect(mergeWindows([[300, 400], [0, 100]])).toEqual([[0, 100], [300, 400]]);
  });
});

describe('trimDocument', () => {
  it('keeps the quote and its surrounding context', () => {
    const doc = `${'a'.repeat(500)}<b>Relax Spa Day</b> £115${'c'.repeat(500)}`;
    const out = trimDocument(doc, ['<b>Relax Spa Day</b> £115'], 20);
    expect(out).toContain('<b>Relax Spa Day</b> £115');
    expect(out!.length).toBeLessThan(doc.length);
  });

  it('returns null when none of the quotes appear', () => {
    expect(trimDocument('nothing here', ['absent'], 10)).toBeNull();
  });

  it('separates disjoint segments with the neutral separator', () => {
    const doc = `ONE${'.'.repeat(5000)}TWO`;
    const out = trimDocument(doc, ['ONE', 'TWO'], 10);
    expect(out).toContain(SEGMENT_SEPARATOR.trim());
  });

  it('pads by default well beyond the gate poison-context range', () => {
    expect(DEFAULT_PAD).toBeGreaterThanOrEqual(2000);
  });
});

describe('verifyEquivalence', () => {
  const check = {
    passId: 'relax-spa-day',
    passName: 'Relax Spa Day',
    quote: '<strong>Relax Spa Day</strong> <em>£115</em>',
    figureGBP: 115,
    storedGBP: 115,
  };

  it('reports identical verdicts when the trim preserves gate context', () => {
    const full = `${'a'.repeat(3000)}<strong>Relax Spa Day</strong> <em>£115</em>${'b'.repeat(3000)}`;
    const trimmed = trimDocument(full, [check.quote])!;
    const r = verifyEquivalence(full, trimmed, [check]);
    expect(r.mismatches).toEqual([]);
    expect(r.identical).toBe(1);
  });

  // The failure this whole mechanism exists to prevent: a poison word
  // near the quote in the full page, dropped by an over-aggressive trim,
  // would flip a flagged pass to grounded.
  it('catches a trim that drops a nearby poison word', () => {
    const full = `members only offer ${'a'.repeat(50)}<strong>Relax Spa Day</strong> <em>£115</em>`;
    const overTrimmed = '<strong>Relax Spa Day</strong> <em>£115</em>';
    const r = verifyEquivalence(full, overTrimmed, [check]);
    expect(r.mismatches).toHaveLength(1);
    expect(r.mismatches[0].full.grounded).toBe(false);
    expect(r.mismatches[0].trimmed.grounded).toBe(true);
  });

  it('the default pad keeps that poison word, so the real trim stays equivalent', () => {
    const full = `members only offer ${'a'.repeat(50)}<strong>Relax Spa Day</strong> <em>£115</em>`;
    const trimmed = trimDocument(full, [check.quote])!;
    expect(verifyEquivalence(full, trimmed, [check]).mismatches).toEqual([]);
  });

  it('treats a quote missing from both as equivalent (both fail gate 1)', () => {
    const r = verifyEquivalence('unrelated', 'unrelated', [check]);
    expect(r.mismatches).toEqual([]);
  });
});
