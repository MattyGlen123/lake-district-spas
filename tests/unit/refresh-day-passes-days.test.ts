// Day-of-week derivation from the availability probe (issue 15, part 1).
//
// The booking engine already tells us which dates a package sells on. These
// tests pin the translation from "dates with slots" to the `daysAvailable`
// prose our data files use — including the wrap-around ranges ('Sunday-Thursday')
// that the naive Monday-first reading gets wrong.
import {
  WEEKDAYS,
  weekdayIndex,
  weekdayOf,
  formatWeekdays,
  parseDaysAvailable,
  deriveDaysForItem,
  compareDays,
  compareDaysForSpa,
} from '../../.claude/skills/refresh-day-passes/scripts/days.mjs';

// 2026-08-28 is a Friday — the real Swan probe's start date.
const FRI = '2026-08-28';
const SAT = '2026-08-29';
const SUN = '2026-08-30';
const MON = '2026-08-31';
const TUE = '2026-09-01';
const WED = '2026-09-02';
const THU = '2026-09-03';

/** A 14-day probe window starting Friday 2026-08-28, as the real run used. */
const WINDOW = { startDate: FRI, windowDays: 14, endDate: '2026-09-10' };

const item = (dates: string[]) => ({
  itemId: 1,
  name: 'X',
  daysProbed: 14,
  daysWithSlots: dates.length,
  datesWithSlots: dates,
});

describe('weekdayIndex / weekdayOf', () => {
  it('is Monday-first', () => {
    expect(WEEKDAYS[0]).toBe('Monday');
    expect(WEEKDAYS[6]).toBe('Sunday');
  });

  it('maps real dates to the right weekday', () => {
    expect(weekdayOf(FRI)).toBe('Friday');
    expect(weekdayOf(SAT)).toBe('Saturday');
    expect(weekdayOf(SUN)).toBe('Sunday');
    expect(weekdayOf(MON)).toBe('Monday');
  });

  // A local-time parse shifts the date across midnight in negative-offset
  // zones, silently reporting the previous day.
  it('parses as UTC so the answer does not depend on the runner timezone', () => {
    expect(weekdayIndex('2026-08-28')).toBe(4); // Friday
    expect(weekdayIndex('2026-01-01')).toBe(3); // Thursday
  });

  it('returns null for an unparseable date', () => {
    expect(weekdayIndex('not-a-date')).toBeNull();
    expect(weekdayOf('')).toBeNull();
  });
});

describe('formatWeekdays', () => {
  it('renders a single day as its name', () => {
    expect(formatWeekdays([4])).toBe('Friday');
  });

  it('renders a simple forward run as a range', () => {
    expect(formatWeekdays([0, 1, 2, 3])).toBe('Monday-Thursday');
    expect(formatWeekdays([5, 6])).toBe('Saturday-Sunday');
  });

  it('renders the full week as Monday-Sunday', () => {
    expect(formatWeekdays([0, 1, 2, 3, 4, 5, 6])).toBe('Monday-Sunday');
  });

  // The case a Monday-first reading gets wrong: Sun,Mon,Tue,Wed,Thu is one
  // contiguous run only if you allow it to wrap past Sunday.
  it('renders a wrap-around run the way the data file does', () => {
    expect(formatWeekdays([6, 0, 1, 2, 3])).toBe('Sunday-Thursday');
    expect(formatWeekdays([5, 6, 0])).toBe('Saturday-Monday');
  });

  it('falls back to a comma list when the set is not one run', () => {
    expect(formatWeekdays([0, 2, 4])).toBe('Monday, Wednesday, Friday');
  });

  it('returns null for an empty set', () => {
    expect(formatWeekdays([])).toBeNull();
  });

  it('ignores duplicates', () => {
    expect(formatWeekdays([4, 4, 4])).toBe('Friday');
  });
});

describe('parseDaysAvailable', () => {
  it('parses the forms the data files actually use', () => {
    expect(parseDaysAvailable('Monday-Sunday')).toHaveLength(7);
    expect(parseDaysAvailable('Monday-Thursday')).toEqual([0, 1, 2, 3]);
    expect(parseDaysAvailable('Saturday-Sunday')).toEqual([5, 6]);
    expect(parseDaysAvailable('Friday')).toEqual([4]);
  });

  it('parses a wrap-around range', () => {
    expect(parseDaysAvailable('Sunday-Thursday')).toEqual([0, 1, 2, 3, 6]);
  });

  it('tolerates spacing, dash variants and "to"', () => {
    expect(parseDaysAvailable('Monday - Thursday')).toEqual([0, 1, 2, 3]);
    expect(parseDaysAvailable('Monday–Thursday')).toEqual([0, 1, 2, 3]);
    expect(parseDaysAvailable('Monday to Thursday')).toEqual([0, 1, 2, 3]);
  });

  it('parses a comma list', () => {
    expect(parseDaysAvailable('Monday, Wednesday')).toEqual([0, 2]);
  });

  it('returns null rather than guessing at a form it does not model', () => {
    expect(parseDaysAvailable('weekdays only')).toBeNull();
    expect(parseDaysAvailable('')).toBeNull();
    expect(parseDaysAvailable(undefined as unknown as string)).toBeNull();
  });
});

