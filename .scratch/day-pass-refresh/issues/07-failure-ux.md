# Failure UX: filed issues, not-fetched table, Playwright fallback

Status: closed
Type: AFK
Assignee: claude (session 2026-08-01, branch refresh/07-failure-ux)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (failure UX, blocked tier, fallbacks).

## What to build

A failed spa never blocks the run: retry with backoff, then exclude the spa (entries and `lastVerified` untouched), file one issue per failure on the project tracker (error, URL, retry log), and render the PR's "Not fetched" table with a link to each filed issue. Re-run path is `--spa <id>` after the fix. Add the Playwright fallback for the `blocked` tier (Old England 6, curl 403) using the repo's existing Playwright setup — fallback output saved as the fetch artifact like any other tier.

## Acceptance criteria

- [x] A forced fetch failure produces: partial PR, untouched entries, a filed issue with error + retry log, and a not-fetched table row linking it
- [x] `/refresh-day-passes --spa 6` succeeds via Playwright fallback (or files a failure issue if still blocked), with quotes grounded against the saved fallback artifact
- [x] Post-run: stale `lastVerified` = exactly the failed/flagged set for the spas targeted

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)

## Comments

**Resolution** (2026-08-01, Claude agent): Built and demoed. Fetch scripts with retry+backoff and JSON retry logs: `scripts/fetch.mjs` (curl, 3 attempts 2s/8s, `botBlocked` marker on 403, deletes error-page artifacts so gates never grep them) and `scripts/fetch-playwright.mjs` (chromium via repo's `@playwright/test`, browser UA, rendered `page.content()` saved as the artifact, 2 attempts, appends to the same retry log). Post-run invariant checker `scripts/check-invariant.mjs` (stale `lastVerified` = exactly failed/flagged set; parses data files, routes on gate-results presence; 6 unit tests in `tests/unit/refresh-day-passes-invariant.test.ts`). SKILL.md: blocked tier goes straight to Playwright; html-tier 403s fall back to it; failure lane files one `.scratch/day-pass-refresh/issues/<NN>-fetch-failure-spa-<id>-<date>.md` (needs-triage, error + URL + retry log + `--spa` re-run line) per failed spa and renders the ❌ not-fetched row linking it. Demo run PR [#18](https://github.com/MattyGlen123/lake-district-spas/pull/18): spa 6 fetched via Playwright (curl 403 from the audit didn't reproduce — got 200 — but blocked tier routes to Playwright regardless), 6/6 passes grounded against the rendered artifact, 0 changes, 6 `lastVerified` bumps; forced failure via fixture spa 999 (bogus URL, `fixtures/spa-999-day-passes.ts`) filed [issue 10](10-fetch-failure-spa-999-2026-08-01.md) + not-fetched table row; invariant check passed both lanes (0 violations). Note: curl getting 200 on macdonaldhotels suggests the bot-block is intermittent; keeping spa 6 on the blocked tier is still correct.
