# Implementation Plan — /spas Page

## Overview

Move the spa listing grid off the homepage to a new dedicated `/spas` page. Replace the homepage spa grid with a featured spas section (6 spas). Upgrade the spa listing with sorting and pagination matching the spa-days/spa-treatments pattern. Update all relevant internal links.

---

## Files to Create

### 1. `src/lib/spa-catalog.ts`
New utility file following the `treatment-catalog.ts` / `day-pass-catalog.ts` pattern. Centralises all filter/sort logic for the spas listing.

**Contents:**
- `SpaFiltersState` interface: `{ accessLabels: AccessLabel[], location: string, facilities: string[] }`
- `SpaSortOption` type: `'name-asc' | 'name-desc' | 'location-asc'`
- `spaSortOptions` array: `[{ value: 'name-asc', label: 'Name: A–Z' }, { value: 'name-desc', label: 'Name: Z–A' }, { value: 'location-asc', label: 'Location: A–Z' }]`
- `createDefaultSpaFilters(): SpaFiltersState` — returns `{ accessLabels: [], location: 'All Locations', facilities: [] }`
- `applyFilters(spa: Spa, filters: SpaFiltersState): boolean` — extract directly from existing logic in `SpaFilterSection.tsx` (access labels OR match, location exact match, facilities with pool/iceRoom special handling)
- `countActiveFilters(filters: SpaFiltersState): number` — returns `accessLabels.length + (location !== 'All Locations' ? 1 : 0) + facilities.length`
- `sortSpas(spas: Spa[], sortBy: SpaSortOption): Spa[]` — name A–Z / Z–A, or location A–Z sort

---

### 2. `src/app/spas/layout.tsx`
SEO metadata following the `spa-days/layout.tsx` pattern exactly.

**Contents:**
```ts
export const metadata: Metadata = {
  title: 'All Spas - Lake District Spas',
  description: 'Browse and compare all Lake District spa hotels. Filter by facilities, location, and access type to find your perfect spa retreat.',
  openGraph: {
    title: 'All Spas - Lake District Spas',
    description: '...',
    type: 'website',
    url: 'https://lakedistrictspas.co.uk/spas',
    images: [{ url: '...hero.jpg', width: 1200, height: 630, alt: 'Lake District Spa Hotels' }],
  },
  twitter: { card: 'summary_large_image', ... },
};
```

---

### 3. `src/app/spas/page.tsx`
New client page component. Follows the `spa-days/page.tsx` pattern closely.

**Structure:**
- `'use client'`
- Imports: `Header`, `Footer`, `FilterButton`, `FilterModal`, `SpaGrid`, `SortMenu`, `PaginationControls`, `useDraftFilters`, `usePagination`, spa-catalog utilities, `spaData`
- State: `sortBy` (default `'name-asc'`), `gridRef`
- Draft filters via `useDraftFilters(createDefaultSpaFilters())`
- Filter logic: `spaData.filter(spa => applyFilters(spa, filters))` via `useMemo`
- Sort: `sortSpas(filteredSpas, sortBy)` via `useMemo`
- Pagination: `usePagination({ items: sortedSpas, itemsPerPage: 12, resetDeps: [filters, sortBy] })`
- Active filter count: `countActiveFilters(filters)`
- Temp filtered count: `spaData.filter(spa => applyFilters(spa, tempFilters)).length`
- Clear filters handler: `resetBothFilters(createDefaultSpaFilters())`

