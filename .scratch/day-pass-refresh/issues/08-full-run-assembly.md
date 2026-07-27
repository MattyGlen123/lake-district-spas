# Full-run assembly: multi-spa, `--tier`, complete PR anatomy

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §1 (flags), §6, §7 constants and invariant.

## What to build

Make the skill run across many spas in one invocation: default = all 15, `--spa` accepts a list, `--tier` scopes by fetch tier. Assemble the complete PR body per the normative template (adopted verbatim): header stats line + "deletes nothing" statement, then price changes → missing-flags → promo notes (list price kept, promo as evidence) → not-fetched table → verified-unchanged collapsed `<details>` with per-spa samples → diff summary table. Enforce the post-run invariant as a self-check the skill reports: stale `lastVerified` = exactly the failed/flagged set.

## Acceptance criteria

- [ ] A multi-spa run (mixed tiers) yields one PR with all template sections in order, ℹ️ normalization notes inline, evidence.md linked
- [ ] `--tier` and multi-value `--spa` scope correctly; unscoped run covers all 15
- [ ] Invariant self-check passes on a mixed run containing at least one failure and one flag

## Blocked by

- [02 Gate suite](02-gate-suite.md)
- [03 Portal tier](03-portal-tier.md)
- [04 PDF tier](04-pdf-tier.md)
- [05 Matching cascade + rename engine](05-matching-rename-engine.md)
- [07 Failure UX](07-failure-ux.md)
