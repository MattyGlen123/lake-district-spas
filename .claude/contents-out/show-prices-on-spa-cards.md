# Implementation Plan — Show Prices on Spa Cards

## Overview

Add "From £X" price indicators to `SpaCard` for both day passes and treatments. Prices are fetched at the parent level and passed as props, keeping `SpaCard` purely presentational. Shared price utility functions are extracted to `src/lib/prices.ts` to eliminate duplication with `FeaturedSpa.tsx`.

---

## Decisions Summary (from answers)

| Decision | Answer |
|---|---|
| Which contexts | All four: SpaGrid, FeaturedSpas, RelatedSpas, blog `<SpaCard>` MDX |
| Display format | Each price on its own line (stacked, below title, above features) |
| Icons | Ticket (day passes) + Sparkles (treatments), amber colour — match FeaturedSpa |
| Partial data | Show only available price(s); omit section entirely if neither exists |
| No data | Render nothing — no fallback label |
| Utility extraction | Yes — extract to `src/lib/prices.ts` |
| Data fetching | Props from parent — SpaCard is purely presentational |
| Text colour | `text-stone-500`, same spacing conventions as FeaturedSpa |
| Tests | Yes — unit tests for utility functions + rendering tests for SpaCard |
| SEO/Schema | Out of scope |

---

## Files to Create

### `src/lib/prices.ts` (new)

Extract the two private functions from `FeaturedSpa.tsx` into a shared, exported utility module:

```ts
import { getDayPassOptionsBySpaId } from '@/data/day-passes';
import { getTreatmentsBySpaId } from '@/data/treatments';

/**
 * Get the lowest day pass price for a spa.
 * Returns null if no day pass data exists.
 */
export function getLowestDayPassPrice(spaId: number): number | null { ... }

/**
 * Get the lowest treatment price for a spa.
 * Parses price strings (e.g. '£105') to extract numeric values.
 * Returns null if no treatment price data exists.
 */
export function getLowestTreatmentPrice(spaId: number): number | null { ... }
```

Logic is copied verbatim from `FeaturedSpa.tsx` — no changes to the algorithm.

---

### `src/__tests__/prices.test.ts` (new)

**Part A — utility function unit tests**

Pure function tests requiring no React rendering (import and call directly):

- `getLowestDayPassPrice`: spa with day passes → returns correct minimum
- `getLowestDayPassPrice`: spa without day passes → returns `null`
- `getLowestTreatmentPrice`: spa with treatments → returns correct minimum (handles `£` prefix parsing)
- `getLowestTreatmentPrice`: spa with treatments but none with a price field → returns `null`
- `getLowestTreatmentPrice`: spa with no treatments → returns `null`
- Price parsing edge case: commas in price strings (e.g. `'£1,200'`)

Use real spa IDs from `spaData` where day pass/treatment data is known to exist. Use a spa ID with no data (e.g. ID 3, 8, or 11) to test null paths.

**Part B — SpaCard rendering tests**

React Testing Library is already in the project (`@testing-library/react` used in `blog-price-components.test.tsx`). Mock `next/image` and `next/link` at the top of the file (standard Jest pattern for Next.js components):

```ts
jest.mock('next/image', () => ({ __esModule: true, default: (props: Record<string, unknown>) => <img {...props} /> }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));
```

Test cases:

- Renders day pass price when `lowestDayPassPrice` is provided → `Day Passes From £55` present in DOM
- Renders treatment price when `lowestTreatmentPrice` is provided → `Treatments From £105` present in DOM
- Renders both prices when both props provided
- Renders neither price row when both props are `null`
- Renders neither price row when both props are `undefined` (props omitted)
- Renders only treatment row when `lowestDayPassPrice` is `null` and `lowestTreatmentPrice` is provided
- Renders only day pass row when `lowestTreatmentPrice` is `null` and `lowestDayPassPrice` is provided

---

## Files to Modify

### 1. `src/components/SpaCard.tsx`

**Add props:**
```ts
interface SpaCardProps {
  spa: Spa;
  lowestDayPassPrice?: number | null;
  lowestTreatmentPrice?: number | null;
}
```

**Add imports:**
```ts
import { Ticket, Sparkles } from 'lucide-react';
```

**Add price display block** between the spa name `<h3>` and the key features `<ul>`, inside the existing `<div className="space-y-5">`:

```tsx
{/* Day Pass Price */}
{lowestDayPassPrice != null && (
  <div className="flex items-center gap-1.5 text-stone-500">
    <Ticket className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
    <span className="text-xs">Day Passes From £{lowestDayPassPrice}</span>
  </div>
)}

{/* Treatment Price */}
{lowestTreatmentPrice != null && (
  <div className="flex items-center gap-1.5 text-stone-500">
    <Sparkles className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
    <span className="text-xs">Treatments From £{lowestTreatmentPrice}</span>
  </div>
)}
```

