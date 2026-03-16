# Implementation Plan — Restructure Tests

Based on answers: Q1.C · Q2.A · Q3.B · Q4.A · Q5.A · Q6.A · Q7.A · Q8.B · Q9.A · Q10.A · Q11.A

---

## Overview

Move unit and integration tests out of `tests/unit/` and `tests/integration/` so they sit alongside the source files they test. Two exceptions stay in their current folders: `spa-intro-validation.test.ts` (spans many files) and the two page-level tests (which stay in `tests/integration/` but are renamed to drop the `.page.` infix). E2E tests are untouched. One refactor step is required before moving `faq-schema.test.ts`.

---

## Pre-flight checks

Before starting:
```bash
npm test           # confirm all tests pass
npm run typecheck  # confirm no TS errors
```

---

## Step 1 — Refactor: extract `generateFAQSchema` into its own utility

**Why this must happen first:** `faq-schema.test.ts` (Q3.B) should collocate with the source it tests. Currently `generateFAQSchema` is defined inside `src/components/FAQs.tsx`. It needs to live in its own file to allow collocation without a naming collision with the component's own test.

### 1a. Create `src/utils/generateFAQSchema.ts`

Extract `generateFAQSchema` from `src/components/FAQs.tsx` into a new file at `src/utils/generateFAQSchema.ts`. Re-export from `FAQs.tsx` or update the import at the call site in `src/app/spa/[slug]/page.tsx`.

### 1b. Update imports

- In `src/components/FAQs.tsx` — remove the function definition, add import from `@/utils/generateFAQSchema`
- In `src/app/spa/[slug]/page.tsx` — update import path if it currently imports from `FAQs.tsx` directly

### 1c. Run typecheck to confirm no regressions
```bash
npm run typecheck
```

---

## Step 2 — Move unit tests (collocate)

Move each file, update the import paths inside the test if they use relative paths (most use `@/` aliases so no changes needed).

| From | To |
|------|----|
| `tests/unit/blog.test.ts` | `src/lib/blog.test.ts` |
| `tests/unit/faq-schema.test.ts` | `src/utils/generateFAQSchema.test.ts` |
| `tests/unit/filtering.test.ts` | `src/lib/spa-catalog.test.ts` |
| `tests/unit/spa-data.test.ts` | `src/data/spas.test.ts` |
| `tests/unit/location-pages.test.ts` | `src/lib/locationPages.test.ts` |
| `tests/unit/spa-schema.test.ts` | `src/utils/generateSpaSchema.test.ts` |
| `tests/unit/listing.page-tokens.test.ts` | `src/lib/listing/pageTokens.test.ts` |
| `tests/unit/utils.test.ts` | `src/lib/utils.test.ts` |
| `tests/unit/spa-outbound-click-tracker.test.ts` | `src/components/GoogleAnalytics.test.ts` |

**Stays in `tests/unit/`:**
- `tests/unit/spa-intro-validation.test.ts` — spans all individual spa data files with no single source home

---

## Step 3 — Move integration tests (collocate with components)

| From | To |
|------|----|
| `tests/integration/BlogCard.test.tsx` | `src/components/BlogCard.test.tsx` |
| `tests/integration/BookVisitCTA.test.tsx` | `src/components/BookVisitCTA.test.tsx` |
| `tests/integration/Breadcrumbs.test.tsx` | `src/components/Breadcrumbs.test.tsx` |
| `tests/integration/DayPasses.test.tsx` | `src/components/DayPasses.test.tsx` |
| `tests/integration/FAQs.test.tsx` | `src/components/FAQs.test.tsx` |
| `tests/integration/FilterModal.test.tsx` | `src/components/FilterModal.test.tsx` |
| `tests/integration/QuickFactsBar.test.tsx` | `src/components/QuickFactsBar.test.tsx` |
| `tests/integration/RelatedSpas.test.tsx` | `src/components/RelatedSpas.test.tsx` |
| `tests/integration/SideMenu.test.tsx` | `src/components/SideMenu/SideMenu.test.tsx` |
| `tests/integration/SpaAccessBadges.test.tsx` | `src/components/SpaAccessBadges.test.tsx` |
| `tests/integration/SpaCard.test.tsx` | `src/components/SpaCard.test.tsx` |
| `tests/integration/SpaNavigation.test.tsx` | `src/components/SpaNavigation.test.tsx` |
| `tests/integration/Treatments.test.tsx` | `src/components/Treatments.test.tsx` |

---

## Step 4 — Move integration tests (collocate with non-component source files)

| From | To | Reason |
|------|----|----|
| `tests/integration/prices.test.tsx` | `src/lib/prices.test.tsx` | Tests `getLowestDayPassPrice` / `getLowestTreatmentPrice` from `src/lib/prices.ts` |
| `tests/integration/blog-price-components.test.tsx` | `src/app/blog/[slug]/page.test.tsx` | `SpaAccessPrice`, `DayPassPrice` etc. are defined as inline components inside `src/app/blog/[slug]/page.tsx`. This is not a full page test — it tests specific MDX component logic that happens to be defined in the page file. The name `page.test.tsx` is correct: it matches `page.tsx`. |
| `tests/integration/faqs-lodore-falls.test.tsx` | `src/data/faqs/spa-1-faqs.test.tsx` | Tests FAQ rendering for Lodore Falls (spa id: 1); collocates with `src/data/faqs/spa-1-faqs.tsx` |
| `tests/integration/listing.use-draft-filters.test.tsx` | `src/hooks/listing/useDraftFilters.test.ts` | Tests `useDraftFilters` hook; consistent with already-collocated `usePagination.test.ts` |

