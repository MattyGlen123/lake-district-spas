# Schema fit: does DayPassOption hold what spas publish?

Status: ready-for-human
Labels: wayfinder:grilling
Assignee: (unclaimed)
Blocked-by: [Source audit of the 15 spas' day-pass pages](02-source-audit.md)
Map: ../MAP.md

## Question

`DayPassOption` has a single `priceGBP` and `spaDuration`. If the source audit shows spas publishing weekday/weekend splits, seasonal pricing, or "from £X" pricing, can the current schema represent what the automation fetches — or does the spec need a schema change (and if so, what's the minimal one that doesn't ripple through FAQ/blog price components)?

## Comments

**Note** (2026-07-25): [Seasonal churn vs refresh-only scope](08-seasonal-churn.md) considered and **rejected** a seasonality field (`seasonal` flag / dormant marker) — seasonal replacement is handled by the rename-plus flow. Do not reopen; this ticket covers pricing structures only.
