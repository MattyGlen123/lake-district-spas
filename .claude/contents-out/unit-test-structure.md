# Implementation Plan — Test Suite Reorganisation

## Feature Overview

The existing test suite is a flat `src/__tests__/` folder containing 29 Vitest files with no structural distinction between unit and integration tests. Playwright E2E specs live in a root `e2e/` folder with no smoke/E2E split.

This work reorganises the test suite to match the strategy described in `unit-test-structure.md`:
- Vitest tests split into `src/__tests__/unit/` and `src/__tests__/integration/` subfolders
- Playwright specs moved from `e2e/` to `tests/e2e/`, with an empty `tests/smoke/` placeholder created
- Vitest and Playwright configs updated to reflect the new locations
- Stale `test:a11y` npm script removed

No new tests are written. No existing tests are deleted.

---

## TDD Scope Assessment

| Task | Classification | Reason |
|------|---------------|---------|
| Create new directory structure | Non-TDD | Pure file system operation |
| Classify and move 29 Vitest test files | Non-TDD | File moves; no logic written |
| Move `e2e/core-flows.spec.ts` to `tests/e2e/` | Non-TDD | File move |
| Add `tests/smoke/` placeholder | Non-TDD | Directory + placeholder file |
| Update Vitest `include` pattern | Non-TDD | Config change; see ordering note below — must happen after file moves |
| Update `playwright.config.ts` `testDir` | **TDD** | Genuine RED state: after moving specs, Playwright finds no tests until config is updated |
| Remove stale `test:a11y` script | Non-TDD | Deletion, no logic |

---

## Interface Design

### Cycle 1 — `playwright.config.ts` testDir update

**No function signatures** — this cycle modifies a configuration value, not a function. N/A for signatures and return types.

**Config boundary:**

```ts
// playwright.config.ts
// Before
testDir: path.join(__dirname, 'e2e')

// After
testDir: path.join(__dirname, 'tests')
```

**Dependencies and boundaries:**
- **Real (nothing mocked):** Playwright runs against the real filesystem. No mocks. The test runner itself is the assertion mechanism — `npm run test:e2e` either finds specs or it doesn't.
- **Boundary:** `playwright.config.ts` is the only file Playwright reads for `testDir`. Changing this value is the complete and total fix.
- **Side effect:** `testDir: './tests'` means Playwright will also scan `tests/smoke/` once specs exist there. The empty `tests/smoke/` folder (with only a `README.md`) does not affect this — Playwright ignores non-spec files.

### Vitest config — updated `include` pattern (Non-TDD)

```ts
// vitest.config.ts
// Before
include: ['src/**/*.{test,spec}.{ts,tsx}']

// After — explicit, self-documenting
include: [
  'src/__tests__/unit/**/*.{test,spec}.{ts,tsx}',
  'src/__tests__/integration/**/*.{test,spec}.{ts,tsx}',
]
```

The current glob already covers the new subfolders recursively. The update makes intent explicit and prevents test files placed outside the subfolders from being silently picked up.

> **Ordering constraint:** This config change must be applied **after** all 29 test files have been moved to their subfolders (Non-TDD step 2). Applying it first would leave `npm test` finding 0 tests, since no files exist yet in `unit/` or `integration/`.

---

## Red-Green Test Cycles

```
Cycle 1: Playwright discovers specs in tests/e2e/ after testDir is updated

  RED:   "finds no E2E specs when testDir still points to the old e2e/ directory"
         — fails because e2e/core-flows.spec.ts has been moved to tests/e2e/
           but playwright.config.ts testDir still resolves to ./e2e (now empty)
         — run: npm run test:e2e → exits "No tests found"

  GREEN: "finds and runs all E2E specs after testDir is updated to ./tests"
         — passes with: update playwright.config.ts testDir to path.join(__dirname, 'tests')
         — run: npm run test:e2e → all tests in tests/e2e/ are discovered and pass
```

---

## Refactor Notes

After all cycles are green and the full suite passes:

1. **Review test file naming for folder-context loss** — some filenames rely on the `__tests__/` location to signal their subject (e.g. `utils.test.ts` is ambiguous in a `unit/` subfolder; `spa-days.page.test.tsx` is clear in either). Rename any files where dropping the flat-folder context makes the subject unclear.

