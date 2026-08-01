# Evidence — day-pass refresh 2026-08-01

Run: `/refresh-day-passes --spa 6` (blocked tier via Playwright fallback) + forced-failure fixture spa 999 · fetched 2026-08-01 21:23 BST

## Macdonald Old England Hotel Spa (6) — 6/6 grounded, 0 changes

Source: [macdonaldhotels.co.uk/old-england/spa-leisure/spa/days](https://www.macdonaldhotels.co.uk/old-england/spa-leisure/spa/days) · **artifact `spa-6.html` = rendered HTML from the Playwright fallback** (`fetch-playwright.mjs`, HTTP 200, 1 attempt — curl not attempted, spa is `blocked` tier) · retry log `spa-6-fetch-log.json` · gate results `spa-6-gate-results.json`

The source lists one card per package; the data keeps the canonical weekday/weekend split — both entries of each pair ground on the same span at the same price (PRD §3 rule 1). All prices are "from £X" → floor rule, stored X counts as a match (PRD §3 rule 2).

### old-england-morning-retreat-weekday · stored £109 → source £109 · ✅ grounded, unchanged

> `from <span>£109</span></p></div> <div class="spaCard__content"><div class="topSection"><h2 class="topSection__title title"> My Morning Retreat <!----></h2>`

### old-england-morning-retreat-weekend · stored £109 → source £109 · ✅ grounded, unchanged

Same span as above (canonical split).

### old-england-afternoon-escape-weekday · stored £109 → source £109 · ✅ grounded, unchanged

> `from <span>£109</span></p></div> <div class="spaCard__content"><div class="topSection"><h2 class="topSection__title title"> My Afternoon Escape <!----></h2>`

### old-england-afternoon-escape-weekend · stored £109 → source £109 · ✅ grounded, unchanged

Same span as above (canonical split).

### old-england-time-for-me-weekday · stored £70 → source £70 · ✅ grounded, unchanged

> `from <span>£70</span></p></div> <div class="spaCard__content"><div class="topSection"><h2 class="topSection__title title"> My Time for Me Spa Day <!----></h2>`

### old-england-time-for-me-weekend · stored £70 → source £70 · ✅ grounded, unchanged

Same span as above (canonical split).

ℹ️ Three packages on the page match no existing entry (note only, no additions — PRD §4): Summer Serenity Ritual Spa Day (from £109, includes "FREE ELEMIS gift set & travel bag worth £98*" — gift-with-purchase, not a price discount), Spa Day for Two (from £109, midweek), My Summer Awakening (from £109, 9am–12pm seasonal morning slot).

## Test Fixture Spa (999) — ❌ not fetched, excluded

Bogus URL `https://spa-999-does-not-exist.invalid/day-passes` (forced failure to prove the filed-issue lane). curl DNS failure ×3 attempts (2s/8s backoff), not bot-blocked so no Playwright fallback. Retry log `spa-999-fetch-log.json` · filed issue [.scratch/day-pass-refresh/issues/10-fetch-failure-spa-999-2026-08-01.md](../../../../.scratch/day-pass-refresh/issues/10-fetch-failure-spa-999-2026-08-01.md) · fixture entry untouched (`lastVerified` 2026-01-22).

## Post-run invariant (PRD §6)

`check-invariant.mjs` — stale `lastVerified` = exactly the failed/flagged set:

- spa 6 (src/data/day-passes): **ok, 0 violations** — all 6 grounded passes bumped to 2026-08-01
- spa 999 (fixtures dir): **ok, 0 violations** — fetch failed, sole pass stale as required
