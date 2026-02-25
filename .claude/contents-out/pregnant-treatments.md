# Implementation Plan: Pregnancy Treatments — Blog Article & Data Layer

**Source doc:** `.claude/contents-in/pregnant-treatments.md`
**Answers:** `.claude/contents-in/pregnant-treatments-answers-01.md`
**Target article slug:** `how-to-treat-your-pregnant-wife`

---

## Overview

Four phases, executed in sequence:

1. **Type update** — Add `relatedTreatments?: string[]` to `BlogTopic` in `src/types/blog.ts`
2. **Data file** — Create `src/data/pregnancy-treatments.ts` (static curated list)
3. **Tests** — Create `src/__tests__/pregnancy-treatments.test.ts`
4. **Blog article** — Use blog-writer skill to produce `content/blog/how-to-treat-your-pregnant-wife.mdx`

No changes to `src/types/spa.ts` or any existing treatment files.

---

## Phase 1 — Update `src/types/blog.ts`

### Change

Add `relatedTreatments` to the `BlogTopic` interface only. `BlogPostMeta` (the live MDX frontmatter) is unchanged.

```typescript
// Before
export interface BlogTopic {
  id: string;
  ...
  relatedSpas: string[];
  notes?: string;
}

// After
export interface BlogTopic {
  id: string;
  ...
  relatedSpas: string[];
  relatedTreatments?: string[]; // composite keys: "spaId:treatmentName"
  notes?: string;
}
```

**Why `BlogTopic` only:** `BlogTopic` is the planning artifact (the JSON passed to blog-writer). This is where the PRD says the treatments list should "live within." `BlogPostMeta` drives the live page — no treatments section UI is needed there (treatments are referenced inline via `<TreatmentLink>`).

---

## Phase 2 — Create `src/data/pregnancy-treatments.ts`

### Interface

```typescript
export interface PregnancyTreatment {
  key: string;            // composite identifier: "spaId:treatmentName"
  spaId: number;
  spaSlug: string;        // spa url slug, for use with <TreatmentLink>
  treatmentName: string;  // exact match to the `name` field in the treatment file
  price: string;          // always "From £X" format
  bookingUrl?: string;    // direct treatment booking URL (from treatment file)
  spaBookingUrl?: string; // spa-level booking URL fallback (from spaData.treatmentBookingUrl)
}

export const pregnancyTreatments: PregnancyTreatment[] = [...];
```

**Booking URL resolution order for article links:**
1. `bookingUrl` — direct treatment-level booking (4 treatments have this)
2. `spaBookingUrl` — spa booking system homepage (from `spaData.treatmentBookingUrl`)
3. `/spa/[slug]#treatments` — final fallback (informational anchor only)

**Populate `spaBookingUrl`** by reading `spaData.find(s => s.id === spaId).treatmentBookingUrl` for the 9 treatments without a direct `bookingUrl`. Some spas may have this field empty — in that case leave `spaBookingUrl` undefined and fall back to the anchor.

### Data — 13 treatments across 9 spas

| # | spaId | spaSlug | treatmentName | price | bookingUrl |
|---|-------|---------|---------------|-------|------------|
| 1 | 1 | `lodore-falls-spa` | `Pregnancy Elemis expert™ peaceful pregnancy massage` | From £100 | ✓ |
| 2 | 1 | `lodore-falls-spa` | `ishga Mum To Be Pregnancy Massage` | From £100 | ✓ |
| 3 | 3 | `brimstone-hotel-spa` | `Mamabird` | From £125 | — |
| 4 | 4 | `daffodil-hotel-spa` | `New Beginnings (45 min back & scalp)` | From £85 | — |
| 5 | 4 | `daffodil-hotel-spa` | `New Beginnings (90 min full body, face & scalp)` | From £170 | — |
| 6 | 8 | `ambleside-salutation-hotel-spa` | `PEACEFUL PREGNANCY MASSAGE` | From £100 | — |
| 7 | 9 | `lakeside-hotel-spa` | `Elemis Pregnancy Massage` | From £110 | ✓ |
| 8 | 10 | `beech-hill-hotel-spa` | `Caudalie Pre Natal Massage` | From £95 | — |
| 9 | 14 | `another-place-the-lake` | `Pregnancy Massage` | From £90 | — |
| 10 | 14 | `another-place-the-lake` | `Drench Facial (Pregnancy)` | From £90 | — |
| 11 | 14 | `another-place-the-lake` | `land&water hands and feet (Pregnancy)` | From £80 | — |
| 12 | 15 | `appleby-manor-hotel-garden-spa` | `Elemis Peaceful Pregnancy Massage` | From £70 | ✓ |
| 13 | 18 | `lakes-hotel-spa` | `Elemis Expert Peaceful Pregnancy Massage` | From £95 | — |