**JSX Layout:**
```
<Header />
<main>
  {/* Hero */}
  <section> {/* same structure as spa-days/spa-treatments hero */}
    - Image: /images/pages/ullswater-shoreline-lake-district-spa-breaks.jpg
    - Pill badge: no icon, text "Lake District Spa Directory"
    - H1: "The Spa" / <span italic>"Collection"</span>
    - Subheading: "Browse and compare all Lake District spa hotels — filter by facilities, location, and access type."
    - Divider line
  </section>

  <div ref={gridRef} className="scroll-mt-24" />

  {/* Sticky Filter Bar */}
  {/* Mobile: FilterButton + SortMenu row */}
  {/* Desktop: FilterButton | results count | SortMenu */}

  {/* Spa Grid with pagination */}
  {paginatedSpas.length > 0 ? (
    <>
      {/* Mobile results count */}
      <SpaGrid spas={paginatedSpas} />
      {totalPages > 1 && <PaginationControls ... />}
    </>
  ) : (
    {/* Empty state with clear filters */}
  )}

  {/* Filter Modal */}
  <FilterModal
    isOpen={isFilterModalOpen}
    onClose={handleCloseModal}
    onApply={handleApplyFilters}
    selectedAccessLabels={tempFilters.accessLabels}
    onAccessLabelChange={...}
    selectedLocation={tempFilters.location}
    onLocationChange={...}
    selectedFacilities={tempFilters.facilities}
    onFacilityChange={...}
    onClearFilters={handleClearFilters}
    filteredCount={tempFilteredCount}
  />
</main>
<Footer />
```

**Note on `SpaGrid`:** The existing `SpaGrid` component renders an internal H2 heading `"Explore N spas"`. On the new /spas page this heading is redundant alongside the sticky results count. Pass paginated spas into SpaGrid and suppress or omit the heading — either adapt SpaGrid to accept an optional `showHeading` prop, or render the grid directly inline in the page. Preferred: add an optional `showHeading?: boolean` prop defaulting to `true` so existing usage is unaffected.

---

### 4. `src/components/HomepageFeaturedSpas.tsx`
New component to replace `SpaFilterSection` on the homepage.

**Featured spa IDs:** `[1, 2, 7, 14, 5, 9]`

**Copy:**
- Eyebrow label: `"Featured Spas"`
- Heading: `"Explore the Collection"`
- Subheading: `"Hand-picked spa hotels from across the Lake District, chosen for their outstanding facilities and unique character."`
- CTA link: `"See all spas →"` pointing to `/spas` (inline text link with `ArrowRight` icon, styled like `RelatedSpas` "View All")

**Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8` (1/2/3 column responsive)

**Section background:** `bg-stone-50` with `py-32` spacing.

**Header layout:** Style guide format:
```
<span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-800 block mb-4">Featured Spas</span>
<h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">Explore the Collection</h2>
<p className="text-stone-500 font-light leading-relaxed max-w-2xl">...</p>
```

With `<Link href="/spas">` CTA positioned at `md:items-end md:justify-between` layout matching `FeaturedSpas.tsx` header pattern.

**Cards:** Uses existing `SpaCard` component with `getLowestDayPassPrice` / `getLowestTreatmentPrice` for each spa.

---

## Files to Modify

### 5. `src/app/page.tsx`
- Remove `import SpaFilterSection from '@/components/SpaFilterSection'`
- Add `import HomepageFeaturedSpas from '@/components/HomepageFeaturedSpas'`
- Replace `<SpaFilterSection />` with `<HomepageFeaturedSpas />`
- No other changes to page structure or ordering

---

### 6. `src/components/Hero.tsx`
Add a CTA button below the existing subheading text.

Current structure ends with two `<p>` tags. After the second `<p>`, add:
```tsx
<div className="mt-8">
  <Link
    href="/spas"
    className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-950 font-bold text-xs uppercase tracking-widest rounded-full shadow-sm"
  >
    See All Spas
    <ArrowRight className="h-4 w-4 ml-2" />
  </Link>
</div>
```

Requires adding `import Link from 'next/link'` and `import { ArrowRight } from 'lucide-react'` to Hero.tsx. Convert component from returning a plain `<section>` to importing these — Hero is currently a server component so this stays server-safe (Link works in server components).

---

### 7. `src/components/SideMenu.tsx`
Add "All Spas" nav link to the Main Pages section, positioned between "Home" and "All Day Passes" (logical ordering: Spas → Day Passes → Treatments → Couples).

```tsx
<Link
  href="/spas"
  onClick={onClose}
  className="flex items-center justify-between p-4 rounded-2xl border border-transparent bg-white"
