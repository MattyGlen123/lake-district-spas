# Evidence — day-pass refresh 2026-07-27

Run: `/refresh-day-passes --spa 10` (walking skeleton, html tier) · fetched 2026-07-27 21:28 BST

## Beech Hill Hotel Spa (10) — 4/4 grounded, 0 changes

Source: [beechhillhotel.co.uk/spa/](https://www.beechhillhotel.co.uk/spa/) · artifact `spa-10.html` (HTTP 200) · gate results `spa-10-gate-results.json`

### beech-hill-rejuvenate-spa-day · stored £140 → source £140 · ✅ grounded, unchanged

> `<strong>Rejuvenate Spa Day</strong><br /> <em>£140.00</em><br /> <em>50 minute appointment</em>`

### beech-hill-relax-spa-day · stored £115 → source £115 · ✅ grounded, unchanged

> `<strong>Relax Spa Day</strong><br /> <em>£115.00</em><br /> <em>25 minute appointment</em>`

### beech-hill-spa-access-friday-saturday · stored £45 → source £45 · ✅ grounded, unchanged

> `<strong>Spa access</strong><br /> <em>£45.00</em><br /> <em>180 minute appointment</em>`

### beech-hill-spa-access-sunday-thursday · stored £45 → source £45 · ✅ grounded, unchanged

> `<strong>Spa access</strong><br /> <em>£45.00</em><br /> <em>180 minute appointment</em>`

ℹ️ The source lists a single "Spa access" item (£45.00, 180 minutes); the data keeps the canonical weekday/weekend split (Friday-Saturday / Sunday-Thursday) — both entries ground on the same span at the same price, per PRD §3 rule 1. No promo codes seen on the page.