**Booking URLs** (copy exactly from treatment files):
- Entry 1: `https://lodorefallsspa.try.be/items/685d531776849117d20a8a95/pregnancy-elemis-expert-peaceful-pregnancy-massage`
- Entry 2: `https://lodorefallsspa.try.be/items/627e5b164c050930e37f0f3e/ishga-mum-to-be-pregnancy-massage`
- Entry 7: `https://lakesidehotel.onejourney.travel/spa/treatments/spa/treatments/62622`
- Entry 12: `https://applebymanor.onejourney.travel/spa/treatments/61422`

### Trimester restrictions (for article copy reference only — not in data model)

| Treatment | Restriction |
|-----------|-------------|
| ishga Mum To Be Pregnancy Massage | After first trimester |
| Mamabird | Second and third trimester only |
| PEACEFUL PREGNANCY MASSAGE | 12–38 weeks |
| Caudalie Pre Natal Massage | At least 12 weeks |
| Pregnancy Massage (Another Place) | Past first trimester |
| Elemis Peaceful Pregnancy Massage (Appleby) | From 2nd trimester (recommended) |

---

## Phase 3 — Create `src/__tests__/pregnancy-treatments.test.ts`

### Tests to include

```
describe('Pregnancy Treatments Data', () => {
  it('each entry key matches format "spaId:treatmentName"')
  it('each spaId resolves to a real spa in spaData')
  it('each spaSlug matches the url field of the matching spa')
  it('each treatmentName resolves to a real treatment via getTreatmentsBySpaId(spaId)')
  it('each price starts with "From £"')
  it('each bookingUrl, where present, matches the bookingUrl on the matching treatment')
  it('each spaBookingUrl, where present, matches spaData.find(s => s.id === spaId).treatmentBookingUrl')
  it('no duplicate keys exist in the array')
  it('BlogTopic relatedTreatments keys all resolve to pregnancyTreatments entries')
})
```

### Imports needed

```typescript
import { pregnancyTreatments } from '@/data/pregnancy-treatments';
import { spaData } from '@/data/spas';
import { getTreatmentsBySpaId } from '@/data/treatments';
```

Run after implementation: `npx jest src/__tests__/pregnancy-treatments.test.ts --maxWorkers=1`

---

## Phase 4 — Blog Article via blog-writer skill

### Invoke with

```
/blog-writer
```

Then provide the following enriched topic JSON as context:

```json
{
  "id": "how-to-treat-pregnant-wife",
  "title": "How to Treat Your Pregnant Wife: Ideas She'll Actually Love",
  "slug": "how-to-treat-your-pregnant-wife",
  "targetKeyword": "how to treat my pregnant wife",
  "secondaryKeywords": [
    "how to treat a pregnant wife",
    "how to treat pregnant wife",
    "how to treat your pregnant wife",
    "treat for pregnant wife"
  ],
  "category": "guides",
  "priority": 16,
  "status": "planned",
  "searchVolume": "50/mo (Low competition — index 0-14, lowest paid competition in dataset)",
  "relatedSpas": [
    "lodore-falls-spa",
    "appleby-manor-hotel-garden-spa",
    "lakeside-hotel-spa",
    "another-place-the-lake",
    "daffodil-hotel-spa",
    "ambleside-salutation-hotel-spa",
    "beech-hill-hotel-spa",
    "brimstone-hotel-spa",
    "lakes-hotel-spa"
  ],
  "relatedTreatments": [
    "1:Pregnancy Elemis expert™ peaceful pregnancy massage",
    "1:ishga Mum To Be Pregnancy Massage",
    "3:Mamabird",
    "4:New Beginnings (45 min back & scalp)",
    "4:New Beginnings (90 min full body, face & scalp)",
    "8:PEACEFUL PREGNANCY MASSAGE",
    "9:Elemis Pregnancy Massage",
    "10:Caudalie Pre Natal Massage",
    "14:Pregnancy Massage",
    "14:Drench Facial (Pregnancy)",
    "14:land&water hands and feet (Pregnancy)",
    "15:Elemis Peaceful Pregnancy Massage",
    "18:Elemis Expert Peaceful Pregnancy Massage"
  ],
  "notes": "Partner-intent search. Practical and emotional guide for partners. Funnel into babymoon content and Lake District spa listings. Avoid pure gift listicle — advice-led. NOTE: babymoon-lake-district post does not yet exist — omit internal link. Keep Lake District spa recommendation as the experience idea rather than the headline. Trimester restrictions must be mentioned in copy (not data) — several treatments require past 12 weeks / second trimester minimum. Cheapest option: Appleby Manor from £70. Widest choice: Another Place the Lake has three pregnancy treatments (massage, facial, hand & feet). Booking URL priority: use treatment bookingUrl where present, then spaBookingUrl, then spa page anchor. Treatments with direct booking: entries 1, 2 (Lodore Falls) and 7 (Lakeside Hotel) and 12 (Appleby Manor)."
}
```

