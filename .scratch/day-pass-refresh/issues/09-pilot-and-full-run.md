# Pilot run (3 spas), review, then full 15-spa run

Status: ready-for-human
Type: HITL
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §7.

## What to build

The mandated rollout: run `/refresh-day-passes --spa 13,9,2` (Whitewater, Lakeside, Armathwaite — covering clean-HTML-with-drift, per-couple, missing-flag, portal-pence, and PDF lanes). Matthew reviews the pilot PR end-to-end: evidence quality, flag lanes, template rendering, invariant. Feedback becomes fixes (or new tickets) before any full run. Then run the full 15-spa refresh and merge. Expected findings will have drifted beyond the 2026-07-24 audit baseline (Whitewater +17–25%, Low Wood Bay underpricing, Daffodil 404s, Swan successor, Old England 403).

## Acceptance criteria

- [ ] Pilot PR produced and reviewed by Matthew; feedback addressed
- [ ] Full 15-spa run produced, reviewed, merged; post-run stale-`lastVerified` invariant holds site-wide
- [ ] Fetch-failure issues (if any) filed and triaged

## Blocked by

- [08 Full-run assembly](08-full-run-assembly.md) (and via it, all other slices)
- [06 Successor suggestions](06-successor-suggestions.md)
