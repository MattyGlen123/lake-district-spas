# Successor suggestions + `--accept-successor`

Status: closed
Type: AFK
Assignee: Claude (agent, 2026-08-06)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §4 (seasonal replacement = rename-plus), §1 flags.

## What to build

Detect seasonal replacements under the strict 1:1 rule: exactly one vanished existing pass structurally matching exactly one unmatched new pass → render "possible successor: X → Y" in the PR's missing-flag section with match evidence (price, shape, availability, positional replacement), never auto-applied. `--accept-successor <existing-id>` on a re-run applies it via the full rename engine (re-slug, mechanical rewrites, prose flags). Multi-candidate ambiguity, no-predecessor additions, and apparent merges stay ⚠️ flag + ℹ️ note — discovery remains out of scope.

## Acceptance criteria

- [x] A vanished pass with one structural match renders a successor suggestion with evidence; with two candidates it renders a plain missing-flag + notes
- [x] `--accept-successor <id>` re-run applies the rename through the engine and the priced-content validation stays green
- [x] Nothing is ever added or renamed without the flag→accept round-trip

## Blocked by

- [05 Matching cascade + rename engine](05-matching-rename-engine.md)

## Comments

**Resolution** (2026-08-06, Claude agent): Built as a pure-function module layered on top of 05's `matching.mjs`/`rename.mjs`, on the same stacked branch.

- `.claude/skills/refresh-day-passes/scripts/successor.mjs` — `classifySuccessors(existingPasses, fetchedPasses, matchResult)` applies the strict-1:1 rule: a spa's WHOLE post-tier-1/2 leftover pool (`missingFlags.length + tier3Suggestions.length` on the existing side, `unmatchedFetched.length + tier3Suggestions.length` on the fetched side) must be exactly 1 and 1, AND that pair must have cleared `TIER3_THRESHOLD`, before it's rendered as a `successors` entry (`{ existingId, existingName, fetchedName, score, evidence }`). Anything else — two+ vanished passes, two+ unmatched passes, a no-predecessor addition, an apparent merge — demotes any `tier3Suggestions` for that spa back to plain `missingFlags`/`unmatchedFetched`, even though `matchPasses`'s greedy tier-3 loop will still have picked an arbitrary "winner" internally; `classifySuccessors` overrides that winner rather than trusting it. `buildSuccessorEvidence` renders price, duration, inclusions-shape overlap, `daysAvailable` ("availability"), and same-list-index ("positional replacement") evidence lines — the four evidence categories named in PRD §4 — using whichever fields both sides actually have. `applySuccessor(successor, siblingIds, files)` composes `rename.mjs`'s `planRename` + `applyRenameToFiles` unchanged, so an accepted successor goes through the identical re-slug/mechanical-rewrite/prose-flag path as a tier-1 auto-rename (including the same slug-collision refusal). A thin CLI (`node successor.mjs existing.json fetched.json matchResult.json`) mirrors `matching.mjs`'s for ad-hoc inspection.
- 10 unit tests in `tests/unit/refresh-day-passes-successor.test.ts`: evidence formatting (all fields present; fields absent/positional-mismatch skipped), the clean 1:1-with-match success case, a 1:1 pair that never clears the similarity bar (stays plain flag), two-vanished-one-candidate and one-vanished-two-candidates ambiguity (both demote to plain flags/notes, confirmed against `matchPasses`'s actual greedy output rather than a hand-built fixture), a no-predecessor addition (untouched pass-through), an apparent merge, and `applySuccessor`'s happy path + slug-collision refusal reusing the rename-engine fixture shape from issue 05's tests.
- SKILL.md: `--accept-successor` flag line marked Implemented; step 2 gained a "Successor suggestions (strict 1:1, PRD §4)" subsection wiring `successor.mjs` after `matching.mjs`, plus an `--accept-successor` re-run subsection describing the re-fetch → re-match → re-classify → `applySuccessor` flow (never falls back to a manual rename if the id no longer matches a `successors` entry on re-run). Evidence-file and PR-body sections (steps 6/7) updated to mention "possible successor: X → Y" alongside the existing tier-3 "possible rename" line. Removed the now-built successor bullet from "Later slices" (portal/pdf tiers and gates 2-5 remain, since issues 02-04 are still open).
- `npm run typecheck && npm test` green (717 tests, 44 files — up from 707/43 on the 05 base). Draft PR: [#PENDING](https://github.com/MattyGlen123/lake-district-spas/pulls) on branch `refresh/06-successor-suggestions`, based on `refresh/05-matching-rename-engine`.
- Deviation/design call: the PRD's "exactly one vanished existing pass structurally matching one new pass" is implemented as a spa-wide pool-size check (total leftovers after tiers 1-2 on each side), not a pairwise candidate-count check per suggestion. This is what the 05 handoff text ("filter to spas with exactly one vanished existing pass and one unmatched fetched pass") describes, and it's the only reading that gives clean, deterministic answers for all four PRD-named failure modes (multi-candidate ambiguity, no-predecessor addition, apparent merge, non-matching 1:1 pair) without re-deriving `matchPasses`'s internal candidate search. Flagging in case a reviewer wants finer-grained pairwise ambiguity detection later.
- No live demo run: like 05, this is a library slice verified by unit/fixture tests — a real successor situation (a spa's page changing enough to trigger strict 1:1) can't be manufactured on demand. Exercised end-to-end in 08/09.
- For issue 08 (full-run assembly): `classifySuccessors` needs to run per spa, after `matchPasses`, using the SAME `existing`/`fetched` arrays already built for matching (no new data collection). Its `successors` output slots into the PR's ⚠️ missing-flag section next to tier-3 renames; on a targeted `--accept-successor <id>` re-run, 08's driver should re-run fetch+match+classify for that spa, find the matching `successors` entry, and call `applySuccessor` — never persist/trust a suggestion from a previous run's evidence.md without recomputing it fresh.
