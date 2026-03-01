# Implementation Plan — Spa Listings Page

## Overview

Update `src/app/spas/page.tsx` from a fully client-rendered paginated listing to a statically generated Server Component shell with an interactive client island for filtering and sorting. All ~22 spas will render on a single page with no pagination. The treatments and day passes pages are untouched.

---

## Files to Change

| File | Action |
|------|--------|
| `src/app/spas/page.tsx` | Rewrite as Server Component — metadata, JSON-LD, static hero, renders client island |
| `src/components/SpasListingClient.tsx` | Create — extracts all interactive state from the current page |
| `src/lib/spa-catalog.ts` | Add `'featured'` to `SpaSortOption`, `spaSortOptions`, and `sortSpas` |
| `.claude/diagrams/06-filtering-logic.md` | Update to reflect unpaginated RSC/client split |

---

## Step 1 — Add `featured` sort to `src/lib/spa-catalog.ts`

**What changes:**

1. Extend the `SpaSortOption` type union to include `'featured'`.
2. Add `{ value: 'featured', label: 'Featured' }` as the **first** entry in `spaSortOptions` (so it appears first in the sort dropdown).
3. Add a `'featured'` case to `sortSpas` that returns the spas array unchanged — this preserves the editorial order of `spaData` as declared in the TypeScript file.

**Resulting type:**
```ts
export type SpaSortOption = 'featured' | 'name-asc' | 'name-desc' | 'location-asc';
```

**Resulting options array:**
```ts
export const spaSortOptions: { value: SpaSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'location-asc', label: 'Location: A to Z' },
];
```

Note: existing `'name-asc'` label was "Name: A–Z" which contains a dash. Updated to "Name: A to Z" for consistency. Confirm whether this matters (it's UI copy, not metadata, so dashes here should be fine — but left without for consistency).

**Resulting sort case:**
```ts
case 'featured':
  return [...spas]; // preserves spaData declaration order
```

---

## Step 2 — Create `src/components/SpasListingClient.tsx`

This is the extracted client island. It contains everything interactive from the current `spas/page.tsx`.

**Key differences from current page:**
- `'use client'` directive at top.
- Accepts `spas: Spa[]` as a prop (passed from the server page).
- Default sort state is `'featured'` instead of `'name-asc'`.
- `usePagination` hook **removed** entirely.
- `PaginationControls` component **removed** entirely.
- All pagination-related state removed: `currentPage`, `totalPages`, `paginatedSpas`, `pageTokens`, `setCurrentPage`, `goToPreviousPage`, `goToNextPage`.
- `handlePageChange`, `handlePreviousPage`, `handleNextPage` handlers **removed**.
- `SpaGrid` receives `sortedSpas` directly (was `paginatedSpas`).
- `scrollToGridTop` is kept and called only from `handleApplyFilters` (filter apply).
- `itemsPerPage` constant removed.
- The hero section JSX is **not** included — that stays in the server page.
- The `FilterModal`, filter bar, results count, empty state, and `SpaGrid` JSX are all included.

**Prop interface:**
```ts
interface SpasListingClientProps {
  spas: Spa[];
}
```

**Imports removed vs current page:**
- `usePagination` from `@/hooks/listing/usePagination`
- `PaginationControls` from `@/components/listing/PaginationControls`

**Imports added:**
- None (all others retained)

---

## Step 3 — Rewrite `src/app/spas/page.tsx` as a Server Component

**What changes:**
- Remove `'use client'` directive entirely.
- Remove all `useState`, `useMemo`, `useRef` imports.
- Remove all filter/sort/pagination logic.
- Remove `FilterModal`, `SpaGrid`, `SortMenu`, `PaginationControls`, `FilterButton` imports (these move to the client component).
- Keep `Header`, `Footer`, `Image` imports.
- Add `Metadata` import from `next`.
- Add `spaData` import (used for JSON-LD schema).
- Add `SpasListingClient` import.

**New structure of the file:**

```
metadata export (static)
SpasPage (Server Component)
  └── <Header />
  └── <main>
        └── hero <section> (identical JSX to current)
        └── <SpasListingClient spas={spaData} />
  └── <Footer />
JSON-LD script (inline in SpasPage)
```

### Metadata export

```ts
export const metadata: Metadata = {
  title: 'Lake District Spa Directory | Browse All Spas | Lake District Spas',
  description:
    'Browse and compare all Lake District spa hotels. Filter by facilities, location and access type. Find the perfect spa break in the Lake District.',
};
```

No dashes in title or description copy.

### JSON-LD ItemList Schema

Placed as an inline `<script type="application/ld+json">` inside the `SpasPage` component, before `<Header />` or at the top of `<main>`. Uses `spaData` to generate the list items.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Lake District Spa Directory',
      description: 'All Lake District spa hotels in one directory',
      numberOfItems: spaData.length,
      itemListElement: spaData.map((spa, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: spa.name,
        url: `https://lakedistrictspa.co.uk/spa/${spa.url}`,
      })),
    }),
  }}
/>
```

The base URL `https://lakedistrictspa.co.uk` should be confirmed against the production domain. If a `NEXT_PUBLIC_SITE_URL` environment variable exists in the project, use that instead of a hardcoded string. Check `.env` / `.env.local` / `next.config` before implementing.

---

## Step 4 — Update `.claude/diagrams/06-filtering-logic.md`

Replace the existing Mermaid diagram with an updated version that:
- Shows the RSC/client split boundary.
- Removes `usePagination`, `paginatedSpas`, and `PaginationControls` from the spas page flow.
- Shows `sortedSpas` flowing directly into `SpaGrid`.
- Notes that `scrollToGridTop` is triggered by filter apply only.
- Retains all filter logic documentation unchanged.

---

## Implementation Order

1. `src/lib/spa-catalog.ts` — add `featured` sort (no dependencies)
2. `src/components/SpasListingClient.tsx` — create client island (depends on step 1 for `'featured'` default)
3. `src/app/spas/page.tsx` — rewrite as server page (depends on step 2)
4. `.claude/diagrams/06-filtering-logic.md` — update diagram (depends on steps 2 and 3 being complete)

---

## Pre-implementation Checks

- Confirm the production domain / base URL for the JSON-LD schema (check `next.config.ts`, `.env`, or any existing schema on other pages).
- Run `npm run typecheck` after step 1 to verify `SpaSortOption` changes don't break other consumers of the type.
- Run `npm test` after all changes — spa data and filtering tests should be unaffected. No new tests are required.

---

## What Is NOT Changed

- `src/app/spa-days/page.tsx` — untouched
- `src/app/spa-treatments/page.tsx` — untouched
- `src/hooks/listing/usePagination.ts` — untouched (still used by other pages)
- `src/components/listing/PaginationControls.tsx` — untouched
- `src/components/SpaGrid.tsx` — untouched
- `src/components/FilterModal.tsx` — untouched
- All filter logic in `src/lib/spa-catalog.ts` except the sort additions
- Hero section copy and layout — identical to current
- Filter bar layout and behaviour — identical to current
- Empty state copy — identical to current
