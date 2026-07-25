# Mock: day-pass refresh PR description

Asset for [PR anatomy & failure UX](../../.scratch/day-pass-freshness/issues/04-pr-anatomy.md). Everything below the rule is the PR body as `/refresh-day-passes` would emit it. All figures are real (2026-07-24 source audit); timestamps simulated.

**Decision points rendered (react to these — marked ▶ in body):**

1. **▶ Partial-fetch UX** — mock renders a *partial PR*: 14 fetched spas proceed, the failed spa gets a "Not fetched" section and its entries/`lastVerified` are untouched. Alternative: fail the whole run, or open a separate issue per failure.
2. **▶ lastVerified on unchanged passes** — mock renders the *bump*: all 99 confirmed-unchanged passes get `lastVerified → 2026-07-25`, making date churn ~95% of the diff's line count. Alternative: only touch changed entries (diff stays tiny, but "verified" dates go stale on the passes that were actually checked).

Prior decisions rendered, not reopened: evidence quote + source URL per change (charting), never-auto-delete (charting), per-couple normalization + "from £X" floor + promo-as-PR-note ([Schema fit](../../.scratch/day-pass-freshness/issues/06-schema-fit.md)), tier-3 successor suggestion ([Seasonal churn](../../.scratch/day-pass-freshness/issues/08-seasonal-churn.md) / [Rename & id-stability](../../.scratch/day-pass-freshness/issues/03-rename-id-stability.md)).

---

# chore(data): day-pass refresh 2026-07-25 — 3 price changes, 2 flags, 1 fetch failure

> Manual run of `/refresh-day-passes` · 2026-07-25 14:02 BST
> **15 spas targeted · 14 fetched · 1 failed** · 110 passes: **3 price changes · 2 missing-flags · 1 successor suggestion · 99 verified unchanged**
> This PR deletes nothing. The diff touches only price fields and `lastVerified`. Flags (⚠️) need human action and are listed here, not applied.

## 💷 Price changes (3)

### 1. Whitewater Hotel — Luxurious Spa With Afternoon Tea (+25%)

`whitewater-luxurious-spa-afternoon-tea` · `priceGBP: 60 → 75`

> "Luxurious Spa Day with Afternoon Tea — £75.00 per person. Includes 4 hours use of Cascades facilities, a 30 minute treatment of your choice and Afternoon Tea."

— [whitewater-hotel.co.uk/spa-fitness/newby-bridge-spa/](https://www.whitewater-hotel.co.uk/spa-fitness/newby-bridge-spa/), fetched 2026-07-25 14:02

### 2. Whitewater Hotel — Couples Retreat (+18%)

`whitewater-couples-retreat` · `priceGBP: 220 → 260` · `pricePerPerson: 110 → 130`

> "Couples Retreat — £130.00 per person, based on two people sharing. Luxury Mud Rasul per couple, 30 minute Elemis back massage each."

— [whitewater-hotel.co.uk/spa-fitness/newby-bridge-spa/](https://www.whitewater-hotel.co.uk/spa-fitness/newby-bridge-spa/), fetched 2026-07-25 14:02
ℹ️ Source quotes per person; normalized to group total + `pricePerPerson` (`requiredNumbers: 'Requires 2 people'`), per schema convention.

### 3. Lodore Falls Hotel Spa — Restart Spa Experience (+14%)

`lodore-falls-restart-spa` · `priceGBP: 180 → 205`

> "Restart Spa Day — from £205 per person. 2 hours use of spa facilities, 50 minute treatment, 2-course lunch in Mizu or Afternoon Tea."

— [lakedistrictspa.co.uk/offers/restart-spa-day/](https://www.lakedistrictspa.co.uk/offers/restart-spa-day/), fetched 2026-07-25 14:03
ℹ️ Source says "from £205" — stored as floor per normalization rule; "from £X" vs stored `X` counts as a match on future runs.

## ⚠️ Missing from source (2) — flagged, nothing removed

### Whitewater Hotel — Pure Pampering

`whitewater-pure-pampering` (£90) no longer appears on [the spa page](https://www.whitewater-hotel.co.uk/spa-fitness/newby-bridge-spa/); its booking item ([onejourney …/6201](https://whitewaterhotel.onejourney.travel/spa/days/6201)) returns "this product is unavailable". No structurally similar new package found → no successor candidate.
**Action:** verify with the spa; delete manually if discontinued. Entry untouched, `lastVerified` **not** bumped (stays 2026-01-22).

### Swan Hotel Spa — Winter Glow Spa Day · possible successor: Winter Glow → Spring Awakening Spa Escape

`swan-winter-glow-spa-day` (£150) gone from [swanhotel.com/spa/](https://www.swanhotel.com/spa/). One new package on the page structurally matches (tier 3 — suggestion only, **not applied**):

> "Spring Awakening Spa Escape — £150 per person. Choice of any £65 treatment, glass of Prosecco, pub lunch or afternoon tea, full use of the riverside spa."

Match evidence: same £150, same shape (1 treatment + fizz + meal choice + thermal access), same all-week availability, appeared where Winter Glow vanished.
**Action:** if this is the seasonal successor, apply the rename manually (or re-run with `--accept-successor swan-winter-glow-spa-day`); the rename policy then re-slugs the id, rewrites mechanical refs, and flags prose refs in a follow-up commit.

## 🏷 Promo codes seen (evidence only — data keeps list price)

- **Lodore Falls**: "Black Friday early access — 20% off spa days with code SAVE20" shown site-wide. List prices stored above; discount **not** applied to data.

## ❌ Not fetched (1 spa) — entries untouched ▶

| Spa | Passes | Source | Error |
| --- | --- | --- | --- |
| Macdonald Old England (6) | 6 | [macdonaldhotels.co.uk/old-england/…/spa/days](https://www.macdonaldhotels.co.uk/old-england/spa-leisure/spa/days) | HTTP 403 (bot protection), 2 retries |

These 6 entries are excluded from this run: no price checks, `lastVerified` left at 2026-01-22. Re-try with the Playwright fallback or verify manually, then re-run `/refresh-day-passes --spa 6`.

## ✅ Verified unchanged (99 passes, 13 spas) ▶

Source price matched stored price; `lastVerified → 2026-07-25` for all 99 (this is most of the diff's line count). Sample evidence retained per spa:

<details>
<summary>Per-spa confirmation (13 spas)</summary>

- **Beech Hill (4/4)** — "Rejuvenate Spa Day £140 · Relax Spa Day £115 · Spa Access £45" matches, [beechhillhotel.co.uk/spa/](https://www.beechhillhotel.co.uk/spa/)
- **Lodore Falls (2/5)** — Twilight Spa £75 matches; (2 changed above, 1 dead URL flagged in a prior run)
- **Grange (2/2)** — £25 (+£15 food credit) & £59 match
- **Another Place (2/2)** — Swim Club £110 & Swim and Dine £60 match
- **Lakeside (6/6)** — via booking portal ([onejourney](https://lakesidehotel.onejourney.travel/)): all match
- … *(mock truncates; real PR lists all 13)*

</details>

## Diff summary

| | |
| --- | --- |
| Price fields changed | 4 (3 entries) |
| Entries deleted / added | 0 / 0 |
| `lastVerified` bumps | 102 (99 unchanged + 3 changed) |
| Human actions queued | 2 ⚠️ flags, 1 fetch failure |
