# Portal tier — try.be JSON-LD (North Lakes 12, Underscar 19)

Status: closed — merged in PR #33 (2026-08-26)
Type: AFK
Assignee: (unclaimed)

## Outcome (2026-08-26)

Built and run. 12 booking items fetched, **17/17 passes grounded, 0 flags**. North Lakes: all 10
prices changed (+6.8% to +12%), exactly as the spike predicted 18 days earlier. Underscar: 7/7
unchanged. `check-invariant.mjs` exit 0 across both spas. Typecheck clean, 763 tests pass.

- New `gbp-integer` arithmetic mode in `gate.mjs` (+6 unit tests).
- Fan-out (2 passes : 1 booking item) resolved in the caller via synthetic per-variant
  `bookingUrl`s — `matching.mjs` untouched, tier 1 stayed honestly 1:1, 0 false missing flags.
- Underscar's `lowPrice === highPrice` asserted on all 7 items rather than assumed.
- 2 renames SUPPRESSED, not applied ("The Simple Ritual" → "Simple Ritual"): both re-slug to the
  same id and would strip the weekday/weekend distinction. Rule documented in SKILL.md; code-level
  guard filed as [issue 12](12-fanout-rename-guard.md).

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (portal tier), §3 rule 5, §5 gate 1.
Split out of [03 Portal tier](03-portal-tier.md) — see that file for why.

## Scope

North Lakes (12, 10 passes / 5 booking items) and Underscar (19, 7 passes / 7 booking items) on
`*.try.be/items/<item-id>/<slug>`.

## What to build

Plain curl + browser UA on each pass's `bookingUrl`. **try.be is NOT a JS-only SPA for our
purposes** — the shell carries a server-rendered `application/ld+json` `Product` block containing
both the item name and its price. (The rest of the page is a Vite SPA; ignore it.)

```json
{"@context":"https://schema.org/","@type":"Product","name":"Simple Ritual",
 "description":"…","image":"…","sku":null,
 "offers":{"@type":"AggregateOffer","lowPrice":68,"highPrice":78,"priceCurrency":"gbp"}}
```

Quote = the contiguous span from `{"@context":"https:\/\/schema.org\/"` through the specific
`"lowPrice":<n>` or `"highPrice":<n>` the pass maps to. **End the span at that key** so the weekday
quote does not also contain the weekend figure — this is what makes low-vs-high grounding
meaningful rather than "some number is present".

### Required gate change — new arithmetic mode

`offers.lowPrice` / `highPrice` are **in whole pounds, not pence**. Neither existing mode fits:

- `none` requires a literal `£<n>` in the span — the JSON-LD has `"priceCurrency":"gbp"`, no `£`.
- `pence` requires `<n>×100` in the span.

Add a third mode to `resolveArithmetic()` in `scripts/gate.mjs`, e.g. `"gbp-integer"`: matches the
figure as a **bare integer** (reuse `figureInQuote(..., 'pence')`'s standalone-number matcher) with
the identity conversion `quotedFigure === figureGBP`. Unit-test it alongside the existing
`pence` / `per-couple` cases. Update the SKILL.md arithmetic table.

### Weekday/weekend fan-out

North Lakes stores 10 passes but has only **5 distinct `bookingUrl`s** — each item's
`lowPrice`/`highPrice` pair is the weekday/weekend price. So one artifact grounds two passes.
Tier-1 matching keys on the booking-item id, which is 2:1 here — check `matching.mjs` handles a
two-existing-to-one-fetched mapping and does not treat one of the pair as a `missingFlag`.
Underscar is a clean 1:1 (low === high on all 7).

## Spike evidence (2026-08-09)

All 12 items HTTP 200 with a parseable JSON-LD block. Candidate quotes built by the rule above were
run through the real `gate.mjs` helpers: **17/17 clear gates 2, 3 and 5** — quote greps verbatim,
name in span, poison-word clean, all moves inside ±40% and £20–£400. Gate 1 is the only blocker
and only for want of the new mode.

**Underscar (19): all 7 unchanged.** Twilight £55, Harmonie £80, Serenity £90, Mindfulness £100,
Wellbeing £150, Peaceful £170, Reflection £210.

**North Lakes (12): all 10 changed — this slice is the one that moves data.**

| pass | stored | source | move |
| --- | --- | --- | --- |
| simple-ritual-weekday | £63 | £68 | +7.9% |
| simple-ritual-weekend | £73 | £78 | +6.8% |
| morning-ritual-weekday | £126 | £139 | +10.3% |
| morning-ritual-weekend | £136 | £149 | +9.6% |
| afternoon-ritual-weekday | £126 | £139 | +10.3% |
| afternoon-ritual-weekend | £136 | £149 | +9.6% |
| twilight-ritual-weekday | £126 | £139 | +10.3% |
| twilight-ritual-weekend | £136 | £149 | +9.6% |
| pure-luxury-weekday | £250 | £280 | +12% |
| pure-luxury-weekend | £260 | £290 | +11.5% |

## Acceptance criteria

- [ ] New arithmetic mode in `gate.mjs` with unit tests; SKILL.md table updated
- [ ] `/refresh-day-passes --spa 19` and `--spa 12` ground every price from the JSON-LD block
- [ ] Weekday/weekend pairs sharing one `bookingUrl` both ground, neither becomes a spurious flag
- [ ] Portal fetch failure for one pass flags that pass, doesn't sink the spa
- [ ] `npm run typecheck && npm test` green; `check-invariant.mjs` 0 violations

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)
