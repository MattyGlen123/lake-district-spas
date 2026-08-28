// Repurposed-item detection for /refresh-day-passes (issue 15).
//
// Gate 5 compares figureGBP against storedGBP, which only means something if
// both describe the same product. When a spa reuses a booking-item id for a
// DIFFERENT package the percentage measures nothing — and because a demoted
// pass never updates storedGBP, the same false demotion would repeat on every
// future run. These tests pin the two-signal rule that identifies that case.
import {
  REPURPOSE_REASONS,
  classifyRepurpose,
  classifyRepurposeForSpa,
  applyRepurposeToChecks,
} from '../../.claude/skills/refresh-day-passes/scripts/repurpose.mjs';
import {
  plausibility,
  MAX_MOVE_PCT,
} from '../../.claude/skills/refresh-day-passes/scripts/gate.mjs';

const contradiction = (stored: string, derived: string, confident = true) => ({
  status: 'contradiction',
  storedText: stored,
  derivedText: derived,
  confident,
});
const match = (text: string) => ({
  status: 'match',
  storedText: text,
  derivedText: text,
  confident: true,
});

describe('classifyRepurpose — both signals required', () => {
  it('classifies as repurposed when the name AND the days both changed', () => {
    const r = classifyRepurpose({
      nameChanged: true,
      daysComparison: contradiction('Monday-Thursday', 'Friday'),
    });
    expect(r.repurposed).toBe(true);
    expect(r.reason).toBe(REPURPOSE_REASONS.repurposed);
  });

  // The seasonal rename case: Winter Glow -> Summer Glow was the same product
  // at the same £150 on the same days. Waiving gate 5 on a bare rename would
  // blind the run to a genuine mispricing on any renamed pass.
  it('does NOT classify a name change alone as repurposed', () => {
    const r = classifyRepurpose({
      nameChanged: true,
      daysComparison: match('Monday-Sunday'),
    });
    expect(r.repurposed).toBe(false);
    expect(r.reason).toBe(REPURPOSE_REASONS.nameOnly);
  });

  it('does NOT classify a day change alone as repurposed', () => {
    const r = classifyRepurpose({
      nameChanged: false,
      daysComparison: contradiction('Monday-Sunday', 'Monday-Friday'),
    });
    expect(r.repurposed).toBe(false);
    expect(r.reason).toBe(REPURPOSE_REASONS.daysOnly);
  });

  it('does NOT classify when neither signal fired', () => {
    const r = classifyRepurpose({
      nameChanged: false,
      daysComparison: match('Monday-Sunday'),
    });
    expect(r.repurposed).toBe(false);
    expect(r.reason).toBe(REPURPOSE_REASONS.neither);
  });

  // An unconfident derivation means our probe window was too short to prove a
  // day was dropped. Waiving a gate on our own sampling gap is not evidence.
  it('refuses to act on an unconfident day change', () => {
    const r = classifyRepurpose({
      nameChanged: true,
      daysComparison: contradiction('Monday-Thursday', 'Friday', false),
    });
    expect(r.repurposed).toBe(false);
    expect(r.reason).toBe(REPURPOSE_REASONS.unconfidentDays);
  });

  it('handles a missing day comparison without throwing', () => {
    expect(classifyRepurpose({ nameChanged: true }).repurposed).toBe(false);
    expect(classifyRepurpose({}).repurposed).toBe(false);
    expect(classifyRepurpose().repurposed).toBe(false);
  });

  it('reports the signals it used', () => {
    const r = classifyRepurpose({
      nameChanged: true,
      daysComparison: contradiction('Monday-Thursday', 'Friday'),
    });
    expect(r.signals).toEqual({
      nameChanged: true,
      daysChanged: true,
      daysConfident: true,
      storedDays: 'Monday-Thursday',
      derivedDays: 'Friday',
    });
  });

  // Price must never be a signal: using the size of the move to excuse the
  // size of the move is circular, and a real seasonal repricing can be large.
  it('ignores price entirely', () => {
    const huge = classifyRepurpose({
      nameChanged: false,
      daysComparison: match('Monday-Sunday'),
      movePct: 500,
    } as never);
    expect(huge.repurposed).toBe(false);
  });
});

