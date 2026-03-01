# Implementation Plan — Treatment URL Mapping (Spa 19 / Underscar)

## Objective

Update every `bookingUrl` in `src/data/treatments/spa-19-treatments.ts` from the generic listing URL (`https://underscar.try.be/`) to the specific per-treatment booking URL scraped from the HTML source.

---

## Confirmed Constraints

- **Scope**: spa 19 (`spa-19-treatments.ts`) only.
- **Matching rule**: price AND duration must match exactly. Name match can be approximate (used as tiebreaker when multiple treatments share the same price + duration).
- **Spa day packages** (Harmonie, Mindfulness, etc.) and High Tea are handled by the day passes file — excluded from this task.
- **`bookingUrl` opens in a new tab** — no Next.js `<Link>` routing concerns; external `try.be` URLs are safe to use directly.
- **UTM parameters**: All outbound links open in a new tab and UTM is handled at render time — no UTM changes needed in the data file.
- **No test updates** required.
- **No structured data changes** required.

---

## Matching Strategy

Many treatments share the same price and duration (e.g. 10+ treatments at 60 min / £90). The matching logic is therefore:

1. **Filter by price + duration** to get a candidate set.
2. **If candidate set has one entry** → match confirmed; apply URL.
3. **If candidate set has multiple entries** → apply name similarity to select the correct URL. All multi-candidate groups have clearly distinct names (e.g. "So Delicate" vs "Deeply Hydrating" vs "Royal Jelly") so no ambiguity exists.

---

## Complete URL Mapping

All 39 treatments in `spa-19-treatments.ts` have a confirmed HTML match. No treatments will be left unmatched.

### Massage Therapies

| Treatment (TS name) | Duration | Price | New `bookingUrl` |
|---|---|---|---|
| Back, Neck and Shoulder Massage | 30 min | £60 | `https://underscar.try.be/items/657241c372c9e51236026536/back-neck-and-shoulder-massage` |
| Walkers Leg Massage | 30 min | £60 | `https://underscar.try.be/items/6717a47c2bdb49d01404604b/walkers-leg-massage` |
| Hot Stone Massage (30 min) | 30 min | £65 | `https://underscar.try.be/items/65761954ab7edf818601b833/hot-stone-massage-30-minutes` |
| Cinnamon Back Massage | 30 min | £65 | `https://underscar.try.be/items/657976ccbfda668acc038003/cinnamon-back-massage` |
| Indian Head Massage | 45 min | £65 | `https://underscar.try.be/items/6576182da969f2978902643d/indian-head-massage` |
| Full Body Massage | 60 min | £80 | `https://underscar.try.be/items/657229fa0ef476166505b1e6/full-body-massage` |
| Deep Tissue Massage | 60 min | £85 | `https://underscar.try.be/items/6575ecc44c7f39c7a40fe914/deep-tissue-massage` |
| Hot Stone Massage (60 min) | 60 min | £85 | `https://underscar.try.be/items/65761f432b390463510a5e4c/hot-stone-massage` |
| Cinnamon Body Massage | 60 min | £85 | `https://underscar.try.be/items/6579777a946af32b8e07c4a2/cinnamon-body-massage` |
| Aromatherapy Massage | 60 min | £90 | `https://underscar.try.be/items/6575f0ca9831c5e3940a8126/aromatherapy-massage` |
| Body Bliss Lymphatic Drainage Massage | 60 min | £90 | `https://underscar.try.be/items/684721459f4366af900baec1/body-bliss-lymphatic-drainage-massage-60-minutes` |
| Aromatherapy Massage with Face and Scalp | 90 min | £120 | `https://underscar.try.be/items/6575e9641cea580b850f1285/aromatherapy-massage-including-face-and-scalp` |

### Facial Treatments (Germaine de Capuccini)

| Treatment (TS name) | Duration | Price | New `bookingUrl` |
|---|---|---|---|
| Express Facial - So Delicate | 30 min | £65 | `https://underscar.try.be/items/6572343b93dfeca4a30caeb2/spa-prescriptive-express-facial-so-delicate` |
| Express Facial - Deeply Hydrating | 30 min | £65 | `https://underscar.try.be/items/657233fd162415b5e208ebea/spa-prescriptive-express-facial-deeply-hydrating` |
| Express Facial - Royal Jelly | 30 min | £65 | `https://underscar.try.be/items/65723421162415b5e208ebf1/spa-prescriptive-express-facial-royal-jelly` |
| Prescriptive Facial - So Delicate | 60 min | £90 | `https://underscar.try.be/items/6572317dadd962eeb2015499/spa-prescriptive-facial-so-delicate` |
| Prescriptive Facial - Deeply Hydrating | 60 min | £90 | `https://underscar.try.be/items/65722ea964493fb1df00a176/spa-prescriptive-facial-deeply-hydrating` |
| Prescriptive Facial - Royal Jelly | 60 min | £90 | `https://underscar.try.be/items/6572313ab721cc79e0029e92/spa-prescriptive-facial-royal-jelly` |
| Skin Zen Rose and Honey Harmony Facial | 60 min | £90 | `https://underscar.try.be/items/65722f1b82557d9db704d496/skin-zen-rose-honey-harmony-facial` |
| Timexpert Radiance C+ Illuminating | 60 min | £115 | `https://underscar.try.be/items/6572397be26579e09a06d842/timexpert-radiance-c-illuminating-advanced-facial` |
| Timexpert Wrink-Less Pro-Collagen | 60 min | £120 | `https://underscar.try.be/items/6888a314c9c3aaf3ff05a5c2/timexpert-wrink-less-pro-collagen-facial` |
| Timexpert Rides Neo Age Advanced | 60 min | £120 | `https://underscar.try.be/items/657239d4aaf793ea170da4c9/timexpert-rides-neo-age-advanced-therapy-facial` |
| Hydraluronic Time Expert Advanced | 60 min | £120 | `https://underscar.try.be/items/669f7a4bee0d7f237c0d5299/hydraluronic-time-expert-advanced-facial` |
| For Men - Energy Facial | 60 min | £90 | `https://underscar.try.be/items/6575f1b9f821e853f3000362/for-men-energy-facial` |

