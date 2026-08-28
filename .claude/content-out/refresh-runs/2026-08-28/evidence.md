# Day-pass refresh — evidence (run 2026-08-28)

Full per-pass quote set (PRD §5). Not a sample.

## Swan Hotel Spa (spa 5) — Holte Spa

| | |
| --- | --- |
| Source | `https://api.onejourney.travel/165/spa-packages/en` |
| Fetch tier | `portal-onejourney-api` — **MIGRATED THIS RUN** from `html` (see tier note below) |
| Artifact | `spa-5.json` — HTTP 200, 8,468 bytes, 11 packages |
| Fetch log | `spa-5-fetch-log.json` |
| Gate results | `spa-5-gate-results.json` |
| Checks | `spa-5-checks.json` |
| Withdrawal ledger | `spa-5-withdrawal-candidates.json` — 0 candidates |
| Fetched at | 2026-08-28 20:08 BST |
| Grounded | 7 / 8 |
| Flagged | 1 / 8 |
| Matching | 8/8 at **tier 1** (booking-item id). No tier-3 suggestions, no missing flags. |
| Availability probe | 14-day window, all 8 items reachable, `anyProbeFailed: false` |

### Tier migration (html → portal-onejourney-api)

Swan was listed as `html` tier, with prices expected on `https://www.swanhotel.com/spa/`.
That page was fetched first (`swan-page-full.html`, HTTP 200, 356,587 bytes — working file, not committed;
log kept as `spa-5-html-page-fetch-log.json`). It carries only **three** of the eight packages,
and one of those three is stale:

- `Summer Glow Spa Escape` £150 — agrees with the portal.
- `Champagne & Truffle Spa Day` £150 — agrees with the portal.
- `Thermal Access & Afternoon Tea` **£65** — the booking engine charges **£79**. The marketing page is out of date.
- The remaining five packages do not appear on the page at all.

Staying on `html` would therefore have flagged 5/8 passes every run forever and re-verified one price
a customer cannot actually pay. Migration authorised by Matthew before any data was touched
(SKILL: "switching tier is a deliberate migration, not a silent one").

`theswan` tenant also server-renders (the Appleby SSR route works), but the JSON API route was chosen:
one 8.5 KB artifact instead of 8 page fetches (~1 MB) and no trim/bundle step, plus gate 6 bookability.
`propertyId` = **165**, read from the storefront payload (`"property":{"id":165`).

### 🚨 Do not trust the marketing page's booking links

The `Book` buttons on `swanhotel.com/spa/` are **mislinked** and must never be used as booking-item evidence:

| Button label on page | href points at | that item is actually |
| --- | --- | --- |
| Book Summer Glow | `/spa/days/` (no item id) | — |
| Book Champagne &amp; Truffle | `/spa/days/4204` | **Summer Glow Spa Escape** |
| Book Thermal Access &amp; Afternoon Tea | `/spa/days/4203` | **Champagne And Truffle Spa Day** |

Keying tier-1 matching on those hrefs would have renamed `swan-winter-glow-spa-day` into
"Champagne And Truffle Spa Day" straight across the £150/£150 price tie, and orphaned the real
Champagne & Truffle pass. Matching was keyed on the **stored `bookingUrl` item ids** instead,
which the API catalogue confirms are correct.

### PRD §7 prediction — VERIFIED FALSE

PRD §7 and the normative mock PR predicted `swan-winter-glow-spa-day` (£150) was **withdrawn**,
with "Spring Awakening Spa Escape" (£150) as a structural successor. Neither holds:

- Booking item **4204 is live**, priced £150, bookable on 13 of 14 probed days.
- Its name is now **"Summer Glow Spa Escape"** — not "Spring Awakening Spa Escape". No package of that name exists in the catalogue.
- Because the item id is unchanged, this matched at **tier 1 as a rename**, not as a tier-3 successor.
  `classifySuccessors` returned `successors: []` — correctly, since there was no vanished pass to pair.

A rename is never a withdrawal (withdrawal condition 3). Nothing was deleted.

### Day-of-week reorganisation (the two evening passes)

The two evening passes were not simply renamed — the products behind them were **reorganised**,
and the day coverage crossed over relative to our slugs:

| Booking item | Was, in our data | Is now, at source | Bookable days (probe) |
| --- | --- | --- | --- |
| 14258 | `…-weekday`, "Twilight Session", £35, Mon–Thu | "Holte Socials Night - Friday", £59 | **Fri only** (1/14) |
| 3865 | `…-weekend`, "Twilight Sessions", £55, Sat–Sun | "Holte After Hours - Sunday - Thursday", £59 | **Sun–Thu** (10/14) |
| 19088 | *(not in our data)* | "Holte Socials Night - Saturday", £69 | **Sat only** (2/14) |

