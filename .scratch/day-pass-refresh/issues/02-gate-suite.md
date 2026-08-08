# Full deterministic gate suite + evidence artifact

Status: closed
Type: AFK
Assignee: Claude (agent, 2026-08-06, branch refresh/02-gate-suite)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §5.

## What to build

Extend the walking skeleton's gate script into the full suite, every check deterministic against the saved fetch artifact:

- **Contiguity**: quote must be one contiguous span containing both pass name (or booking-item title) and price.
- **Poison words**: `member|membership|resident|voucher|deposit|per month` in the span or ±200 chars of artifact context → demote to ⚠️ flag with quote shown.
- **Plausibility bounds**: move >±40%, or any price outside £20–£400 (spec constants), even if unchanged → ⚠️ flag with quote + computed %.
- **Arithmetic cases**: pence→GBP conversion and per-couple ×2 (`priceGBP` = group total, `pricePerPerson` quoted) as explicit script cases, ready for the portal/PDF tiers.
- **Evidence artifact**: full per-pass quote set written to `.claude/content-out/refresh-runs/<date>/evidence.md`, linked from the PR; PR body shows per-spa samples only.

## Acceptance criteria

- [x] Each gate has unit tests including at least one demote case (wrong-price-nearby, member price, out-of-bounds)
- [x] Gate failures land in the flagged lane with the quote rendered; the diff and `lastVerified` are untouched for demoted passes
- [x] A run on a clean-HTML spa produces evidence.md and links it from the PR body

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)

## Comments

**Resolution** (2026-08-06, Claude agent): Built and demoed. `.claude/skills/refresh-day-passes/scripts/gate.mjs` now runs the full suite, first failure demoting, every verdict a grep/arithmetic check against the saved artifact: **gate 2** contiguity (pass name + price in the one span; name matched case- and tag-insensitively so a name split across tags still hits → `pass-name-not-in-quote`, `missing-pass-name`); **gate 3** poison words (`\b`-anchored `member|resident|voucher|deposit` prefixes + `per month`, in the span or ±200 chars of context at *every* occurrence of a repeated span → `poison-word:<word>`); **gate 5** plausibility (`>±40%` move vs new `storedGBP` field, or price outside £20–£400 even when unchanged → `move-exceeds-40pct`, `price-out-of-bounds`, with computed `movePct`); **gate 1** gains the arithmetic cases (`arithmetic: "pence"` — standalone integer in span, `= figureGBP × 100`, portal tier; `arithmetic: "per-couple"` — `£<perPerson>` in span, `figureGBP = perPerson × 2` group total). Spec constants exported and echoed in the output. Results now carry `quote`, `gate`, `reason`, `movePct`, `poisonWords` so a demoted pass renders its own flag; `check-invariant.mjs` still routes off `grounded`, so demoted = no data change, no `lastVerified` bump. `tests/unit/refresh-day-passes-gate.test.ts`: **32 tests** (was 7), demote case per gate incl. wrong-price-nearby, member-price-in-span, `Membership` within ±200 chars, £15/£450 out-of-bounds and ±50% moves, plus boundary cases (exactly 40%, £20/£400, "remember" not tripping). SKILL.md documents the checks.json shape, the arithmetic table, the gate/reason table and the evidence.md contract (full quote set, linked from the PR header; body shows samples only). Skill PR [#21](https://github.com/MattyGlen123/lake-district-spas/pull/21) (`refresh/02-gate-suite`). Demo run `--spa 10` (Beech Hill, html tier, curl 200): 4/4 grounded through all four gates, 0 price changes, 4 `lastVerified` bumps, invariant 0 violations — data PR [#23](https://github.com/MattyGlen123/lake-district-spas/pull/23) (`refresh/day-pass-run-2026-08-06`) with `evidence.md` linked from the header, plus an adversarial re-check of the same artifact (`spa-10-demote-demo-checks.json`) demoting through gates 1, 2 and 5. Real-world gate-3 note: the page carries 20 `member` hits, all `team-member` CSS classes in `<head>` — none within ±200 chars of a price, so none demoted. Gate 4 (PDF vintage) stays stubbed for the pdf tier (issue 04); `npm run typecheck` + `npm test` (701) green.