### Body Treatments

| Treatment (TS name) | Duration | Price | New `bookingUrl` |
|---|---|---|---|
| NEOM De-Stress | 60 min | £90 | `https://underscar.try.be/items/65723c5f5cba8d801a043749/neom-de-stress-1-hour` |
| NEOM Mood Boost | 60 min | £90 | `https://underscar.try.be/items/65723b3f3fca2d5435033e06/neom-mood-boost-1-hour` |
| NEOM Sleep | 60 min | £90 | `https://underscar.try.be/items/65723c827c58cb41cc0b4632/neom-sleep-1-hour` |
| Reflexology | 60 min | £90 | `https://underscar.try.be/items/65787da932db6fef3e07f172/reflexology` |
| Sperience Moments - Serenity | 90 min | £120 | `https://underscar.try.be/items/65787f8164ad6ee44701e233/sperience-moments-serenity` |
| Sperience Moments - Detox | 90 min | £120 | `https://underscar.try.be/items/6578818f26b6d404e0092ca2/sperience-moments-detox` |
| Sperience Moments - Energise | 90 min | £120 | `https://underscar.try.be/items/65788223c813f8dd42023123/sperience-moments-energise` |
| Sperience Chocolate Sensation | 60 min | £105 | `https://underscar.try.be/items/657883194abb72f05708d906/sperience-chocolate-sensation` |
| Baobab Pregnancy Treatment | 90 min | £120 | `https://underscar.try.be/items/66127a7226a698616407c2b6/baobab-pregnancy-treatment` |

### Hands & Feet

| Treatment (TS name) | Duration | Price | New `bookingUrl` |
|---|---|---|---|
| GEL Mini Manicure | 45 min | £35 | `https://underscar.try.be/items/6574ad68426ce7a75c0eb564/gel-mini-manicure` |
| GEL Mini Pedicure | 45 min | £35 | `https://underscar.try.be/items/6574af67d2b6b575bc0e5c33/gel-mini-pedicure` |
| GEL Luxury Pedicure | 75 min | £60 | `https://underscar.try.be/items/6574afd8caf7ad9a9a07856b/gel-luxury-pedicure` |
| GEL Luxury Manicure | 75 min | £60 | `https://underscar.try.be/items/6574b07455303dc25b041893/gel-luxury-manicure` |
| Aroma Hand Spa | 30 min | £55 | `https://underscar.try.be/items/6575ec34dbbb87ea850b5e9a/aroma-hand-spa` |
| Aroma Foot Spa | 30 min | £55 | `https://underscar.try.be/items/6578a64d7d2b9355570a0418/aroma-foot-spa` |

---

## Unmatched Treatments

**None.** All 39 treatments in `spa-19-treatments.ts` have a confirmed match in the HTML source.

The 8 items present in the HTML but absent from the treatments file (Harmonie/Mindfulness/Serenity/Twilight/Wellbeing/Peaceful/Reflection spa days and High Tea) are intentionally excluded — they are covered by the day passes data file and are out of scope for this task.

---

## Implementation Steps

### Step 1 — Read the current file

Read `src/data/treatments/spa-19-treatments.ts` in full to confirm the exact treatment names and object structure before making any edits.

### Step 2 — Apply URL updates

For each treatment object in the file, replace:

```ts
bookingUrl: 'https://underscar.try.be/',
```

with the specific treatment URL from the mapping table above. The change is limited to the `bookingUrl` field only — no other fields are touched.

### Step 3 — Verify

After editing, visually scan the file to confirm:
- Every `bookingUrl` value now contains a path segment (i.e. no entries still use the bare `https://underscar.try.be/`).
- The total number of treatment objects is unchanged.

### Step 4 — Run type check and tests

```bash
npm run typecheck
npm test
```

Both must pass before the task is considered complete (the pre-commit hook enforces this anyway).

---

## Notes on Ambiguous Groups

Several price + duration combinations cover multiple treatments. The name-based disambiguation for each group is listed below for reference.

**30 min / £60** (2 treatments): "Back, Neck" vs "Walkers Leg" — clearly distinct.

**30 min / £65** (4 treatments): "Hot Stone 30 min", "Cinnamon Back", "Express Facial So Delicate", "Express Facial Deeply Hydrating", "Express Facial Royal Jelly" — variant names clearly distinguish each.

**60 min / £85** (3 treatments): "Deep Tissue", "Hot Stone", "Cinnamon Body" — clearly distinct.

**60 min / £90** (10 treatments): "Aromatherapy", "Body Bliss", "Prescriptive So Delicate", "Prescriptive Deeply Hydrating", "Prescriptive Royal Jelly", "Skin Zen", "For Men", "NEOM De-Stress", "NEOM Mood Boost", "NEOM Sleep", "Reflexology" — all clearly distinct by name.

**60 min / £120** (3 treatments): "Wrink-Less", "Rides Neo Age", "Hydraluronic" — clearly distinct.

**75 min / £60** (2 treatments): "Luxury Manicure" vs "Luxury Pedicure" — clearly distinct.

**90 min / £120** (4 treatments): "Aromatherapy with Face", "Sperience Serenity", "Sperience Detox", "Sperience Energise", "Baobab" — all clearly distinct by name.
