# Day-pass refresh — 2026-08-27

Scope: `--spa 1` (Lodore Falls Hotel Spa) and `--spa 4` (The Daffodil Hotel & Spa), run separately.
Full per-pass quote set (PRD §5).

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

## The Daffodil Hotel & Spa (4) — html tier

- Source: seven per-pass `dayPassUrl`s on `www.crerarhotels.com` (10 passes behind 7 URLs — see
  fan-out note below)
- Artifact: `spa-4.html` — trimmed bundle of the 5 pages that fetched, 26,373 B
  (301,308 B full → **91.2% smaller**, 10/10 gate verdicts identical, `trim-artifact.mjs` exit 0)
- Fetch log: `spa-4-fetch-log.json` — array of 12 per-page logs (10 × HTTP 200, 2 × HTTP 404).
  Five pages are the committed artifact; two are the withdrawn 404s; five are corroboration-only
  working files (offers index + four offers we do not carry).
- Matching: `spa-4-match.json` · Checks: `spa-4-checks.json` · Gate: `spa-4-gate-results.json`
- Fetched: 2026-08-27 20:04 BST
- **5 grounded / 5 flagged.** **0 price changes**, 5 verified unchanged, 0 renames applied.

Previous `lastVerified` was `2026-01-22` on nine passes and `2026-03-20` on the Mud Rasul.

### Matching note — tier 1 keyed on `dayPassUrl`, with synthetic fan-out keys

Daffodil books by **email**, not through a booking portal, so no pass carries a `bookingUrl` for
tier 1 to key on. As with Lodore, the pass's own source page is its stable identity, so
`dayPassUrl` was supplied as the tier-1 key on **both** the `existing` and `fetched` sides.

Three of those URLs are shared by **two** passes each — a weekday and a weekend variant of one
item:

| Shared `dayPassUrl` | Passes |
| --- | --- |
| `/wellness/the-spa/` | `daffodil-spa-facilities-weekday` (£35) · `-weekend` (£45) |
| `/offers/it-s-all-good-spa-day/` | `daffodil-its-all-good-weekday` (£170) · `-weekend` (£180) |
| `/offers/do-not-disturb-spa-day/` | `daffodil-do-not-disturb-weekday` (£185) · `-weekend` (£195) |