2. **Check for cross-folder duplication** — now that unit and integration tests are visually separated, scan for tests in `integration/` that are really just elaborate unit tests (everything mocked except one thing). These are candidates for deletion or relocation.

3. **`tests/smoke/` placeholder** — a `README.md` is preferred over `.gitkeep` so the folder's purpose is self-documenting. The README content is specified in Non-TDD step 4 below.

---

## Non-TDD Work

### 1. Create directory structure

```
src/__tests__/unit/          ← new
src/__tests__/integration/   ← new
tests/e2e/                   ← new (replaces e2e/ at root)
tests/smoke/                 ← new (empty placeholder)
```

### 2. Classify and move Vitest test files

**Unit** — pure functions, single module, no component rendering (10 files):

| File | Destination |
|------|-------------|
| `blog.test.ts` | `src/__tests__/unit/` |
| `faq-schema.test.ts` | `src/__tests__/unit/` |
| `filtering.test.ts` | `src/__tests__/unit/` |
| `listing.page-tokens.test.ts` | `src/__tests__/unit/` |
| `location-pages.test.ts` | `src/__tests__/unit/` |
| `spa-data.test.ts` | `src/__tests__/unit/` |
| `spa-intro-validation.test.ts` | `src/__tests__/unit/` |
| `spa-outbound-click-tracker.test.ts` | `src/__tests__/unit/` |
| `spa-schema.test.ts` | `src/__tests__/unit/` |
| `utils.test.ts` | `src/__tests__/unit/` |

**Integration** — component rendering, multi-unit interaction (19 files):

| File | Destination |
|------|-------------|
| `BlogCard.test.tsx` | `src/__tests__/integration/` |
| `BookVisitCTA.test.tsx` | `src/__tests__/integration/` |
| `Breadcrumbs.test.tsx` | `src/__tests__/integration/` |
| `DayPasses.test.tsx` | `src/__tests__/integration/` |
| `FAQs.test.tsx` | `src/__tests__/integration/` |
| `faqs-lodore-falls.test.tsx` | `src/__tests__/integration/` |
| `FilterModal.test.tsx` | `src/__tests__/integration/` |
| `listing.use-draft-filters.test.tsx` | `src/__tests__/integration/` |
| `prices.test.tsx` | `src/__tests__/integration/` |
| `QuickFactsBar.test.tsx` | `src/__tests__/integration/` |
| `RelatedSpas.test.tsx` | `src/__tests__/integration/` |
| `SideMenu.test.tsx` | `src/__tests__/integration/` |
| `SpaAccessBadges.test.tsx` | `src/__tests__/integration/` |
| `SpaCard.test.tsx` | `src/__tests__/integration/` |
| `SpaNavigation.test.tsx` | `src/__tests__/integration/` |
| `Treatments.test.tsx` | `src/__tests__/integration/` |
| `blog-price-components.test.tsx` | `src/__tests__/integration/` |
| `spa-days.page.test.tsx` | `src/__tests__/integration/` |
| `spa-treatments.page.test.tsx` | `src/__tests__/integration/` |

### 3. Move Playwright spec

`e2e/core-flows.spec.ts` → `tests/e2e/core-flows.spec.ts`

### 4. Add smoke placeholder

Create `tests/smoke/README.md`:
```md
# Smoke Tests

Smoke tests are a quick "is it alive?" sanity check run on every deployment.
They should complete in under 2 minutes.

See docs: .claude/contents-in/unit-test-structure.md
```

### 5. Update Vitest config

`vitest.config.ts` — replace the `include` pattern as shown in Interface Design above.
**Must run after step 2** (all files moved) to avoid a window where `npm test` finds 0 tests.

### 6. Update Playwright config

`playwright.config.ts` — update `testDir` as shown in Interface Design above. This is the GREEN step in Cycle 1.

### 7. Remove stale npm script

`package.json` — delete the `"test:a11y"` script. It references `e2e/a11y.spec.ts` which was removed in a prior consolidation and does not exist in the new structure either.

### 8. Delete the now-empty `e2e/` directory

After moving `core-flows.spec.ts`, delete the root `e2e/` folder.
