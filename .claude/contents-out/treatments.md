# Treatments Page — Implementation Plan

## Overview

A new `/spa-treatments` page that lists all priced treatments across the 17 spas that have treatment data. Modelled closely on the `/spa-days` page: same client-side filter modal pattern, same sticky filter bar, same pagination. Uses the existing `TreatmentPickCard` component and a new `TreatmentFilters` modal.

---

## Files to Create

### 1. `src/app/spa-treatments/layout.tsx`

SEO metadata layout file, identical in structure to `src/app/spa-days/layout.tsx`.

```
title:       "Spa Treatments - Lake District | Massages, Facials & Body Treatments"
description: "Browse and compare spa treatments from the finest hotels in the Lake District. Massages, facials, body treatments and more — with clear pricing and direct booking."
OG url:      https://lakedistrictspas.co.uk/spa-treatments
OG image:    reuse /images/lake-district-spas_hero.jpg (same as spa-days)
```

---

### 2. `src/app/spa-treatments/page.tsx`

Main client component. Architecture is a direct parallel to `src/app/spa-days/page.tsx`.

**Data:**
- Call `getAllTreatmentsWithSpa(spaData)` (new helper — see data layer changes below).
- This returns only treatments that have a `price` value.

**Sort options:**
```typescript
type SortOption = 'name-asc' | 'price-low-high' | 'price-high-low';
// Default: 'name-asc'
```
Labels in dropdown:
- `name-asc` → "A–Z"
- `price-low-high` → "Price: Low to High"
- `price-high-low` → "Price: High to Low"

**Filter state shape:**
```typescript
{
  priceBrackets: PriceBracket[];  // empty array = no price filter
  categories: string[];           // empty array = show all categories
  spas: number[];                 // all spa IDs selected by default = no filter
}

type PriceBracket = 'under-75' | '75-100' | '100-150' | '150-plus';
```

**Active filter count (badge on FilterButton):**
```
(priceBrackets.length > 0 ? 1 : 0)
+ (categories.length > 0 ? 1 : 0)
+ (spas.length < availableSpas.length ? 1 : 0)
```

**Filter logic (all applied after each other — AND across groups, OR within groups):**
1. **Price brackets** (OR within selection): parse `treatment.price` by stripping `£` and casting to int.
   - `under-75`: price < 75
   - `75-100`: price >= 75 && price <= 100
   - `100-150`: price > 100 && price <= 150
   - `150-plus`: price > 150
2. **Categories** (OR within selection): match `treatment.category` against the selected original category strings.
   - "Body & Massage" group maps to `['Massage Therapies', 'Body Treatments']`
   - "Facial Treatments" maps to `['Facial Treatments']`
   - "Hands & Feet" maps to `['Hands & Feet Treatments']`
3. **Spas** (OR within selection): match `treatment.spa.id`.

**Sort logic:**
- `name-asc`: `a.name.localeCompare(b.name)` (treatment name)
- `price-low-high`: parsed price ascending
- `price-high-low`: parsed price descending

**Pagination:** 12 items per page. Exact same pagination UI and `getPageNumbers()` helper as spa-days.

**Hero section (above sticky filter bar):**
```
[pill badge with Sparkles icon] Lake District Spa Treatments

H1: The Treatment        ← standard weight
    Collection           ← italic, font-medium

Subheading (italic, stone-500):
"From hot stone massages to bespoke facials, explore treatments from
the Lake District's finest hotel spas — with transparent pricing
and direct booking."

[amber divider: h-px w-24 bg-amber-200 mx-auto]
```

**Sticky filter bar:** Identical layout to spa-days.
- Left: `<FilterButton>` with active count badge
- Centre: "Showing X treatments" count
- Right: sort `<DropdownMenu>`

**Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` — same as spa-days. Renders `<TreatmentPickCard>` for each paginated item.

**Empty state:** "No treatments match your filters" + "Clear all filters" link (same as spa-days).

**Filter modal:** Renders `<TreatmentFilters>` with the same temp/active filter two-state pattern as spa-days (temp state lives in modal until Apply is pressed).

---

### 3. `src/components/TreatmentFilters.tsx`

New component. Same modal shell as `DayPassFilters` — backdrop, fixed overlay, sticky header, scrollable content, sticky footer.

**Props interface:**
```typescript
interface TreatmentFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClearFilters: () => void;
  filteredCount: number;
  // Price brackets
  selectedPriceBrackets: PriceBracket[];
  onPriceBracketChange: (bracket: PriceBracket) => void;
  // Treatment categories
  selectedCategories: string[];
  onCategoryChange: (categoryGroup: string) => void;
  // Spas
  availableSpas: { id: number; name: string }[];
  selectedSpas: number[];
  onSpaChange: (spaId: number) => void;
  onSelectAllSpas: () => void;
  onDeselectAllSpas: () => void;
}
```

**Modal sections:**

**Section 1 — Price**
Label: "Price"
Four checkbox rows using the same `<Checkbox>` from shadcn/ui:
- Under £75
- £75 – £100
- £100 – £150
- £150+

**Section 2 — Treatment Type**
Label: "Treatment Type"
Three checkbox rows:
- Body & Massage
- Facial Treatments
- Hands & Feet

**Section 3 — Spas**
Label: "Spas"
Select All / Deselect All toggle (same as DayPassFilters).
One checkbox row per spa that has treatments, sorted A–Z.

**Footer:** "Clear Filters" | "Show X results" — identical to DayPassFilters.

---

## Files to Modify

### 4. `src/types/spa.ts`

Add new interface (after the existing `DayPassWithSpa` interface):

```typescript
export interface TreatmentWithSpa extends Treatment {
  spa: Spa;
}
```

---

### 5. `src/data/treatments/index.ts`

Add two exports:

**`getAllTreatmentsWithSpa(spaData: Spa[]): TreatmentWithSpa[]`**
- Iterates `treatmentsBySpaId`, finds matching spa from `spaData`, attaches it.
- Filters out treatments where `!treatment.price` (only priced treatments).
- Returns flat array of `TreatmentWithSpa`.

**`parseTreatmentPrice(price: string): number`** (internal helper, also exported for use in page)
- Strips `£`, commas, whitespace then `parseInt`.
- Returns `0` if parsing fails (treated as zero in sort; won't appear if price filter is active since unparseable = excluded).

```typescript
// Example implementation sketch
export function getAllTreatmentsWithSpa(spaData: Spa[]): TreatmentWithSpa[] {
  const result: TreatmentWithSpa[] = [];
  for (const [spaIdStr, treatments] of Object.entries(treatmentsBySpaId)) {
    const spa = spaData.find((s) => s.id === Number(spaIdStr));
    if (!spa) continue;
    for (const treatment of treatments) {
      if (!treatment.price) continue; // skip unpriced
      result.push({ ...treatment, spa });
    }
  }
  return result;
}

export function parseTreatmentPrice(price: string): number {
  return parseInt(price.replace(/[£,\s]/g, ''), 10) || 0;
}
```

---

### 6. `src/components/SideMenu.tsx`

Add a new `<Link>` entry to the "Main Pages" section, below the "All Day Passes" link and above "Couples Spa Guide":

```tsx
<Link
  href="/spa-treatments"
  onClick={onClose}
  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
>
  <span className={`font-serif text-lg ${pathname === '/spa-treatments' ? 'text-amber-700' : 'text-stone-800'}`}>
    Spa Treatments
  </span>
  <ChevronRight className={`h-4 w-4 ${pathname === '/spa-treatments' ? 'text-amber-700' : 'text-stone-300'}`} />
</Link>
```

---

### 7. `src/app/sitemap.ts`

Add `/spa-treatments` to the static routes array. Check the existing pattern and mirror it (typically `{ url: '...', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }`).

---

## Implementation Order

1. **`src/types/spa.ts`** — add `TreatmentWithSpa` (unblocks everything else)
2. **`src/data/treatments/index.ts`** — add `getAllTreatmentsWithSpa` + `parseTreatmentPrice`
3. **`src/components/TreatmentFilters.tsx`** — build filter modal in isolation
4. **`src/app/spa-treatments/layout.tsx`** — metadata
5. **`src/app/spa-treatments/page.tsx`** — main page wiring it all together
6. **`src/components/SideMenu.tsx`** — add nav link
7. **`src/app/sitemap.ts`** — add route

Run `npm run typecheck && npm test` after step 5 to catch any issues before the nav/sitemap changes.

---

## Key Decisions Summary

| Decision | Choice |
|---|---|
| URL | `/spa-treatments` |
| Treatments shown | Only those with a `price` value |
| Price filter type | Checkbox brackets (Under £75, £75–£100, £100–£150, £150+) |
| Category grouping | Body & Massage / Facial Treatments / Hands & Feet |
| Default sort | A–Z by treatment name |
| Additional sorts | Price low→high, Price high→low |
| Pagination | 12 per page |
| Booking CTA fallback | Use existing `TreatmentPickCard` logic (URL → phone → nothing) |
| Spa filter list | Only spas with treatment data (17 spas) |
| Navigation | Add to SideMenu "Main Pages" section |
| Sitemap | Include with `priority: 0.8` |