describe('deriveDaysForItem', () => {
  it('derives a single-day package', () => {
    const d = deriveDaysForItem(item([FRI, '2026-09-04']), WINDOW);
    expect(d!.daysAvailable).toBe('Friday');
    expect(d!.weekdays).toEqual(['Friday']);
  });

  it('derives a wrap-around range', () => {
    const d = deriveDaysForItem(item([SUN, MON, TUE, WED, THU]), WINDOW);
    expect(d!.daysAvailable).toBe('Sunday-Thursday');
  });

  it('returns null for an item with no bookable date', () => {
    // Zero slots is gate 6's business. It tells us nothing about which days
    // the package runs, so deriving a day range from it would be invention.
    expect(deriveDaysForItem(item([]), WINDOW)).toBeNull();
  });

  it('returns null for an item the probe could not reach', () => {
    expect(deriveDaysForItem(undefined, WINDOW)).toBeNull();
    expect(deriveDaysForItem({ itemId: 1 } as never, WINDOW)).toBeNull();
  });

  it('is confident when the window offered every weekday at least twice', () => {
    const d = deriveDaysForItem(item([FRI, '2026-09-04']), WINDOW);
    expect(d!.confident).toBe(true);
    expect(d!.windowCoverage).toBeGreaterThanOrEqual(2);
  });

  // A 7-day window gives each weekday one chance, so an absence proves nothing.
  it('is not confident when the window was too short to ask twice', () => {
    const d = deriveDaysForItem(item([FRI]), { startDate: FRI, windowDays: 7 });
    expect(d!.confident).toBe(false);
  });

  // Swan's real probe started inside the booking notice period, so nearly every
  // package showed 13/14 rather than 14/14. Treating that as unconfident would
  // have made the signal useless on the very run it was built for.
  it('stays confident when a day was merely unavailable once (sell-out)', () => {
    const allButFirstFriday = [
      SAT, SUN, MON, TUE, WED, THU,
      '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07',
      '2026-09-08', '2026-09-09', '2026-09-10',
    ];
    const d = deriveDaysForItem(item(allButFirstFriday), WINDOW);
    expect(d!.daysAvailable).toBe('Monday-Sunday');
    expect(d!.confident).toBe(true);
    expect(d!.partialDays).toContain('Friday');
  });
});

describe('compareDays', () => {
  it('reports a match', () => {
    const r = compareDays('Friday', item([FRI, '2026-09-04']), WINDOW);
    expect(r.status).toBe('match');
  });

  it('reports a contradiction without applying anything', () => {
    const r = compareDays('Monday-Thursday', item([FRI, '2026-09-04']), WINDOW);
    expect(r.status).toBe('contradiction');
    expect(r.storedText).toBe('Monday-Thursday');
    expect(r.derivedText).toBe('Friday');
  });

  it('reports unknown-stored when our own text is unparseable', () => {
    const r = compareDays('whenever', item([FRI]), WINDOW);
    expect(r.status).toBe('unknown-stored');
    expect(r.derivedText).toBe('Friday');
  });

  it('reports no-derivation when the probe gave nothing', () => {
    const r = compareDays('Monday-Sunday', item([]), WINDOW);
    expect(r.status).toBe('no-derivation');
  });

  it('treats set-equal ranges written differently as a match', () => {
    const r = compareDays('Sunday - Thursday', item([SUN, MON, TUE, WED, THU]), WINDOW);
    expect(r.status).toBe('match');
  });
});

// The exact crossover from the Swan run (2026-08-28): two booking items were
// repurposed and their day coverage swapped relative to our slugs. Both would
// have been caught automatically by this comparison.
describe('regression: the Swan 2026-08-28 day crossover', () => {
  const artifact = {
    availabilityProbe: {
      startDate: FRI,
      windowDays: 14,
      items: [
        // …-weekday pointed here: stored Mon-Thu, actually Friday only.
        { itemId: 14258, name: 'Holte Socials Night - Friday', daysProbed: 14, daysWithSlots: 1, datesWithSlots: ['2026-09-04'] },
        // …-weekend pointed here: stored Sat-Sun, actually Sun-Thu.
        {
          itemId: 3865,
          name: 'Holte After Hours - Sunday - Thursday',
          daysProbed: 14,
          daysWithSlots: 10,
          datesWithSlots: [SUN, MON, TUE, WED, THU, '2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10'],
        },
      ],
    },
  };

  const passes = [
    { id: 'swan-twilight-sessions-weekday', daysAvailable: 'Monday-Thursday', bookingUrl: 'https://theswan.onejourney.travel/spa/days/14258' },
    { id: 'swan-twilight-sessions-weekend', daysAvailable: 'Saturday-Sunday', bookingUrl: 'https://theswan.onejourney.travel/spa/days/3865' },
  ];

  it('flags both passes as contradictions', () => {
    const results = compareDaysForSpa(artifact, passes);
    expect(results.map((r: { status: string }) => r.status)).toEqual([
      'contradiction',
      'contradiction',
    ]);
  });

  it('derives the correct replacement days', () => {
    const [weekday, weekend] = compareDaysForSpa(artifact, passes);
    expect(weekday.derivedText).toBe('Friday');
    expect(weekend.derivedText).toBe('Sunday-Thursday');
  });

  it('keys on the booking-item id taken from the bookingUrl', () => {
    const [weekday] = compareDaysForSpa(artifact, passes);
    expect(weekday.itemId).toBe('14258');
  });

  it('returns [] for an artifact with no probe block', () => {
    expect(compareDaysForSpa({}, passes)).toEqual([]);
  });
});