**Spacing note:** The icon/text size is slightly smaller than FeaturedSpa (`h-4 w-4` vs `h-5 w-5`, `text-xs` vs `text-s`) to suit the compact card layout. The outer `space-y-5` div handles consistent gaps between name, prices, and features — no extra margin wrappers needed.

---

### 2. `src/lib/prices.ts` → `src/components/location/FeaturedSpa.tsx`

Remove the two private functions `getLowestDayPassPrice` and `getLowestTreatmentPrice` from `FeaturedSpa.tsx`. Replace with:

```ts
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';
```

The rest of `FeaturedSpa.tsx` is unchanged — it already passes these values to JSX directly, so the call sites remain identical.

---

### 3. `src/components/SpaGrid.tsx`

Add import and pass price props to each `SpaCard`:

```ts
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';
```

```tsx
{spas.map((spa) => (
  <SpaCard
    key={spa.id}
    spa={spa}
    lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
    lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
  />
))}
```

`SpaGrid` is already a `'use client'` component. The price utility functions are pure synchronous calls over static TS data — no performance concern.

---

### 4. `src/components/FeaturedSpas.tsx`

Same pattern as SpaGrid:

```ts
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';
```

```tsx
{featuredSpas.map((spa: Spa) => (
  <SpaCard
    key={spa.id}
    spa={spa}
    lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
    lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
  />
))}
```

---

### 5. `src/components/RelatedSpas.tsx`

`RelatedSpas` is currently a server component (no `'use client'` directive). The price utility functions are plain synchronous imports with no side effects, so they are safe to call in a server component.

```ts
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';
```

```tsx
{relatedSpas.map((relatedSpa) => (
  <SpaCard
    key={relatedSpa.id}
    spa={relatedSpa}
    lowestDayPassPrice={getLowestDayPassPrice(relatedSpa.id)}
    lowestTreatmentPrice={getLowestTreatmentPrice(relatedSpa.id)}
  />
))}
```

---

### 6. `src/app/blog/[slug]/page.tsx`

There are **two separate `SpaCard` render sites** in this file. Both must be updated.

**6a. MDX inline component (line ~292)**

The `SpaCard` MDX component wrapper looks up a spa by slug and renders it inline within blog post content:

```ts
import { getLowestDayPassPrice, getLowestTreatmentPrice } from '@/lib/prices';
```

```tsx
SpaCard: ({ spaSlug }: { spaSlug: string }) => {
  const spa = spaData.find((s) => s.url === spaSlug);
  if (!spa) return null;
  return (
    <div className="my-8">
      <SpaCard
        spa={spa}
        lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
        lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
      />
    </div>
  );
},
```

**6b. "Spas Mentioned in This Article" section (line ~676)**

A separate section at the bottom of each blog post renders a grid of `mentionedSpas`. This is distinct from the MDX component above and must also be updated:

```tsx
{/* Spa Cards Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
  {mentionedSpas.map((spa) => (
    <SpaCard
      key={spa.id}
      spa={spa}
      lowestDayPassPrice={getLowestDayPassPrice(spa.id)}
      lowestTreatmentPrice={getLowestTreatmentPrice(spa.id)}
    />
  ))}
</div>
```

The single `import` added for 6a covers both usages. The blog page is already a server component — price lookups at this level are fine.

---

### 7. `src/__tests__/prices.test.ts` (new, described above)

---

## Implementation Order

1. **Create `src/lib/prices.ts`** — extract functions, add exports, add JSDoc
2. **Update `src/components/location/FeaturedSpa.tsx`** — remove private functions, add import
3. **Update `src/components/SpaCard.tsx`** — add props, add imports, add price display block
4. **Update `src/components/SpaGrid.tsx`** — add import, pass props
5. **Update `src/components/FeaturedSpas.tsx`** — add import, pass props
6. **Update `src/components/RelatedSpas.tsx`** — add import, pass props
7. **Update `src/app/blog/[slug]/page.tsx`** — add import, pass props at **both** line ~292 (MDX component) and line ~676 (Spas Mentioned section)
8. **Create `src/__tests__/prices.test.ts`** — utility function tests (Part A) + SpaCard rendering tests (Part B)
9. **Run `npm run typecheck && npm test`** — confirm all tests pass

---

## Out of Scope

- Schema.org structured data for pricing
- Any changes to day pass or treatment data files
- Visual changes to `FeaturedSpa.tsx` (it will continue to use the same functions, just imported)
