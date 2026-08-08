# Evidence — day-pass refresh 2026-08-06

Run: `/refresh-day-passes --spa 10` (html tier) · first run under the **full gate suite** (gate 1 grounding + arithmetic, gate 2 contiguity, gate 3 poison words, gate 5 plausibility) · fetched 2026-08-06 21:09 BST

Gate constants (PRD §5): `PRICE_MIN_GBP 20` · `PRICE_MAX_GBP 400` · `MAX_MOVE_PCT 40` · `POISON_CONTEXT_CHARS 200`.

## Beech Hill Hotel Spa (10) — 4/4 grounded, 0 price changes, 0 flags

Source: [beechhillhotel.co.uk/spa/](https://www.beechhillhotel.co.uk/spa/) · artifact `spa-10.html` (HTTP 200, curl + browser UA, 1 attempt, 142,826 bytes) · retry log `spa-10-fetch-log.json` · checks `spa-10-checks.json` · gate results `spa-10-gate-results.json`

Every pass cleared all four gates: quote greps verbatim in the artifact with the figure inside it, pass name and price in the one contiguous span, no poison word within ±200 chars, price inside £20–£400 with a 0.0% move.

### beech-hill-rejuvenate-spa-day · stored £140 → source £140 (0.0%) · ✅ grounded, unchanged

> `<strong>Rejuvenate Spa Day</strong><br /> <em>£140.00</em><br /> <em>50 minute appointment</em>`

### beech-hill-relax-spa-day · stored £115 → source £115 (0.0%) · ✅ grounded, unchanged

> `<strong>Relax Spa Day</strong><br /> <em>£115.00</em><br /> <em>25 minute appointment</em>`

### beech-hill-spa-access-friday-saturday · stored £45 → source £45 (0.0%) · ✅ grounded, unchanged

> `<strong>Spa access</strong><br /> <em>£45.00</em><br /> <em>180 minute appointment</em>`

### beech-hill-spa-access-sunday-thursday · stored £45 → source £45 (0.0%) · ✅ grounded, unchanged

> `<strong>Spa access</strong><br /> <em>£45.00</em><br /> <em>180 minute appointment</em>`

ℹ️ Notes:

- The source lists a single "Spa access" item (£45.00, 180 minutes); the data keeps the canonical weekday/weekend split — both entries ground on the same span at the same price (PRD §3 rule 1). Gate 2 matches the source title "Spa access" against the stored `packageName` "Spa Access" case-insensitively.
- Gate 3 saw 20 `member` occurrences in the artifact — **all** of them Salient theme CSS class names (`team-member`, `nectar_team_member_overlay`) in `<head>`, hundreds of lines from any price. None fell inside the ±200-char window of any priced span, so nothing was demoted. No `resident`/`voucher`/`deposit`/`per month` anywhere on the page.
- No promo codes on the page. No prices outside £20–£400.

## Flag-lane proof — adversarial re-check of the same artifact

`spa-10-demote-demo-checks.json` → `spa-10-demote-demo-results.json`. **Demo only**: these are not real passes, they enter no diff and touch no data; they run against the *same* `spa-10.html` to show each gate demoting.

| Demo check | Gate | Reason | Quote |
| --- | --- | --- | --- |
| `demo-gate2-wrong-price-nearby` | 2 | `pass-name-not-in-quote` | `<em>£100.00</em><br /> <em>50 minute appointment</em>` — the real Hot Stone Massage price span that sits two blocks above the Rejuvenate card; grounded in the artifact and £100 is inside it, but the pass name is not, so contiguity demotes it |
| `demo-gate1-hallucinated-quote` | 1 | `quote-not-found-in-artifact` | `<strong>Rejuvenate Spa Day</strong> now only £99.00` — plausible-looking, absent from the artifact |
| `demo-gate5-implausible-move` | 5 | `move-exceeds-40pct` (`movePct: 55.6`) | the genuine grounded £140.00 Rejuvenate span, against a fabricated `storedGBP: 90` |

Gate 3's demote cases (member price in the span; `Membership` within ±200 chars) are covered in `tests/unit/refresh-day-passes-gate.test.ts` — this artifact has no poison word anywhere near a price, so it cannot demonstrate one honestly.

## Post-run invariant (PRD §6)

`check-invariant.mjs .claude/content-out/refresh-runs/2026-08-06 2026-08-06 10` → **ok, 0 violations** — all 4 grounded passes bumped to `lastVerified: 2026-08-06`, nothing flagged, nothing stale.
