# Matching cascade + rename engine

Status: closed
Type: AFK
Assignee: Claude (agent, 2026-08-06)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §4 (excluding successors).

## What to build

Match each fetched pass to an existing entry via the cascade: (1) booking-portal item id (stable `bookingUrl` path segment) — auto-applies, including renames when the name differs; (2) exact normalized name — auto-applies; (3) structural similarity (price/duration/inclusions) — rendered as "possible rename: X → Y", never applied. On an applied rename: re-slug the id to `<spa-prefix>-<slug-of-new-name>`, auto-rewrite mechanical refs (`dayPassId` props, `#<id>` anchor fragments) in the same PR so the priced-content validation stays green, and flag — not rewrite — prose mentions (case-insensitive grep of the old name, each hit a ⚠️ with file:line + context). Slug collision → flag, never invent a disambiguated id.

Existing entry matched by nothing → ⚠️ missing-from-source flag (data untouched, no `lastVerified` bump). Fetched pass matching nothing → ℹ️ note only.

## Acceptance criteria

- [x] Tier-1 rename end-to-end: id re-slugged, mechanical refs rewritten, `npm test` (incl. priced-content validation) green in the PR branch
- [x] Tier-3 candidates and prose mentions appear as suggestions/flags only; data untouched
- [x] Matching unit-tested per tier, including dead-bookingUrl + changed-name falling to tier 3, and slug collision flagged

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)

## Comments

**Resolution** (2026-08-06, Claude agent): Built and unit-tested as a pair of pure-function libraries plugged into the walking skeleton's stubs.

- `.claude/skills/refresh-day-passes/scripts/matching.mjs` — the three-tier cascade (`matchPasses`): tier 1 `extractBookingItemId` (stable trailing path segment of `bookingUrl`, auto-applies incl. rename on a differing name), tier 2 `normalizeName` exact match (auto-applies), tier 3 `structuralSimilarity` (price/duration/inclusions, weighted 0.5/0.2/0.3, threshold `TIER3_THRESHOLD = 0.6`) — suggestion-only, never applied. Existing-matched-by-nothing → `missingFlags`; fetched-matched-by-nothing → `unmatchedFetched` (info only). Has a CLI entry (`node matching.mjs existing.json fetched.json`) for ad-hoc/skill use, same pattern as `gate.mjs`.
- `.claude/skills/refresh-day-passes/scripts/rename.mjs` — the rename engine: `slugify`/`deriveSpaPrefix` (derives `<spa-prefix>` by stripping the old name's slug off the end of the old id, falling back to the sibling ids' common dash-token prefix) → `reslug` → `checkSlugCollision` → `planRename` (composes the above; `applied: false` with a reason on a collision or an underivable prefix — never invents a disambiguated id). `rewriteMechanicalRefs` rewrites quoted id literals (`dayPassId="…"`, `getDayPassPrice(spa.id, '…')`, the data file's own `id:`/`packageName:` fields) and `#<id>` markdown anchors; `findProseMentions` finds case-insensitive old-name hits (file:line + context) without touching them. `applyRenameToFiles` composes both over an in-memory file set (used directly by tests) with a thin CLI (`node rename.mjs <repo-root> <spa-id> <old-id> <new-id> <old-name> <new-name>`) that walks `content/blog/**/*.mdx` + `src/data/faqs/*.tsx` + the owning day-pass data file for real runs.
- 31 unit tests: `tests/unit/refresh-day-passes-matching.test.ts` (14 — all three tiers, dead-bookingUrl-plus-changed-name falling through to tier 3, missing/unmatched flags, no double-matching) and `tests/unit/refresh-day-passes-rename.test.ts` (17 — slug derivation incl. drifted-id fallback, collision flagging, mechanical-ref rewriting incl. an end-to-end fixture spa mirroring the real data-file/FAQ/MDX shapes proving the rename keeps `priced-content.test.ts`-style lookups resolving, and prose-mention flagging that never rewrites).
- SKILL.md updated: new step 2 "Match fetched passes to existing entries" wires `matching.mjs` + `rename.mjs` into the procedure (steps renumbered 3–7); "Later slices" trimmed to just successor suggestions/`--accept-successor` (issue 06), which layers on `tier3Suggestions` + the rename engine built here.
- `npm run typecheck && npm test` green (707 tests, 43 files, incl. `priced-content.test.ts` and the new suites). Draft PR: [#22](https://github.com/MattyGlen123/lake-district-spas/pull/22) on branch `refresh/05-matching-rename-engine`.
- Deviation from a literal reading of the issue text: mechanical refs also cover FAQ generator function-call id arguments (`getDayPassPrice(spa.id, 'id')` etc. in `src/data/faqs/*.tsx`), not just `dayPassId` JSX props and `#<id>` anchors — `priced-content.test.ts` scans those FAQ files too, so a real rename would break `npm test` without rewriting them.
- No live demo run: this issue is a library/engine slice (like 02/03/04), verified by unit + fixture-based integration tests rather than a real spa rename in the wild (which can't be manufactured on demand). The full pipeline gets exercised end-to-end in 08/09.
- For issue 06: `matchPasses`'s `tier3Suggestions` array already carries `{ existingId, existingName, fetchedName, score }` per spa — 06's strict-1:1 successor detection can filter that array to spas with exactly one vanished existing pass and exactly one unmatched fetched pass, then call `planRename` + `applyRenameToFiles` from `rename.mjs` on `--accept-successor` exactly like a tier-1 auto-rename.
