# Map: Day Pass Data Freshness

Labels: wayfinder:map

## Destination

A **locked spec** (PRD.md in this directory) for a manually-triggered automation that fetches every listed spa's day-pass data from its source (website or PDF), diffs against `src/data/day-passes/`, and opens a spot-checkable PR. Implementation is a separate follow-on effort — this map ends when nothing is left to decide before building.

## Notes

- Skills to consult per ticket type: `/research`, `/prototype`, `/grilling`, `/domain-modeling`.
- Standing preferences (settled during charting):
  - **Never auto-delete**: passes missing from a fetch are flagged in the PR, not removed.
  - **Evidence per change**: each proposed change cites the exact scraped text + source URL/PDF.
  - **Scope**: refresh existing passes only — 15 spas currently have day-pass files (spas 1, 2, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 19).
  - **Trigger**: manual only; user is happy to spend their own tokens; MCP/integration choices delegated to research.
- Useful existing facts: every `DayPassOption` already has `dayPassUrl`, `bookingUrl`, and a `lastVerified` date field. A build-time validation test (`src/data/priced-content.test.ts`) replays every FAQ/MDX day-pass reference against live data — renames/id changes can break FAQ and blog content.

## Decisions so far

<!-- one line per closed ticket: gist + link -->

## Not yet specified

- Operational detail of the chosen fetch mechanism (secrets/keys, MCP server setup, rate limits, cost envelope) — can't be specified until [Fetch & extraction mechanism](issues/01-fetch-mechanism.md) lands.
- Whether/how the spec should version or stage rollout (e.g. run on 3 spas first) — depends on confidence shape that emerges from verification discussion.

## Out of scope

- **Discovering new day passes or new spas** — refresh-existing-only was chosen at charting; discovery is a fresh effort if the destination is later redrawn.
- **Verifying "no day passes" for the 7 spas without day-pass files** (spas 3, 8, 11, 18, 20, 21, 22) — discovery-shaped, same reasoning.
- **Treatments data freshness** — `src/data/treatments/` has the same staleness problem and the eventual mechanism likely generalises, but it's beyond this destination; note for a future effort.