---

## Step 5 — Page tests: rename, stay in `tests/integration/`

These stay in `tests/integration/` per the page-test exception, but the `.page.` segment is dropped so the filename matches the route name — consistent with the PRD convention ("the file should be named `about.test.ts`"):

| From | To |
|------|----|
| `tests/integration/spa-days.page.test.tsx` | `tests/integration/spa-days.test.tsx` |
| `tests/integration/spa-treatments.page.test.tsx` | `tests/integration/spa-treatments.test.tsx` |

No import or config changes required — Vitest discovers them by glob.

---

## Step 6 — E2E tests: no change

- `tests/e2e/core-flows.spec.ts` — untouched (Q10.A)

---

## Step 7 — Update `vitest.config.ts`

Add `src/**/*.test.{ts,tsx}` to the `include` array so Vitest picks up all collocated tests.

**Current `include`:**
```ts
include: ['tests/unit/**', 'tests/integration/**']
```

**Updated `include`:**
```ts
include: [
  'tests/unit/**',          // spa-intro-validation.test.ts
  'tests/integration/**',   // spa-days.test.tsx, spa-treatments.test.tsx
  'src/**/*.test.{ts,tsx}', // all collocated tests
]
```

The existing entries remain so the two page tests and `spa-intro-validation.test.ts` continue to be discovered. After the moves, each `tests/` subfolder contains only the files shown in the comments above — they can be collapsed to explicit paths in a future cleanup pass if desired.

---

## Step 8 — Verify

```bash
npm test           # all tests must pass
npm run typecheck  # no new TS errors
```

Check the test count matches the previous run (should be the same number — only locations changed, no tests added or removed).

---

## Step 9 — Update documentation

### MEMORY.md

Update the **Test file locations** section to reflect:
- Unit tests now sit alongside source files in `src/`
- Integration tests now sit alongside component files in `src/components/`
- `tests/unit/` contains only `spa-intro-validation.test.ts`
- `tests/integration/` contains only page tests (`spa-days.test.tsx`, `spa-treatments.test.tsx`)
- Vitest `include` now also covers `src/**/*.test.{ts,tsx}`

### CLAUDE.md

Update the **Testing** section to describe the collocated test pattern and note that page-level tests remain in `tests/integration/`.

---

## Final folder state (after all moves)

```
src/
├── components/
│   ├── BlogCard.test.tsx          ← moved
│   ├── BookVisitCTA.test.tsx      ← moved
│   ├── Breadcrumbs.test.tsx       ← moved
│   ├── DayPasses.test.tsx         ← moved
│   ├── FAQs.test.tsx              ← moved
│   ├── FilterModal.test.tsx       ← moved
│   ├── GoogleAnalytics.test.ts    ← moved (was spa-outbound-click-tracker)
│   ├── QuickFactsBar.test.tsx     ← moved
│   ├── RelatedSpas.test.tsx       ← moved
│   ├── SideMenu/
│   │   └── SideMenu.test.tsx      ← moved
│   ├── SpaAccessBadges.test.tsx   ← moved
│   ├── SpaCard.test.tsx           ← moved
│   ├── SpaNavigation.test.tsx     ← moved
│   └── Treatments.test.tsx        ← moved
├── data/
│   ├── spas.test.ts               ← moved (was spa-data)
│   └── faqs/
│       └── spa-1-faqs.test.tsx    ← moved (was faqs-lodore-falls)
├── app/
│   └── blog/
│       └── [slug]/
│           └── page.test.tsx      ← moved (was blog-price-components)
├── hooks/
│   └── listing/
│       ├── usePagination.test.ts  ← already collocated (unchanged)
│       └── useDraftFilters.test.ts ← moved
└── lib/
    ├── blog.test.ts               ← moved
    ├── locationPages.test.ts      ← moved
    ├── prices.test.tsx            ← moved
    ├── spa-catalog.test.ts        ← moved (was filtering)
    ├── utils.test.ts              ← moved
    └── listing/
        └── pageTokens.test.ts     ← moved

src/utils/
    ├── generateSpaSchema.ts       ← existing
    ├── generateSpaSchema.test.ts  ← moved
    ├── generateFAQSchema.ts       ← NEW (extracted from FAQs.tsx)
    └── generateFAQSchema.test.ts  ← moved (was faq-schema)

tests/
├── unit/
│   └── spa-intro-validation.test.ts  ← stays
├── integration/
│   ├── spa-days.test.tsx             ← renamed (was spa-days.page.test.tsx)
│   └── spa-treatments.test.tsx       ← renamed (was spa-treatments.page.test.tsx)
└── e2e/
    └── core-flows.spec.ts            ← untouched
```

---

## Risk notes

- **Step 1 is the only refactor** — all other steps are file moves. Complete Step 1 in isolation and run tests before proceeding.
- **Naming clash avoided** — `faq-schema.test.ts` does not become `FAQs.test.ts`; extracting the function to its own util avoids a collision with the component test.
- **`useDraftFilters.test.ts` extension** — the test uses `renderHook` but no JSX syntax, so `.ts` is valid. If Vitest complains, rename to `.tsx`.
- **Pre-commit hook** — typecheck + test run on every commit. Move in batches and commit after each step (Step 1 alone, then Steps 2–4, then Steps 5–9) to keep the hook green throughout.
