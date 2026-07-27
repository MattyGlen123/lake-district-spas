# Failure UX: filed issues, not-fetched table, Playwright fallback

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (failure UX, blocked tier, fallbacks).

## What to build

A failed spa never blocks the run: retry with backoff, then exclude the spa (entries and `lastVerified` untouched), file one issue per failure on the project tracker (error, URL, retry log), and render the PR's "Not fetched" table with a link to each filed issue. Re-run path is `--spa <id>` after the fix. Add the Playwright fallback for the `blocked` tier (Old England 6, curl 403) using the repo's existing Playwright setup — fallback output saved as the fetch artifact like any other tier.

## Acceptance criteria

- [ ] A forced fetch failure produces: partial PR, untouched entries, a filed issue with error + retry log, and a not-fetched table row linking it
- [ ] `/refresh-day-passes --spa 6` succeeds via Playwright fallback (or files a failure issue if still blocked), with quotes grounded against the saved fallback artifact
- [ ] Post-run: stale `lastVerified` = exactly the failed/flagged set for the spas targeted

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