Tier-1 matching is strictly 1:1, so a shared key would match only ONE pass of each pair and orphan
the other as a false `missingFlag`. Resolved **in the caller, not by changing `matching.mjs`**
(the pattern SKILL.md prescribes for the try.be fan-out): a synthetic per-variant key
(`<real-url>-weekday` / `-weekend`, derived from each pass's `daysAvailable`) was built on both
sides. The real URL is retained in `_realUrl` for evidence and is what this file and the PR cite.

Result: `Spa Facilities` matched honestly as two distinct variants (both grounded, no orphan), and
the four withdrawn passes flagged individually rather than two-of-four being masked by a spurious
match.

### 🚨 Fan-out rename guard — asserted, not needed this run

**Fan-out passes must never auto-apply a rename.** The source `name` describes the *item*, which
spans both variants, while our id carries a weekday/weekend distinction the source does not have;
`planRename` would return `applied: true` with the **same** `newId` for both halves, silently
minting duplicate ids. This is unfixed in code — see
`.scratch/day-pass-refresh/issues/12-fanout-rename-guard.md`.

The guard did not have to fire here: `matchPasses` returned `rename: null` on **all six** tier-1
matches, because every source `<h1>`/`<h2>` matches our stored `packageName` exactly
(`Spa Facilities`, `Afternoon Bliss`, `Simply Spa Time`, `Mud Rasul & Spa Access for Two`,
`Twilight Spa`). **No rename was applied to any pass, fan-out or otherwise**, and
`rename.mjs` was never invoked. Recorded here so the absence is verifiable rather than assumed.

### 💷 Mud Rasul — the honest arithmetic case

`daffodil-mud-rasul-spa-for-two` stores `priceGBP: 125` with `pricePerPerson: 62`. Since
62 × 2 = **124**, not 125, `arithmetic: "per-couple"` would fail gate 1 with
`arithmetic-mismatch` — it demands `quotedFigure × 2 === figureGBP`.

The source resolves this: it shows **"Book now from £125.00 per couple"** — a *group total*, stated
directly, with **no per-person figure anywhere on the page**. So the honest case is
`arithmetic: "none"` with `figureGBP: 125`, which is what the gate proved (the span literally
contains `£125.00`). `per-couple` is for the opposite shape — a source that quotes per-person
while we store the total.

⚠️ **`pricePerPerson: 62` is therefore an un-sourced derived field.** The true half of £125 is
£62.50; 62 is our own rounding, and the source publishes nothing to verify it against. It was
**left untouched** (the iron rule limits the diff to figures the source actually moved, and £125 did
not move). Flagging it rather than reconciling it — worth a human decision on whether to store
62.50, or drop the field for this pass.

### ℹ️ Non-exclusive span — `daffodil-spa-facilities-weekend`

Both facilities prices sit in consecutive `<p><strong>` lines under one `<h2>Spa Facilities</h2>`,
so the weekend span (h2 → the £45 line) necessarily contains the £35 weekday line too. Gate 1 proves
the **claimed** figure (£45) is present, which is the right claim, but the span is not exclusive —
the same caveat SKILL.md records for try.be `highPrice` spans. The weekday span (h2 → the £35 line)
*is* exclusive. Noted for review.

### `daffodil-spa-facilities-weekday` — Spa Facilities

Tier 1 match, no rename. **£35 → £35 (unchanged, 0%)** · `arithmetic: "none"`

```html
<h2>Spa Facilities</h2>
				<div class="rte-standard">
					<p>Here at the Daffodil Hotel &amp; Spa, all our guests and those enjoying one of our Spa Day packages receive complimentary access to our spa facilities.</p>
<p>Visitors who aren’t staying with us are also welcome to book access to our facilities during select hours:</p>
<p><strong>Monday - Thursday, 10am to 4pm; £35 per person for 3 hours use</strong></p>
```

Source: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/wellness/the-spa/

Gate: **grounded**. `lastVerified` → 2026-08-27.

### `daffodil-spa-facilities-weekend` — Spa Facilities

Tier 1 match, no rename. **£45 → £45 (unchanged, 0%)** · `arithmetic: "none"`

```html
<h2>Spa Facilities</h2>
				<div class="rte-standard">
					<p>Here at the Daffodil Hotel &amp; Spa, all our guests and those enjoying one of our Spa Day packages receive complimentary access to our spa facilities.</p>
<p>Visitors who aren’t staying with us are also welcome to book access to our facilities during select hours:</p>
<p><strong>Monday - Thursday, 10am to 4pm; £35 per person for 3 hours use</strong></p>
<p><strong>Friday - Sunday (and bank holidays), 10am - 4pm; £45 per person for 3 hours use</strong></p>
```

Source: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/wellness/the-spa/

Gate: **grounded**. `lastVerified` → 2026-08-27.

### `daffodil-afternoon-bliss` — Afternoon Bliss

Tier 1 match, no rename. **£70 → £70 (unchanged, 0%)** · `arithmetic: "none"`

```html
<h1>Afternoon Bliss</h1>



                    <div class="explore-line --breakout"></div>

            </div>
            <div class="hero-image_forward">
            </div>
        </div>
    </div>
</section>






<section class="intro-block py-3 " data-ui-component="introBlock">
	<div class="intro-block_inner">



			<h2>Escape to a haven of relaxation.</h2>


			<div class="rte-standard">
				<p style="text-align: center;" dir="ltr">Escape to a haven of relaxation with an Afternoon Bliss Spa Day. Enjoy three hours of full access to our serene spa facilities, including the soothing hydrotherapy pool, invigorating sauna, and aromatic steam room. Savour a delectable full afternoon tea in our lake view Dining Room, perfectly complementing your day of indulgence. To complete your experience, receive 10% off any additional treatment booked for the same day, from rejuvenating massages to revitalising facials. Available between 9 am and 4 pm, daily.</p>
<p style="text-align: center;" dir="ltr"><strong>From £70.00 per person</strong></p>
```

Source: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/afternoon-bliss/

Gate: **grounded**. `lastVerified` → 2026-08-27.

### `daffodil-simply-spa-time` — Simply Spa Time

Tier 1 match, no rename. **£60 → £60 (unchanged, 0%)** · `arithmetic: "none"`

```html
<h1>Simply Spa Time</h1>



                    <div class="explore-line --long"></div>

            </div>
            <div class="hero-image_forward">
            </div>
        </div>
    </div>
</section>






<section class="intro-block py-3 " data-ui-component="introBlock">
	<div class="intro-block_inner">



			<h2>Escape the Stresses of Everyday Life</h2>


			<div class="rte-standard">
				<p style="text-align: center;">Indulge in some well-deserved “you time” at the Daffodil Spa with our 2-hour Thermal Experience.</p>
<p style="text-align: center;">Enjoy full access to our luxurious spa facilities, including the hydrotherapy pool, sauna, steam room, and tranquil relaxation lounge, with complimentary robes, towels, and flip flops for your comfort. After your time in the spa, savour a delicious two-course lunch in the Dining Room Restaurant, completing a perfect day of relaxation and indulgence. Available daily between 10:00 am and 3:00 pm.</p>
<h4 style="text-align: center;">Book now from £60.00 per person</h4>
```

Source: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/simply-spa-time/

Gate: **grounded**. `lastVerified` → 2026-08-27.

### `daffodil-mud-rasul-spa-for-two` — Mud Rasul & Spa Access for Two

Tier 1 match, no rename. **£125 → £125 (unchanged, 0%)** · `arithmetic: "none"`

```html
<h1>Mud Rasul &amp; Spa Access for Two</h1>



                    <div class="explore-line --long"></div>

            </div>
            <div class="hero-image_forward">
            </div>
        </div>
    </div>
</section>






<section class="intro-block py-3 " data-ui-component="introBlock">
	<div class="intro-block_inner">


			<div class="overline">Available 10 am - 4 pm</div>

			<h2>Traditions rooted in the Middle East come to life with the Mud Rasul, a self-administered treatment.</h2>


			<div class="rte-standard">
				<p style="text-align: center;">Nourishing mineral muds are provided for you to apply to your face and body, while a gentle stream of steam drifts into your relaxing Rasul chamber. As the warm mist softens the skin and eases tension, the muds work their magic, before a tropical monsoon-like drenching of warm water allows you to rinse away the clays – leaving skin nourished, hydrated, and super soft.</p>
<p style="text-align: center;"><strong>Book now from £125.00 per couple</strong></p>
```

Source: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/mud-rasul-and-spa-access-for-two/

Gate: **grounded**. `lastVerified` → 2026-08-27.

### ⚠️ `daffodil-twilight-spa` — Twilight Spa

Tier 1 match, no rename. **£40 → £40 (unchanged, 0%)** · `arithmetic: "none"`

```html
<h1>Twilight Spa</h1>



                    <div class="explore-line --standard"></div>

            </div>
            <div class="hero-image_forward">
            </div>
        </div>
    </div>
</section>






<section class="intro-block py-3 " data-ui-component="introBlock">
	<div class="intro-block_inner">



			<h2>Unwind after a long day with our Twilight Spa, a sparkling escape designed for pure relaxation.</h2>


			<div class="rte-standard">
				<p style="text-align: center;">Enjoy two hours of full access to our tranquil spa facilities, including the hydrotherapy pool, sauna, steam room, and peaceful relaxation lounge, with complimentary robes, towels, and flip flops for your comfort. Sip a glass of Prosecco and enjoy as you melt away the day’s stresses. To make your experience even more indulgent, receive a £10 Temple Spa voucher to spend in our retail area. Available between 4 pm and 7:45 pm</p>
<h4 style="text-align: center;">Book now from £40.00 per person</h4>
```

Source: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/twilight-spa-offer/

Gate: **demoted at gate 3 — `poison-word:voucher`** (poison words: `voucher`). **No data change, no `lastVerified` bump.**

### ⚠️ `daffodil-its-all-good-weekday` — It's All Good Spa Day

Source page **HTTP 404**: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/it-s-all-good-spa-day/

Stored £170. No quote exists to take, so the check carries an empty quote and gate 1 demotes it with **`empty-quote`**. **No data change, no `lastVerified` bump** — it stays at `2026-01-22`.

### ⚠️ `daffodil-its-all-good-weekend` — It's All Good Spa Day

Source page **HTTP 404**: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/it-s-all-good-spa-day/

Stored £180. No quote exists to take, so the check carries an empty quote and gate 1 demotes it with **`empty-quote`**. **No data change, no `lastVerified` bump** — it stays at `2026-01-22`.

### ⚠️ `daffodil-do-not-disturb-weekday` — Do Not Disturb Spa Day

Source page **HTTP 404**: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/do-not-disturb-spa-day/

Stored £185. No quote exists to take, so the check carries an empty quote and gate 1 demotes it with **`empty-quote`**. **No data change, no `lastVerified` bump** — it stays at `2026-01-22`.

### ⚠️ `daffodil-do-not-disturb-weekend` — Do Not Disturb Spa Day

Source page **HTTP 404**: https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/offers/do-not-disturb-spa-day/

Stored £195. No quote exists to take, so the check carries an empty quote and gate 1 demotes it with **`empty-quote`**. **No data change, no `lastVerified` bump** — it stays at `2026-01-22`.

### 🏷 Promo notes

- **`/offers/twilight-spa-offer/`** — the Twilight package bundles a **£10 TEMPLESPA product
  voucher (minimum spend £40)**. That is an *inclusion*, not a discount on the pass; the list price
  £40.00 is what was read. It is also what poisons the span — see below.
- **`/offers/afternoon-bliss/`** — the page offers **10% off any additional treatment booked for
  the same day**. A discount on a *separate* purchase, not on the £70 pass. Not extracted.
- **`/wellness/the-spa/`** — site-wide **"Early Bird … save up to 20% off your stay"** banner
  (56-day advance booking). A *stay* promo, unrelated to day passes, and ~17,000 characters away
  from the price spans — far outside gate 3's ±200-char window. Not extracted, did not poison.

Promo prices are never extracted (PRD §3): every figure above is the list price.

### ⚠️ Gate 3 genuinely poisoned one span — `daffodil-twilight-spa`

This is not a near-miss; it is a real demotion, and it is unavoidable rather than a bad quote
choice. On the normalized artifact:

| Token | Offset |
| --- | --- |
| `<h1>Twilight Spa</h1>` (nearest name occurrence before the price) | 38,279 |
| `voucher` ("receive a £10 Temple Spa **voucher**") | 38,760 |
| `£40.00` (the only occurrence on the page) | 38,882 |

The poison word sits **between** the pass name and the price, so **every** contiguous span
satisfying gate 2 (name AND price in one span) must contain `voucher` — there is no span that
grounds the price without it. `£40.00` appears exactly once, so there is no alternative
occurrence to quote either.

Per the iron rule, a demotion is a review item and never a retry: the quote was **not** re-cut to
dodge the gate. `daffodil-twilight-spa` keeps `priceGBP: 40` and its stale
`lastVerified: '2026-01-22'`. **For the record, the source price today is £40 — identical to what
we store** — so this is a verification failure, not a suspected price error.

### ⚠️ It's All Good / Do Not Disturb appear withdrawn, not moved

Both `dayPassUrl`s return a hard **HTTP 404** (three attempts each, `botBlocked: false`, so the
Playwright fallback does not apply — it is for 403s). Neither is a bot-block or a transient error.

The spa's own offers index (`/offers/`) currently links 13 offers, and **neither package is among
them**:

```
/offers/afternoon-bliss/          /offers/prosecco-afternoon-tea/
/offers/autumn-indulgence/        /offers/seasonal-getaway/
/offers/daffodil-spa-escape/      /offers/simply-spa-day/
/offers/early-bird/               /offers/stay-and-save/
/offers/festive-breaks/           /offers/tour-de-france-early-booker/
/offers/gift-vouchers/            /offers/twilight-spa-offer/
/offers/mud-rasul-and-spa-access-for-two/
```

`classifySuccessors` returned **`successors: []`** — correctly. The strict-1:1 rule needs the
leftover pool to be exactly one vanished pass and one unmatched fetched pass; here there are **four**
vanished and **zero** unmatched, so all four demote to plain `missingFlags` with no guessed pairing.

To be sure they had not simply moved, the three offers on the index we do not carry were fetched and
read. None is a day pass:

| Offer | What it actually is |
| --- | --- |
| `daffodil-spa-escape` | **overnight stay** — £242 per person, includes dinner (£40 credit), cocktail, breakfast |
| `prosecco-afternoon-tea` | afternoon tea, £40.00 pp — **no spa access**: 0 mentions of spa access, hydrotherapy or sauna |
| `autumn-indulgence` | stay offer — **no price on the page at all** |

So there is no successor to suggest. All four remain in the data, flagged, with stale
`lastVerified` — removing entries is forbidden by the iron rule (PRD §1) and is a human decision.

### ℹ️ `simply-spa-day` is a URL alias, not a rename

The offers index links `/offers/simply-spa-day/` while we store `/offers/simply-spa-time/`, which
looks like a rename. It is not: both URLs return **byte-identical** pages (55,791 B, `diff` clean)
titled `<h1>Simply Spa Time</h1>`. Our stored URL is live and canonical-named, the package name is
unchanged, and tier 1 matched it with `rename: null`. No action taken.

### ℹ️ `£85 per couple` Mud Rasul on the spa page is a different product

`/wellness/the-spa/` advertises a **"45 minute experience, £85 per couple — Mud Rasul Treatment"**.
This is the rasul chamber *alone*. Our `daffodil-mud-rasul-spa-for-two` (£125) is the bundled
package — rasul **plus** 2-hour spa access **plus** a 2-course lunch per person — and is priced on
its own page at £125.00 per couple, which is the span quoted above. The two are easy to conflate;
the £85 was **not** used.

### ℹ️ Out-of-scope discovery

The index lists offers we do not carry (Autumn Indulgence, Daffodil Spa Escape, Prosecco Afternoon
Tea, Seasonal Getaway, Stay and Save, Early Bird, Festive Breaks, Tour de France Early Booker). Most
are stay offers. Discovery is out of scope (PRD §4); noted only.

### No test fixture changes needed

No test pins a Daffodil price. The only test-file matches for "daffodil" are synthetic fixtures
(`daffodil-discontinued-pass`) in `tests/unit/refresh-day-passes-matching.test.ts` and
`…-successor.test.ts`, unrelated to spa 4's data. The location FAQs
(`src/data/location-faqs/grasmere-faqs.tsx`, `ambleside-faqs.tsx`) read prices dynamically via
`getDayPassPrice` with display fallbacks, not assertions. Nothing to fix — and no price moved this
run in any case. `npm test`: **813 passed / 813**.

## Invariant check

```
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  ".claude/content-out/refresh-runs/2026-08-27" "2026-08-27" "1"
```

`{ "runDate": "2026-08-27", "ok": true, report: [{ spaId: "1", fetched: true, passes: 5, violations: [] }] }` — exit 0, **0 violations**.

```
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  ".claude/content-out/refresh-runs/2026-08-27" "2026-08-27" "4"
```

`{ "runDate": "2026-08-27", "ok": true, report: [{ spaId: "4", fetched: true, passes: 10, violations: [] }] }` — exit 0, **0 violations**.

All 10 Daffodil passes carry a gate verdict, including the four whose pages 404 — the invariant
requires every pass of a fetched spa to have one, so they were added to `checks.json` with an
empty quote rather than dropped from the run.