>
  <span className={`font-serif text-lg ${pathname === '/spas' ? 'text-amber-700' : 'text-stone-800'}`}>
    All Spas
  </span>
  <ChevronRight className={`h-4 w-4 ${pathname === '/spas' ? 'text-amber-700' : 'text-stone-300'}`} />
</Link>
```

---

### 8. `src/lib/spa-catalog.ts` — filter handler adapters
(This is handled by the new file in step 1 — listed here for completeness of the handler wiring.)

The temp filter handlers in `spas/page.tsx` follow the same pattern as `SpaFilterSection.tsx`:
- `handleTempAccessLabelChange(label: AccessLabel)` — toggle in array
- `handleTempLocationChange(location: string)` — set string
- `handleTempFacilityChange(facility: string)` — toggle in array

---

## Internal Links to Update (href="/" → href="/spas")

The following links currently point to `/` but semantically direct users to the spa listing. They should be updated to `/spas`.

**Components:**
| File | Current anchor text | Action |
|------|---------------------|--------|
| `src/components/BackButton.tsx` | "Back to All Spas" | `href="/"` → `href="/spas"` |
| `src/components/RelatedSpas.tsx` | "View All" | `href="/"` → `href="/spas"` |
| `src/components/FeaturedSpas.tsx` | "Browse all spas" | `href="/"` → `href="/spas"` |
| `src/components/FeaturedTreatments.tsx` | "Browse all spas" | `href="/"` → `href="/spas"` |

**Pages:**
| File | Current anchor text | Action |
|------|---------------------|--------|
| `src/app/about/page.tsx` | "Explore the Directory" | `href="/"` → `href="/spas"` |
| `src/app/blog/[slug]/page.tsx` | "View All" (Spas Mentioned) | `href="/"` → `href="/spas"` |

**FAQ data files** (links saying "see our homepage" in context of finding more spas):
- `src/data/faqs/spa-1-faqs.tsx`
- `src/data/faqs/spa-2-faqs.tsx`
- `src/data/faqs/spa-3-faqs.tsx`
- `src/data/faqs/spa-8-faqs.tsx`
- `src/data/faqs/spa-9-faqs.tsx`
- `src/data/faqs/spa-10-faqs.tsx`
- `src/data/faqs/spa-11-faqs.tsx`
- `src/data/faqs/spa-13-faqs.tsx`
- `src/data/faqs/spa-14-faqs.tsx`
- `src/data/faqs/spa-16-faqs.tsx`
- `src/data/faqs/spa-17-faqs.tsx`
- `src/data/faqs/spa-18-faqs.tsx`

Each of these has a link with anchor text "homepage" (rendered as underlined inline text) linking to the spa directory. Update `href="/"` → `href="/spas"` in each. The anchor text "homepage" can remain or be updated to "spas directory" — either is acceptable, but updating the text to "spas directory" or "spa directory" is more accurate.

**Links that must stay at `/`** (genuine "go home" navigation — do not change):
- `src/components/Header.tsx` — logo link
- `src/components/SideMenu.tsx` — "Home" nav item
- `src/components/Breadcrumbs.tsx` — "Home" breadcrumb
- `src/app/not-found.tsx` — "Return Home" button
- `src/app/partnership/success/page.tsx` — "Return Home" button

---

## SpaFilterSection Cleanup

`src/components/SpaFilterSection.tsx` is currently only used on the homepage. Once replaced by `HomepageFeaturedSpas`, it becomes unused. Its filter logic is extracted into `spa-catalog.ts`.

**Decision:** The Q15 answer stated "reuse the component" — meaning the same filter options must be preserved on the new page (which they are via `spa-catalog.ts` + `FilterModal`). The component itself will no longer be referenced anywhere once the homepage swap is made. Rather than leaving dead code:

- Confirm no imports remain (`grep -r 'SpaFilterSection' src/` should return zero results after step 6)
- Then **delete `SpaFilterSection.tsx`**

This is safe because: (a) no test imports it (verified: `grep -r 'SpaFilterSection' src/__tests__/` returns nothing), (b) its logic is fully preserved in `spa-catalog.ts`, and (c) `FilterModal` — the actual reusable piece — is retained and used directly by `spas/page.tsx`.

---

## SpaGrid Modification

Add an optional `showHeading` prop to `src/components/SpaGrid.tsx`:

```tsx
interface SpaGridProps {
  spas: Spa[];
  showHeading?: boolean; // default true
}
```

On the new `/spas` page, pass `showHeading={false}` so the "Explore N spas" H2 is suppressed (replaced by the filter bar results count). Existing usages (location pages, etc.) are unaffected since they don't pass this prop and get `true` by default.

**Spacing consistency note:** `SpaGrid` currently wraps its content in `<section className="py-8 md:py-16 mb-20">`. The spa-days and spa-treatments pages render their grids directly inside `<div className="container mx-auto px-4 pb-16 md:pt-16">` — no outer section, no `mb-20`. To match the sibling listing page appearance on the `/spas` page, also add an optional `className` prop to `SpaGrid` so the outer section's classes can be overridden:

```tsx
interface SpaGridProps {
  spas: Spa[];
  showHeading?: boolean;    // default true
  className?: string;        // override outer section classes
}
```

On the `/spas` page, pass `className="container mx-auto px-4 pb-16 md:pt-16"` to replace the section wrapper with a direct container div. All existing usages remain unchanged (no prop passed = original section styling).

---

## Implementation Order

Execute in this sequence to avoid breaking the build at any step:

1. **Create `src/lib/spa-catalog.ts`** — no side-effects, safe to add first
2. **Create `src/app/spas/layout.tsx`** — metadata only, no runtime impact
3. **Create `src/app/spas/page.tsx`** — new route, nothing references it yet
4. **Modify `src/components/SpaGrid.tsx`** — add optional `showHeading` prop
5. **Create `src/components/HomepageFeaturedSpas.tsx`** — new component
6. **Modify `src/app/page.tsx`** — swap SpaFilterSection → HomepageFeaturedSpas
7. **Modify `src/components/Hero.tsx`** — add CTA button
8. **Modify `src/components/SideMenu.tsx`** — add "All Spas" nav link
9. **Update internal links** — BackButton, RelatedSpas, FeaturedSpas, FeaturedTreatments, about page, blog/[slug] page
10. **Update FAQ data files** — 12 files, update `href="/"` → `href="/spas"`
10a. **Update test assertion** — `src/__tests__/faqs-lodore-falls.test.tsx` line 537: `a[href="/"]` → `a[href="/spas"]`
11. **Delete `SpaFilterSection.tsx`** — confirm zero grep hits first: `grep -r 'SpaFilterSection' src/`
12. **Run tests** — `npm test` to verify no regressions

---

## Tests

### Known test update required (step 10a — do before running tests)

`src/__tests__/faqs-lodore-falls.test.tsx` line 537 contains:
```ts
const link = container.querySelector('a[href="/"]');
```
This assertion tests that the Lodore Falls FAQ link (`spa-1-faqs.tsx`) points to `/`. After step 10 updates `spa-1-faqs.tsx` to `href="/spas"`, this assertion will fail. **Update the selector to `a[href="/spas"]` before running the final test suite.**

### Full suite

Run `npm test` after all steps including the test file update above. No other tests are expected to break:
- `SpaFilterSection` is not imported by any test file (verified: `grep -r 'SpaFilterSection' src/__tests__/` returns nothing)
- Filtering tests operate on the logic layer, not the component
- If any tests reference `SpaFilterSection` directly, update them to use the equivalent `spa-catalog.ts` functions

A new smoke test for `spa-catalog.ts` filter/sort logic is recommended but not required as part of this implementation (consistent with how `day-pass-catalog.ts` and `treatment-catalog.ts` have their own test coverage).

---

## Scope Boundaries

The following are explicitly **out of scope** for this implementation:
- Changing homepage hero copy (retain existing "Lake District Spas / Find the perfect spa for you" text)
- Adding breadcrumbs to the /spas page
- Updating the sitemap (no sitemap file exists in the project)
- Changing meta description on the homepage root layout
- Any changes to location pages or the spa detail pages
