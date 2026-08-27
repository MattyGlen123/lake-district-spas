# Day-pass refresh — 2026-08-27

Scope: `--spa 1` (Lodore Falls Hotel Spa). Full per-pass quote set (PRD §5).

## Lodore Falls Hotel Spa (1) — html tier

- Source: five per-pass `dayPassUrl`s on `www.lakedistrictspa.co.uk` (this spa has one page per
  package, not one listing page)
- Artifact: `spa-1.html` — trimmed bundle of the 3 pages that fetched, 13,390 B
  (241,532 B full → **94.5% smaller**, 3/3 gate verdicts identical, `trim-artifact.mjs` exit 0)
- Fetch log: `spa-1-fetch-log.json` — array of 5 per-page logs (3 × HTTP 200, 2 × HTTP 404)
- Matching: `spa-1-match.json` · Checks: `spa-1-checks.json` · Gate: `spa-1-gate-results.json`
- Fetched: 2026-08-27 19:40 BST
- **3 grounded / 2 flagged.** 2 price changes, 1 verified unchanged, 1 rename applied.

Previous `lastVerified` on all five was `2025-01-19` — 19 months stale.

### Matching note — tier 1 keyed on `dayPassUrl`

Lodore gives every pass its **own** source page, and step 1 fetched each pass's own `dayPassUrl`.
That URL is the stable per-pass identity here, so it was supplied as the tier-1 matching key on
**both** the `existing` and `fetched` sides — the same "resolve it in the caller, not by changing
`matching.mjs`" pattern SKILL.md prescribes for the try.be fan-out case.

This matters. Keyed on names alone, `Restart Spa Experience` → `Restart Spa` is indistinguishable
from a pass that vanished: the first matching pass returned 3 `missingFlags` and 1
`unmatchedFetched`, and the strict-1:1 successor rule would then (correctly) have refused to pair
them, leaving a real, live, renamed package flagged as missing. Keyed on the page it was actually
read from, it is an honest tier-1 rename.

### `lodore-falls-renew-spa` — Falls Renew Spa Experience

Tier 1 match, no rename. **£150 → £165 (+10.0%)**

> `<h1 class="entry-title single-title" itemprop="headline">`
> `          Falls Renew Spa Experience        </h1>`
> `    <hr> `
> `		 <div class="allprices">`
> `        <h5><strong>£165          per person</strong></h5>`

Gate: **grounded**. `lastVerified` → 2026-08-27.

### `lodore-falls-restart-spa` — Restart Spa Experience → **Restart Spa**

Tier 1 match, **rename applied**. **£180 → £205 (+13.9%)**

> `<h1 class="entry-title single-title" itemprop="headline">`
> `          Restart Spa        </h1>`
> `    <hr> `
> `		 <div class="allprices">`
> `        <h5><strong>£205          per person</strong></h5>`

Gate: **grounded**. `lastVerified` → 2026-08-27.

ℹ️ `planRename` returned `{ applied: false, reason: 'no-change', newId: 'lodore-falls-restart-spa' }`
— the re-slug of the new name is identical to the existing id, so **the id does not change** and no
mechanical references needed rewriting. Only `packageName` was updated. A prose scan for the old
name ("Restart Spa Experience") across `content/blog/**/*.mdx` and `src/data/faqs/*.tsx` found **no
mentions**, so there are no prose flags.

### `lodore-falls-twilight-spa` — Twilight Spa

Tier 1 match, no rename. **£75 → £75 (unchanged, 0%)**

> `<h1 class="entry-title single-title" itemprop="headline">`
> `          Twilight Spa        </h1>`
> `    <hr> `
> `		 <div class="allprices">`
> `        <h5><strong>£75          per person</strong></h5>`

Gate: **grounded**. `lastVerified` → 2026-08-27.

### ⚠️ `lodore-falls-derwent-delight` — Derwent Delight for 2 (£450)

Source page **HTTP 404**: `https://www.lakedistrictspa.co.uk/spa-day/derwent-delight-for-2/`

No quote exists to take, so the check carries an empty quote and gate 1 demotes it with
**`empty-quote`**. **No data change, no `lastVerified` bump** — it stays at `2025-01-19`.

### ⚠️ `lodore-falls-rasul-ritual` — Rasul Ritual Spa Package (£250)

Source page **HTTP 404**: `https://www.lakedistrictspa.co.uk/spa-day/rasul-ritual-spa-day/`

Same: empty quote, gate 1 **`empty-quote`**. **No data change, no `lastVerified` bump.**

#### Both packages appear to be withdrawn, not moved

The spa's own index (`/spa-days/`) currently links 14 packages, and **neither Derwent Delight nor
Rasul Ritual is among them**:

```
/offers/morning-view/                              /spa-day/falls-spa-ultimate-bliss/
/offers/restart-spa-day/                           /spa-day/morning-renew-spa/
/offers/the-falls-cabana-spa-escape/               /spa-day/spa-and-dine/
/offers/twilight-dine-in-brasserie/                /spa-day/spa-dine-with-afternoon-tea/
/offers/twilight-dine-in-mizu/                     /spa-day/spa-dine-with-sunday-lunch/
/offers/waterfall-retreat-afternoon-package-6-15-guests/  /spa-day/thermal-journey/
                                                   /spa-day/tranquil-sound-bath-spa-journey/
                                                   /spa-day/twilight-spa/
```

That is context for review, **not** grounds for a data change: removing entries is forbidden by the
iron rule (PRD §1) and is a human decision. Both remain in the data, flagged, with their stale
`lastVerified`.

⚠️ Note that `lodore-falls-derwent-delight` and `lodore-falls-rasul-ritual` are referenced by
`content/blog/what-is-a-rasul-treatment.mdx`, `content/blog/keswick-spas-guide.mdx`,
`src/app/couples-spa-lake-district/page.tsx`, `src/components/FeaturedTreatments.tsx` and
`src/data/location-faqs/borrowdale-faqs.tsx`. Those references still resolve (the entries were not
touched), but they now advertise packages the spa no longer lists.

### 🏷 Promo notes

Every page carries a site-wide banner: **"Up to 20% OFF spa days"** and **"BLACK FRIDAY 10% OFF
gift vouchers"**. Promo prices are never extracted (PRD §3) — all three figures above are the list
prices shown in each package's own `allprices` block. The banner sits in the page header, far
outside gate 3's ±200-character context window, so it did not poison any span (confirmed: 0 poison
demotions).

### ℹ️ Out-of-scope discovery

The 14 packages now listed include several we do not carry (Thermal Journey, Spa & Dine, Falls Spa
Ultimate Bliss, Tranquil Sound Bath Spa Journey, and others). Discovery is out of scope (PRD §4);
noted only.

### Test fixture updated

`src/data/priced-content.test.ts` asserted `getDayPassPrice(1, 'lodore-falls-renew-spa') === '£150'`
— a live, refreshable price hardcoded as a test literal, so the legitimate £150 → £165 change broke
it. The assertion now compares against the stored option (`£${stored.priceGBP}`), which still proves
the helper resolves the id and formats the figure, without pinning a number this workflow is
designed to change every month.

## Invariant check

```
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  ".claude/content-out/refresh-runs/2026-08-27" "2026-08-27" "1"
```

`{ "runDate": "2026-08-27", "ok": true, report: [{ spaId: "1", fetched: true, passes: 5, violations: [] }] }` — exit 0, **0 violations**.