Two independent sources agree on the days: the package **names**, and the **availability probe**
(item 3865 returned slots on Sun/Mon/Tue/Wed/Thu only across the 14-day window — no Fri, no Sat;
item 14258 returned Fri only). The days are evidence, not inference.

Matthew authorised a **wider edit than a refresh normally permits** for these two passes
(`daysAvailable`, `included`, `description` in addition to price/name), so that name, days and
contents tell the same story. Labelled **human-authorised** — this is not the refresh rule firing.
Boolean flags (`treatmentsIncluded` etc.) and `spaDuration` were deliberately left untouched,
as they drive site filtering and the source does not clearly evidence a change.

### Per-pass evidence

#### `swan-summer-glow-spa-escape`

- **Rename APPLIED:** `swan-winter-glow-spa-day` → `swan-summer-glow-spa-escape`
  - packageName: "Winter Glow Spa Day" → "Summer Glow Spa Escape"
- Matched at **tier 1** (booking item `4204`)
- Stored £150 → source £150 — **unchanged**
- Arithmetic: `pence` — quoted figure `15000` = £150 × 100
- Bookability: 13/14 days with slots

> ```json
> "name": "Summer Glow Spa Escape",
>       "image": {
>         "externalKey": "69c6f5a97ee3dc31041d6197a2cd2f5c",
>         "url": "https://hcommerce-live.s3.amazonaws.com/69c6f5a97ee3dc31041d6197a2cd2f5c.jpg"
>       },
>       "price": {
>         "amount": 15000
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- ✅ Verified unchanged; `lastVerified` bumped to 2026-08-28.

#### `swan-champagne-truffle-spa-day`

- Matched at **tier 1** (booking item `4203`)
- Stored £150 → source £150 — **unchanged**
- Arithmetic: `pence` — quoted figure `15000` = £150 × 100
- Bookability: 13/14 days with slots

> ```json
> "name": "Champagne And Truffle Spa Day",
>       "image": {
>         "externalKey": "c2aa30c6e00cdcb607a77dbd3323970b",
>         "url": "https://hcommerce-live.s3.amazonaws.com/c2aa30c6e00cdcb607a77dbd3323970b.jpg"
>       },
>       "price": {
>         "amount": 15000
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- ✅ Verified unchanged; `lastVerified` bumped to 2026-08-28.

#### `swan-thermal-access-afternoon-tea`

- **Rename FLAGGED ONLY — not applied:** "Thermal Access and Afternoon Tea" → "2 hour spa access and Afternoon Tea" (id and packageName left unchanged)
- Matched at **tier 1** (booking item `3687`)
- Stored £65 → source £79 — movePct **+21.5%**
- Arithmetic: `pence` — quoted figure `7900` = £79 × 100
- Bookability: 13/14 days with slots

> ```json
> "name": "2 hour spa access and Afternoon Tea",
>       "image": {
>         "externalKey": "9152726096792b46ad8864c815b71d1f",
>         "url": "https://hcommerce-live.s3.amazonaws.com/9152726096792b46ad8864c815b71d1f.jpg"
>       },
>       "price": {
>         "amount": 7900
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- 💷 Price applied; `lastVerified` bumped to 2026-08-28.

#### `swan-holte-socials-night-friday`

- **Rename APPLIED (human-authorised):** `swan-twilight-sessions-weekday` → `swan-holte-socials-night-friday`
  - packageName: "Twilight Session" → "Holte Socials Night - Friday"
- Matched at **tier 1** (booking item `14258`)
- Stored £35 → source £59 — movePct **+68.6%**
- Arithmetic: `pence` — quoted figure `5900` = £59 × 100
- Bookability: 1/14 days with slots

> ```json
> "name": "Holte Socials Night - Friday",
>       "image": {
>         "externalKey": "8e842aae2be4f9e7e8de464c3beb9dc8",
>         "url": "https://hcommerce-live.s3.amazonaws.com/8e842aae2be4f9e7e8de464c3beb9dc8.webp"
>       },
>       "price": {
>         "amount": 5900
> ```

- ⚠️ **Gate 5 DEMOTED — `move-exceeds-40pct`** (movePct 68.6).
- **No data change, no `lastVerified` bump.** `priceGBP` remains £35 and `lastVerified` remains 2026-01-22.
- The +68.6% move is real, not a bad extraction: the booking item was repurposed from a
  £35 Mon–Thu "Twilight Session" to a £59 Friday "Holte Socials Night". Gate 5 is doing its job —
  a plausibility gate cannot tell a repriced pass from a replaced one, so it correctly refuses.
- Per the iron rule, a demotion is a review item, never a retry. The quote was **not** re-cut.

#### `swan-holte-after-hours-sunday-thursday`

- **Rename APPLIED (human-authorised):** `swan-twilight-sessions-weekend` → `swan-holte-after-hours-sunday-thursday`
  - packageName: "Twilight Sessions" → "Holte After Hours - Sunday - Thursday"
- Matched at **tier 1** (booking item `3865`)
- Stored £55 → source £59 — movePct **+7.3%**
- Arithmetic: `pence` — quoted figure `5900` = £59 × 100
- Bookability: 10/14 days with slots

> ```json
> "name": "Holte After Hours - Sunday - Thursday",
>       "image": {
>         "externalKey": "32f2907d126687c20ffbdc220c9d2826",
>         "url": "https://hcommerce-live.s3.amazonaws.com/32f2907d126687c20ffbdc220c9d2826.jpg"
>       },
>       "price": {
>         "amount": 5900
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- 💷 Price applied; `lastVerified` bumped to 2026-08-28.

#### `swan-treatment-thermal-package`

- Matched at **tier 1** (booking item `11200`)
- Stored £125 → source £114 — movePct **-8.8%**
- Arithmetic: `pence` — quoted figure `11400` = £114 × 100
- Bookability: 12/14 days with slots

> ```json
> "name": "Treatment & Thermal Package",
>       "image": {
>         "externalKey": "66867885ec3a1059296bea05b773463c",
>         "url": "https://hcommerce-live.s3.amazonaws.com/66867885ec3a1059296bea05b773463c.jpg"
>       },
>       "price": {
>         "amount": 11400
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- 💷 Price applied; `lastVerified` bumped to 2026-08-28.

#### `swan-full-works-spa-day`

- Matched at **tier 1** (booking item `16080`)
- Stored £225 → source £225 — **unchanged**
- Arithmetic: `pence` — quoted figure `22500` = £225 × 100
- Bookability: 13/14 days with slots

> ```json
> "name": "The Full Works Holte Spa Day",
>       "image": {
>         "externalKey": "0507415bfa66c71150bdcc5645684002",
>         "url": "https://hcommerce-live.s3.amazonaws.com/0507415bfa66c71150bdcc5645684002.png"
>       },
>       "price": {
>         "amount": 22500
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- ✅ Verified unchanged; `lastVerified` bumped to 2026-08-28.

#### `swan-holte-restorative-ritual`

- Matched at **tier 1** (booking item `16077`)
- Stored £225 → source £225 — **unchanged**
- Arithmetic: `pence` — quoted figure `22500` = £225 × 100
- Bookability: 13/14 days with slots

> ```json
> "name": "The Holte Restorative Ritual",
>       "image": {
>         "externalKey": "f95b45decac3c3e268f459ca78ffed8f",
>         "url": "https://hcommerce-live.s3.amazonaws.com/f95b45decac3c3e268f459ca78ffed8f.png"
>       },
>       "price": {
>         "amount": 22500
> ```

- ✅ **Gate: grounded** (gates 1–6 all pass).
- ✅ Verified unchanged; `lastVerified` bumped to 2026-08-28.

### ℹ️ Unmatched fetched (discovery — out of scope, no data added)

| Item | Name | Price | Bookable days |
| --- | --- | --- | --- |
| 3473 | Spa Party Nights! | £65 | **0/14 — not bookable at all** |
| 19088 | Holte Socials Night - Saturday | £69 | 2/14 (Sat only) |
| 19482 | Wellness Wednesday | £34.50 | 2/14 (Wed only) |

Adding passes is out of scope for a refresh (PRD §1). Noted only. `Spa Party Nights!` is listed and
priced but has **no bookable date in the 14-day window** — the exact "phantom price" case gate 6 exists
to catch; it is not one of ours, so nothing was flagged for it.

### check-invariant

```
node scripts/check-invariant.mjs .claude/content-out/refresh-runs/2026-08-28 2026-08-28 5
{ "runDate": "2026-08-28", "ok": true,
  "report": [ { "spaId": "5", "fetched": true, "passes": 8, "withdrawn": 0, "violations": [] } ] }
```
**0 violations.** Stale `lastVerified` set = exactly the flagged set = { `swan-holte-socials-night-friday` }.


### ⚠️ Prose flags — NOT rewritten (PRD §4: prose is flagged, never auto-edited)

The day reorganisation makes several **prose** statements factually wrong. Mechanical references
(id literals, `#anchor` fragments) were rewritten; readable prose was not. Every item below needs a
human copy edit and is **not** fixed by this PR:

| File:line | Says | Why it is now wrong |
| --- | --- | --- |
| `src/data/faqs/spa-5-faqs.tsx:44` | "weekday twilight sessions (Monday through Thursday, 6pm to 8pm)" | That booking item is now **Friday only** |
| `src/data/faqs/spa-5-faqs.tsx:82` | fallback `{twilightWeekdayPrice \|\| '£35'}` | Real price is £59 |
| `src/data/faqs/spa-5-faqs.tsx:87` | link text "Twilight Session" | Package is now "Holte Socials Night - Friday" |
| `src/data/faqs/spa-5-faqs.tsx:105` | link text "Winter Glow Spa Day" | Package is now "Summer Glow Spa Escape" |
| `src/data/faqs/spa-5-faqs.tsx:125` | `schemaText` — fallbacks `'£35'`, `'£55'`, `'£65'`, name "Winter Glow Spa Day", and the claims "Monday through Thursday" / "Saturday and Sunday" | Prices are now £59/£59/£79; name changed; both day claims wrong |
| `src/data/location-faqs/newby-bridge-faqs.tsx:181` | link text "Twilight Session" | Renamed |
| `src/data/location-faqs/newby-bridge-faqs.tsx:183` | "starts from £35 … on weekday evenings" | £59, and Friday only |
| `content/blog/spa-resort-couples-getaway.mdx:36` | "Twilight Session … for a weekday slot (Monday to Thursday, 6pm to 8pm)" | Renamed; Friday only |

🚨 **Why this matters more than it looks.** `getDayPassPrice` returns `null` for an unknown id and
every call site falls back to a hardcoded literal (`{twilightWeekdayPrice || '£35'}`). Those
fallbacks do **not** fail a build or a test — they silently render a stale price. The mechanical
rewrites below keep the live lookups working, so the fallbacks stay dormant; but the hardcoded
day-of-week claims are plain text and are wrong on the live site **today**.

### 🚨 Reference-scan blind spot (issue 14) — CONFIRMED AND WIDER THAN DOCUMENTED

`rename.mjs` rewrites references in only two trees:

```
content/blog/**/*.mdx
src/data/faqs/**/*.tsx
```

`withdraw.mjs` scans three (it adds `src/data/location-faqs/**`). **Neither scans `src/app/**` or
`src/components/**`.** So the two scripts disagree about what counts as a reference, and
`rename.mjs` is the narrower of the two — a gap not recorded in issue 14, which describes only the
`src/app` / `src/components` blind spot.

This bit on this run. After renaming `swan-twilight-sessions-weekday`, two live references were
left dangling, both invisible to `rename.mjs`:

| File:line | Reference | Fixed |
| --- | --- | --- |
| `src/data/location-faqs/newby-bridge-faqs.tsx:21` | `getDayPassPrice(swan.id, 'swan-twilight-sessions-weekday')` | ✅ by hand |
| `src/data/location-faqs/newby-bridge-faqs.tsx:178` | `#swan-twilight-sessions-weekday` anchor | ✅ by hand |

Both were repointed at `swan-holte-socials-night-friday` manually. Had they been missed, the FAQ
would have silently fallen back to a hardcoded `'£35'` and linked to an anchor that no longer
exists — no build error, no test failure.

`src/app/**` also holds two Swan references, found by a hand grep:

- `src/app/page.tsx:37` → `'swan-champagne-truffle-spa-day'`
- `src/app/couples-spa-lake-district/page.tsx:32` → `'swan-champagne-truffle-spa-day'`

Both survive this run **only because that pass was not renamed**. Had the afternoon-tea-style
rename been applied to it, they would have broken silently. `withdraw.mjs` was **not** modified
(issue 14 stays open, as instructed).

### 🏷 Promo notes — list prices only, no promo price extracted

The marketing page advertises book-direct discounts, none of which entered the data:

- `SPADAY20` — 20% off selected spa days, Sunday–Thursday
- `THERMAL10` — 10% off thermal access
- `TREAT15` — 15% off treatments

The API catalogue carries list prices only, so no promo could contaminate a quote. Separately,
item 3865's own description calls £59 "an introductory price" — £59 is nonetheless the list price
in the catalogue (`"amount": 5900`) and is what was stored.

**Gate 3 poison check:** all 8 quotes passed gate 3. The demotion was gate 5 (plausibility), which
runs *after* gate 3 — so the Friday pass cleared the poison scan too. No quote was re-cut.

### Test-suite note

No Swan price is pinned as a literal in `src/data/priced-content.test.ts`, so the four price moves
required no test edit. `npm test` — **839 passed, 48 files**. `npm run typecheck` — clean.
(`npm run lint` is broken repo-wide on `main`, pre-existing, untouched.)