describe('gate 5 waiver', () => {
  const base = { figureGBP: 59, storedGBP: 35 }; // +68.6%

  it('demotes a big move by default', () => {
    const r = plausibility(base);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(`move-exceeds-${MAX_MOVE_PCT}pct`);
  });

  it('waives the move comparison for a repurposed item', () => {
    const r = plausibility({ ...base, repurposed: true });
    expect(r.ok).toBe(true);
    expect(r.plausibilityWaived).toBe('item-repurposed');
    expect(r.movePct).toBe(68.6);
  });

  // Bounds are absolute: a price outside £20–£400 is implausible on its own
  // terms, whatever product it belongs to.
  it('still enforces the absolute price bounds on a repurposed item', () => {
    const low = plausibility({ figureGBP: 5, storedGBP: 35, repurposed: true });
    expect(low.ok).toBe(false);
    expect(low.reason).toBe('price-out-of-bounds');

    const high = plausibility({ figureGBP: 5000, storedGBP: 35, repurposed: true });
    expect(high.ok).toBe(false);
    expect(high.reason).toBe('price-out-of-bounds');
  });

  it('only waives on an explicit true, not on any truthy value', () => {
    expect(plausibility({ ...base, repurposed: 'yes' } as never).ok).toBe(false);
    expect(plausibility({ ...base, repurposed: 1 } as never).ok).toBe(false);
  });
});

describe('classifyRepurposeForSpa + applyRepurposeToChecks', () => {
  const artifact = {
    availabilityProbe: {
      startDate: '2026-08-28',
      windowDays: 14,
      items: [
        { itemId: 14258, daysProbed: 14, daysWithSlots: 1, datesWithSlots: ['2026-09-04'] },
        {
          itemId: 4204,
          daysProbed: 14,
          daysWithSlots: 13,
          datesWithSlots: [
            '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01', '2026-09-02',
            '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07',
            '2026-09-08', '2026-09-09', '2026-09-10',
          ],
        },
      ],
    },
  };

  const passes = [
    { id: 'friday-pass', daysAvailable: 'Monday-Thursday', bookingUrl: 'https://x/spa/days/14258' },
    { id: 'seasonal-pass', daysAvailable: 'Monday-Sunday', bookingUrl: 'https://x/spa/days/4204' },
  ];
  const matches = [
    { existingId: 'friday-pass', rename: true, existingName: 'Twilight Session', fetchedName: 'Holte Socials Night - Friday' },
    { existingId: 'seasonal-pass', rename: true, existingName: 'Winter Glow Spa Day', fetchedName: 'Summer Glow Spa Escape' },
  ];

  it('separates a repurpose from a seasonal rename', () => {
    const [friday, seasonal] = classifyRepurposeForSpa(artifact, passes, matches);
    expect(friday.repurposed).toBe(true);
    expect(seasonal.repurposed).toBe(false);
    expect(seasonal.reason).toBe(REPURPOSE_REASONS.nameOnly);
  });

  it('carries the old and new names through for the PR', () => {
    const [friday] = classifyRepurposeForSpa(artifact, passes, matches);
    expect(friday.oldName).toBe('Twilight Session');
    expect(friday.newName).toBe('Holte Socials Night - Friday');
    expect(friday.itemId).toBe('14258');
  });

  it('stamps only the repurposed checks', () => {
    const cls = classifyRepurposeForSpa(artifact, passes, matches);
    const checks = [{ passId: 'friday-pass' }, { passId: 'seasonal-pass' }];
    const [friday, seasonal] = applyRepurposeToChecks(checks, cls);
    expect(friday.repurposed).toBe(true);
    expect(seasonal.repurposed).toBeUndefined();
  });

  it('does not mutate the caller\'s checks', () => {
    const cls = classifyRepurposeForSpa(artifact, passes, matches);
    const checks = [{ passId: 'friday-pass' }];
    applyRepurposeToChecks(checks, cls);
    expect(checks[0]).toEqual({ passId: 'friday-pass' });
  });

  it('classifies nothing when the artifact has no probe block', () => {
    const cls = classifyRepurposeForSpa({}, passes, matches);
    expect(cls.every((c: { repurposed: boolean }) => !c.repurposed)).toBe(true);
  });
});

// The whole point of issue 15: the strict threshold can stay strict.
describe('regression: Swan 14258 grounds at the STRICT threshold', () => {
  it('keeps MAX_MOVE_PCT at 40 rather than widening it', () => {
    expect(MAX_MOVE_PCT).toBe(40);
  });

  it('grounds the +68.6% move via the repurpose waiver, not via tolerance', () => {
    const check = { figureGBP: 59, storedGBP: 35, repurposed: true };
    const r = plausibility(check);
    expect(r.ok).toBe(true);
    expect(r.movePct).not.toBeNull();
    expect(Math.abs(r.movePct as number)).toBeGreaterThan(MAX_MOVE_PCT);
    expect(r.plausibilityWaived).toBe('item-repurposed');
  });
});
