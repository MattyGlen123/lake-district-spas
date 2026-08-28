# Gate 5 cannot tell a repriced pass from a repurposed booking item

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §5 rule 5 (plausibility bounds).
Found during the spa-5 (Swan) run, 2026-08-28.

## The problem

Gate 5 measures `(figureGBP - storedGBP) / storedGBP` and demotes past a threshold. That assumes the
two figures describe **the same product**. A booking item can instead be **repurposed** — the spa
retires one package and reuses the item id for a different one — and then the comparison is
meaningless, because there is no "move" to be plausible about.

Real case. Swan booking item `14258`:

| | Stored (verified 2026-01-22) | Source (2026-08-28) |
| --- | --- | --- |
| Name | Twilight Session | Holte Socials Night - Friday |
| Price | £35 | £59 |
| Days | Monday–Thursday | **Friday only** |
| Contents | fizz or soft drink | welcome cocktail, guided Heat & Hydro card |

That is +68.6%, which tripped gate 5 (`move-exceeds-40pct`). The figure was correct — verified
manually at source — but the gate had no way to know that, so it demoted a *true* price.

**The failure mode is worse than a one-off flag.** `movePct` is measured against `storedGBP`, and a
demoted pass gets **no data change and no `lastVerified` bump** — so `storedGBP` stays £35 forever.
The same pass would be re-flagged with the same +68.6% every single run, in perpetuity, with no path
to resolution. This is the same "flagged forever" trap that motivated the withdrawal rule (§4a).

## What was done instead (and why it is not the right fix)

`MAX_MOVE_PCT` was raised 40 → 75 (PRD §5 amendment, 2026-08-28, authorised by Matthew after
manually verifying £59). That unblocked this pass but **loosened the net for every spa on every
run** to solve a problem that was not about magnitude at all.

## Proposed fix

Detect the repurpose directly, from evidence already in hand, and route it out of gate 5:

- **Signal A — name changed.** Already computed: tier-1 matching reports `rename: true`.
- **Signal B — days changed.** Derivable from the `availabilityProbe` block: map `datesWithSlots` to
  weekdays and compare against stored `daysAvailable`. Item `3865` returned slots on Sun/Mon/Tue/Wed/Thu
  only across 14 days; `14258` returned Friday only. This is arithmetic on data already fetched — no
  extra requests. (See the sibling "days from availability probe" work.)

When **both** signals fire, the item is repurposed, not repriced:

- Skip the `movePct` comparison entirely — do not demote on magnitude.
- Emit a distinct `item-repurposed` outcome carrying both diffs (old/new name, old/new days,
  old/new price) so the PR renders it as its own reviewable lane rather than a price flag.
- Keep it out of the withdrawal path — a repurposed item is not a withdrawal (condition 1
  `pageGone` is false; the item is live).

With this in place `MAX_MOVE_PCT` can be **restored to 40**, which is the real win: the strict net
comes back and this case still passes on evidence rather than on a widened tolerance.

## Acceptance

- [ ] Weekday derivation from `availabilityProbe.items[].datesWithSlots`, unit-tested against the
      real Swan artifact (`14258` → Fri; `3865` → Sun–Thu; `19088` → Sat; `19482` → Wed).
- [ ] `item-repurposed` classification when name **and** days both change; neither alone triggers it.
- [ ] Gate 5 skipped for repurposed items; no `move-exceeds-*pct` demotion on them.
- [ ] PR/evidence renderers show the repurpose as its own section with both diffs.
- [ ] `MAX_MOVE_PCT` restored to 40 and the PRD §5 amendment updated to record the restoration.
- [ ] Re-running the Swan 2026-08-28 fixture reproduces: 8/8 grounded, `14258` classified as
      repurposed rather than gate-5 demoted, at threshold 40.

## Notes

Do not infer a repurpose from a price move alone — a genuine seasonal repricing can be large and
must still be checked. The point of requiring the day signal is that it is independent of price.
