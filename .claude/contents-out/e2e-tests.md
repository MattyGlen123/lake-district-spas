# E2E Tests — Implementation Plan

## Problem

E2E tests have inflated prod analytics. Root cause is uncertain — either someone pointed tests at the prod URL directly, or GA/GTM fired during localhost test runs (GTM container `GTM-55LJRB7F` is hardcoded and always loads unconditionally). Both scenarios need to be closed off.

## Two-Part Fix

### 1. Playwright config guard — block non-localhost baseURL

**File:** `playwright.config.ts`

Add a localhost enforcement check at config load time. If the resolved `baseURL` is not localhost, throw an error before any tests run.

```ts
const PORT = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Guard: e2e tests must only run against localhost
const parsedURL = new URL(baseURL);
if (parsedURL.hostname !== 'localhost' && parsedURL.hostname !== '127.0.0.1') {
  throw new Error(
    `E2E tests must only run against localhost. Blocked: ${baseURL}`
  );
}
```

This covers the case where someone sets `BASE_URL` to a prod/staging URL and runs tests.

---

### 2. GA/GTM suppression in non-production environments

**File:** `src/components/GoogleAnalytics.tsx`

The GTM container ID is hardcoded and loads unconditionally. Wrap the entire component return in a production-only guard so neither GTM nor the outbound click tracker loads in `development` or `test` environments.

```tsx
export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* existing Script tags unchanged */}
    </>
  );
}
```

This ensures:
- Local `npm run dev` → GA silent
- Local `npm run test:e2e` → GA silent (Next.js test runs use `NODE_ENV=test`)
- Deployed prod build → GA fires normally (Next.js sets `NODE_ENV=production` for `next build` + `next start`)

---

## Files Changed

| File | Change |
|------|--------|
| `playwright.config.ts` | Add hostname guard that throws on non-localhost `baseURL` |
| `src/components/GoogleAnalytics.tsx` | Return `null` when `NODE_ENV !== 'production'` |

## Files NOT Changed

- `src/components/GoogleAnalytics.test.ts` — existing tests mock the component; no test changes needed
- `.env.local` — `NEXT_PUBLIC_GA_MEASUREMENT_ID` can stay (it's not referenced by GTM anyway — GTM ID is hardcoded)
- `tests/e2e/core-flows.spec.ts` — no spec changes needed

## Test Plan

1. Run `npm run test:e2e` — should pass, GA scripts should not appear in page HTML
2. Run `BASE_URL=https://example.com npx playwright test` — should throw immediately with the blocked URL error message
3. Run `npm run build && npm run start` — GA scripts should load in the built prod server
4. Run `npm run dev` — GA scripts should NOT load

## Notes

- The `NODE_ENV` check is evaluated server-side at render time for the `GoogleAnalytics` server component parent, but since `GoogleAnalytics.tsx` is a `'use client'` component, `process.env.NODE_ENV` is inlined at build time by Next.js/Webpack. In dev mode it will be `'development'`; in a prod build it will be `'production'`. This is safe and well-supported.
- The Playwright guard uses `throw` (not `console.warn`) so the failure is hard and visible in CI output.
