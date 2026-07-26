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

- [Fetch & extraction mechanism](issues/01-fetch-mechanism.md) — curl (browser UA) + Claude Code reading raw HTML/`__NEXT_DATA__`/PDF, run as a local `/refresh-day-passes` skill opening the PR via `gh`; WebFetch disqualified by probe, GitHub Actions risky (bot-blocking); Playwright and Claude PDF blocks as fallbacks.
- [Source audit of the 15 spas' day-pass pages](issues/02-source-audit.md) — 110 passes audited: 6 entries on dead URLs, 1 bot-blocked spa, 5 spas with prices only in booking portals (fetch `bookingUrl` there), 1 PDF-only spa, widespread real drift (worst: Whitewater +17–25%), and pricing structures a single `priceGBP` can't hold.
- [Rename & id-stability policy](issues/03-rename-id-stability.md) — ids track the current name (re-slug + rewrite all refs in the same PR); matching cascade bookingUrl-item → exact name → structural (tier 3 suggestion-only); flag-never-block; mechanical refs auto-rewritten, prose flagged not rewritten.
- [Seasonal churn vs refresh-only scope](issues/08-seasonal-churn.md) — seasonal replacement = rename-plus: tier-3 suggested rename, strict 1:1 (one vanished ↔ one new, best match only), never auto-applied; recurrence churn accepted; no seasonality schema field (considered-and-rejected — 06 must not reopen); no-predecessor additions stay out of scope.
- [Schema fit: does DayPassOption hold what spas publish?](issues/06-schema-fit.md) — no schema change; all five audit structures become extractor normalization rules: weekday/weekend = duplicate entries stay canonical (one entry per bookable variant, ~40 ids across 7 spas), "from £X" = silent floor in priceGBP (match, not drift), promos = PR-note only (list price canonical), per-hour extensions = prose, per-couple = existing priceGBP+pricePerPerson pattern; zero price-component ripple.
- [PR anatomy & failure UX](issues/04-pr-anatomy.md) — mock PR adopted verbatim as normative template (asset: `.claude/content-out/day-pass-refresh-mock-pr.md`); partial PR on fetch failure + one filed issue per failure; lastVerified bumps on all confirmed-unchanged passes (stale date = exactly the failed/flagged set).

## Not yet specified

- Whether/how the spec should version or stage rollout (e.g. run on 3 spas first) — depends on confidence shape that emerges from verification discussion. The audit's per-spa difficulty tiers (clean HTML / booking-portal / PDF-only / bot-blocked) may become the staging axis.

## Out of scope

- **Discovering new day passes or new spas** — refresh-existing-only was chosen at charting; discovery is a fresh effort if the destination is later redrawn.
- **Verifying "no day passes" for the 7 spas without day-pass files** (spas 3, 8, 11, 18, 20, 21, 22) — discovery-shaped, same reasoning.
- **Treatments data freshness** — `src/data/treatments/` has the same staleness problem and the eventual mechanism likely generalises, but it's beyond this destination; note for a future effort.
- **Inert day-pass anchor links** — found while resolving [Rename & id-stability policy](issues/03-rename-id-stability.md): ~15 blog links use `#<pass-id>` fragments but no component renders matching DOM anchors, so they silently scroll to page top. Pre-existing site bug, not freshness work — fix separately.