### Article requirements for the blog-writer

- **Word count**: 800–900 words (blog-writer standard)
- **TreatmentLink usage**: Use `<TreatmentLink spaSlug="..." treatmentName="...">` for treatments with a `bookingUrl` (entries 1, 2, 7, 12). For the remaining 9, use the `spaBookingUrl` as a plain `<a>` href where available, falling back to `/spa/[slug]#treatments`.
- **Price format**: Always "From £X" — do not use bare price figures.
- **Trimester language**: Mention restrictions naturally in prose (e.g. "suitable from 12 weeks", "from the second trimester") — not as warnings or disclaimers.
- **relatedSpas**: All 9 slugs are in frontmatter. The page renders the first 4 as spa cards at the bottom.
- **relatedTreatments**: All 13 composite keys are in the `BlogTopic` JSON — use these as the canonical reference list when deciding which treatments to feature.
- **Internal link**: `babymoon-lake-district` post does not currently exist. Omit the internal link entirely.

### Output destination

`content/blog/how-to-treat-your-pregnant-wife.mdx`

---

## Execution Order

```
Step 1  →  Update src/types/blog.ts — add relatedTreatments?: string[] to BlogTopic
Step 2  →  Create src/data/pregnancy-treatments.ts
Step 3  →  Create src/__tests__/pregnancy-treatments.test.ts
Step 4  →  Run: npx jest src/__tests__/pregnancy-treatments.test.ts --maxWorkers=1
Step 5  →  Run: npm run typecheck (catch any type errors from Step 1)
Step 6  →  Run: npm test (full suite — must pass before proceeding)
Step 7  →  Invoke /blog-writer with enriched topic JSON
Step 8  →  Write MDX output to content/blog/how-to-treat-your-pregnant-wife.mdx
Step 9  →  Run: npm run typecheck && npm test (final verification)
```

---

## Files Created / Modified

| File | Action |
|------|--------|
| `src/types/blog.ts` | **Modify** — add `relatedTreatments?: string[]` to `BlogTopic` |
| `src/data/pregnancy-treatments.ts` | **Create** |
| `src/__tests__/pregnancy-treatments.test.ts` | **Create** |
| `content/blog/how-to-treat-your-pregnant-wife.mdx` | **Create** |

---

## Notes & Constraints

- **Type changes (minimal)**: `Treatment`, `BlogPostMeta`, and `Spa` are untouched. Only `BlogTopic` gains one optional field.
- **No treatment file edits**: Pregnancy status lives in the new static list only.
- **Prices as "From £X"**: The existing treatment data shows uniform-looking prices (e.g. all spa 1 treatments at £100). Using "From" prefix guards against these being outdated.
- **Booking URL fallback chain**: `bookingUrl` (treatment-level) → `spaBookingUrl` (spa `treatmentBookingUrl`) → `/spa/[slug]#treatments` (informational anchor). Populate `spaBookingUrl` from `spaData` for treatments 3–6, 8–11, 13.
- **Sitemap**: Auto-generated from `content/blog/` — no manual step required.
- **`TreatmentLink` already works**: The existing MDX component in `src/app/blog/[slug]/page.tsx` handles booking URL links and spa-page anchor fallbacks. No component changes needed.
- **Brimstone "Mamabird" price**: Listed as £125 individual / £245 couples. Use `From £125` in the data file and article copy.
- **`babymoon-lake-district` post**: Does not exist. Omit internal link in the article. Track as a future content opportunity.
