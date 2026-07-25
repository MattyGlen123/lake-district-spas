# Schema fit: does DayPassOption hold what spas publish?

Status: closed
Labels: wayfinder:grilling
Assignee: Matthew Glen (via Claude session)
Blocked-by: [Source audit of the 15 spas' day-pass pages](02-source-audit.md)
Map: ../MAP.md

## Question

`DayPassOption` has a single `priceGBP` and `spaDuration`. If the source audit shows spas publishing weekday/weekend splits, seasonal pricing, or "from £X" pricing, can the current schema represent what the automation fetches — or does the spec need a schema change (and if so, what's the minimal one that doesn't ripple through FAQ/blog price components)?

## Comments

**Note** (2026-07-25): [Seasonal churn vs refresh-only scope](08-seasonal-churn.md) considered and **rejected** a seasonality field (`seasonal` flag / dormant marker) — seasonal replacement is handled by the rename-plus flow. Do not reopen; this ticket covers pricing structures only.

**Resolution** (2026-07-25, grilling session with Matthew):

**`DayPassOption` needs NO schema change.** All five pricing structures from the audit resolve to extraction/normalization conventions the spec ([Assemble the spec](07-assemble-spec.md)) must carry:

1. **Weekday/weekend splits → duplicate entries stay canonical.** One entry per bookable variant. Evidence this is a faithful model, not a hack: ~40 such ids across 7 spas (Armathwaite, Daffodil, Swan, Old England, Low Wood Bay, North Lakes, Appleby), and pairs are often genuinely distinct products — Swan's twilight pair has different booking-portal items (`.../14258` vs `.../3865`), different inclusions (fizz vs Prosecco), different `daysAvailable`. Tier-1 matching ([Rename & id-stability policy](03-rename-id-stability.md)) keys per-entry on bookingUrl-item, which aligns exactly. Collapsing was rejected: ~40 id renames rippling through FAQ/blog refs, plus variant-aware rewrites of `getLowestDayPassPrice`/sorting/`DayPassCard`.
2. **"From £X" floors → leave as-is (silent floor).** `priceGBP` stores the floor with no marker. Extraction rule: source "from £X" vs data `X` is a **match**, not drift. (An `isFromPrice` flag was offered and declined — accepted trade-off: the automation can't distinguish exact from floor pricing, and display stays "£X".)
3. **Promo codes → never in data; PR-note only.** `priceGBP` always records the undiscounted list price. Promos the fetch surfaces (e.g. Lodore 20%) go in the PR description as evidence for the human. Avoids a new freshness liability (expired codes on-site).
4. **Per-hour extensions → prose only.** `spaDuration` keeps base duration; the extension (Netherwood £10pp/hr) lives as a line in `included`/`description`. Drift still caught — the fetch re-derives the whole entry each run.
5. **Per-couple quoting → already representable** (fact, not decision): `priceGBP` (group total) + `pricePerPerson` + `requiredNumbers`, used by 6 spa files today incl. Whitewater's Couples Retreat (£220/£110pp). Extraction rule: per-couple source quotes normalize to this shape.

Consequence for the spec: zero component ripple (`getLowestDayPassPrice`, `SpaAccessPrice`, `DayPassPrice`, `DayPassCard`, `priced-content` validation all untouched); the schema section of the PRD is a set of normalization rules for the extractor, not a migration.
