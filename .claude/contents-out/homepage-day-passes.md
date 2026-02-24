# Implementation Plan — Homepage Day Passes Section

## Overview

Refactor `CouplesDayPasses.tsx` into a fully generic, prop-driven Server Component, update the couples page to use explicit props, and add a new Featured Day Passes section to the bottom of the homepage.

---

## Files to change

| File | Change type |
|---|---|
| `src/components/CouplesDayPasses.tsx` | Refactor — make generic, remove `'use client'` |
| `src/app/couples-spa-lake-district/page.tsx` | Update — pass explicit props |
| `src/app/page.tsx` | Update — import and render new section |

No new files. No schema changes. No new data files.

---

## Step 1 — Refactor `CouplesDayPasses.tsx`

### Remove `'use client'`

The component contains no React state, hooks, or browser APIs. Removing the directive makes it a React Server Component, which improves the bundle size and First Contentful Paint for both the couples page and the homepage.

### New prop interface

```typescript
interface CouplesDayPassesProps {
  featuredDayPassIds: string[];
  heading: string;
  eyebrowLabel: string;
  description: string;
  ctaLabel: string;
  ctaVariant?: 'link' | 'button'; // default: 'link'
  background?: string;            // Tailwind class, default: 'bg-white'
}
```

`ctaVariant` is not in the original prop list but is needed to support the two different CTA styles requested — the couples page keeps the subtle inline link, the homepage gets the prominent emerald pill button.

### Data lookup — replace internal approach with `getAllDayPassesWithSpa`

The current implementation iterates hardcoded `featuredSpaIds`, calls `getDayPassOptionsBySpaId` per spa, then filters. The refactored version uses the existing `getAllDayPassesWithSpa(spaData)` utility from the day-passes index, which already flattens all passes with their parent spa. This removes the dependency on a hardcoded spa ID list.

**New data logic:**
```typescript
import { getAllDayPassesWithSpa } from '@/data/day-passes';
import { spaData } from '@/data/spas';

const allPasses = getAllDayPassesWithSpa(spaData);

const dayPassesWithSpa = allPasses
  .filter((p) => featuredDayPassIds.includes(p.id))
  .sort((a, b) => a.spa.name.localeCompare(b.spa.name));
```

Note: `getAllDayPassesWithSpa` returns `DayPassWithSpa[]` where each item is `{ ...DayPassOption, spa: Spa }` (a flat spread). `DayPassCard` expects `{ dayPass: DayPassOption, spa: Spa }`, so destructure at render time:

```tsx
{dayPassesWithSpa.map(({ spa, ...dayPass }) => (
  <DayPassCard key={dayPass.id} dayPass={dayPass} spa={spa} />
))}
```

### CTA rendering

Render two variants based on `ctaVariant`:

**`'link'` (default — couples page style):**
```tsx
<Link href="/spa-days/" className="inline-flex items-center text-emerald-900 font-semibold text-sm">
  {ctaLabel}
  <ArrowRight className="h-4 w-4 ml-2" />
</Link>
```

**`'button'` (homepage style):**
```tsx
<Link
  href="/spa-days/"
  className="inline-flex items-center gap-2 bg-emerald-950 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest"
>
  {ctaLabel}
  <ArrowRight className="h-4 w-4" />
</Link>
```

### Section background

Applied via the `background` prop on the `<section>` className:
```tsx
<section className={`py-32 ${background ?? 'bg-white'}`}>
```

### Full refactored component signature

```tsx
export default function CouplesDayPasses({
  featuredDayPassIds,
  heading,
  eyebrowLabel,
  description,
  ctaLabel,
  ctaVariant = 'link',
  background = 'bg-white',
}: CouplesDayPassesProps) { ... }
```

---

## Step 2 — Update `couples-spa-lake-district/page.tsx`

Pass all props explicitly to reproduce the current output with no visual change:

```tsx
<CouplesDayPasses
  featuredDayPassIds={[
    'armathwaite-sunset-weekday',
    'lodore-falls-derwent-delight',
    'low-wood-bay-hideaway-retreat',
    'swan-champagne-truffle-spa-day',
  ]}
  heading="Couples Day Experiences"
  eyebrowLabel="Spontaneous Romance"
  description="Experience a romantic spa day without booking an overnight stay. Each of our featured spas offers day passes perfect for couples."
  ctaLabel="Browse all day passes"
  ctaVariant="link"
  background="bg-white"
/>
```

---

## Step 3 — Update `src/app/page.tsx`

### Import

```tsx
import CouplesDayPasses from '@/components/CouplesDayPasses';
```

### Position

Add after `<FeaturedLocations />`, before `</main>` — the last section on the page.

### Props

```tsx
<CouplesDayPasses
  featuredDayPassIds={[
    'armathwaite-escape-weekend',
    'swan-champagne-truffle-spa-day',
    'netherwood-spa-relaxation',
    'north-lakes-simple-ritual-weekday',
  ]}
  heading="Spa Day Experiences"
  eyebrowLabel="Featured Day Passes"
  description="Explore hand-picked day passes from some of the Lake District's finest spas, no overnight stay required."
  ctaLabel="See All Day Passes"
  ctaVariant="button"
  background="bg-stone-50"
/>
```

The four IDs map to spas 2, 5, 16, and 12 respectively. Alphabetical sort by spa name will determine the render order.

---

## Section header layout — homepage vs couples page

The current component places the CTA link inline with the header (flex row, items-end, justify-between). This layout works well for the subtle link style but is awkward for a pill button.

For `ctaVariant="button"`, move the CTA below the description, left-aligned, to give it proper prominence:

```tsx
{/* Heading row — no CTA link here when ctaVariant is 'button' */}
<div className="flex-1">
  <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">
    {eyebrowLabel}
  </span>
  <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
    {heading}
  </h2>
  <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
    {description}
  </p>
</div>

{/* CTA — inline for 'link', below description for 'button' */}
{ctaVariant === 'link' ? (
  <div className="flex-shrink-0 mt-6 md:mt-0">
    <Link href="/spa-days/" className="inline-flex items-center text-emerald-900 font-semibold text-sm">
      {ctaLabel}
      <ArrowRight className="h-4 w-4 ml-2" />
    </Link>
  </div>
) : (
  <div className="mt-8">
    <Link href="/spa-days/" className="inline-flex items-center gap-2 bg-emerald-950 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest">
      {ctaLabel}
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
)}
```

---

## What does not change

- `DayPassCard.tsx` — no changes
- Day pass data files — no changes
- Sorting behaviour — alphabetical by spa name on both pages
- Schema / structured data — none added
- Any other page that does not use `CouplesDayPasses`

---

## Testing checklist

After implementation:

1. `npm run typecheck` — no TypeScript errors
2. `npm test` — all existing tests pass (no spa data or filtering tests touch `CouplesDayPasses` directly)
3. Visual check — `/couples-spa-lake-district` renders identically to before
4. Visual check — `/` homepage shows the four day pass cards below `FeaturedLocations`, with `bg-stone-50` background and the emerald pill CTA
5. Confirm the four homepage IDs all resolve to valid day pass options (they are confirmed to exist in spa-2, spa-5, spa-16, spa-12)
