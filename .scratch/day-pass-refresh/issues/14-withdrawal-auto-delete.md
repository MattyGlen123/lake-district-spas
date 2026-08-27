# Withdrawal engine: auto-delete proven-withdrawn passes

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §4a (withdrawals), added by the
2026-08-27 amendment. Raised by Matthew after the Daffodil run
(PR #36) flagged four dead packages that would otherwise be re-flagged every month forever.

## What changed

§1 and §8 said **never auto-delete**. They now permit deletion of a *proven withdrawal* only.
"Missing" (we could not read a price) is still not "withdrawn" (the spa no longer sells it).

Landed in this change:

- `scripts/withdraw.mjs` — `classifyWithdrawal`, `findIdReferences`, `findEnclosingObject`,
  `removeEntryFromDataFile`, `applyWithdrawalToFiles`, plus a CLI that refuses to write while any
  reference to the id survives.
- `tests/unit/refresh-day-passes-withdraw.test.ts` — 23 tests.
- `check-invariant.mjs` — reads `spa-<id>-withdrawals.json` and reconciles two-way.
- `SKILL.md` §4b, PRD §1/§4a/§6/§8/§9.

## The five conditions

All must hold; any one missing leaves the pass as today's ⚠️ flag.

1. `pageGone` — the pass's page returns 404/410 (not a timeout/403/5xx).
2. `absentFromIndex` — absent from the spa's own listing page, fetched this run.
3. `noSuccessor` — `classifySuccessors` offered no strict-1:1 successor.
4. `priorSighting` — a previous run's `spa-<id>-withdrawal-candidates.json` names it.
5. `noReferences` — nothing in the repo cites the pass id.

### Why condition 5 exists

`getDayPassPrice` returns `null` for an unknown id, and every call site falls back to a hardcoded
literal:

```tsx
// src/data/faqs/spa-4-faqs.tsx
Full spa days with treatments start at {itsAllGoodWeekdayPrice || '£170'} for the It's All Good package
```

Deleting a referenced pass therefore does **not** break the build, fail a test, or leave a visible
gap — it silently freezes a dead package's price into the page and keeps advertising it. Exactly the
stale claim the §5 gates exist to prevent.

## Remaining work (this issue)

Conditions 1–4 are currently established **by the caller** and handed to `classifyWithdrawal`.
Only condition 5 is enforced end-to-end inside the script. To close:

- [ ] Read `pageGone` directly from `spa-<id>-fetch-log.json` (`httpCode` 404/410 for that pass's page).
- [ ] Take a listing-page artifact path as input and derive `absentFromIndex` by grepping it, rather
      than trusting a caller-supplied boolean. Needs a per-spa `listingUrl` — most spas have one
      (`/offers/`, `/spa-days/`); record it where `dayPassUrl` lives, or in a tier table.
- [ ] Read `noSuccessor` from the run's successor output file.
- [ ] Resolve `priorSighting` by locating the most recent prior run dir automatically (currently the
      caller must find and pass it).
- [ ] Emit `spa-<id>-withdrawal-candidates.json` from the script rather than by hand — a missed
      ledger write means the second sighting can never happen, which silently disables deletion.

## Not in scope

- Deleting a pass whose page merely failed to fetch. That is the failure lane (SKILL step 1).
- Rewriting prose that mentions a withdrawn package by name — flagged, never rewritten, same as the
  rename policy.
