# Walking skeleton: `/refresh-day-passes --spa <id>` on one clean-HTML spa

Status: closed
Type: AFK
Assignee: Claude (agent, 2026-07-27)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §1, §2, §5 (gate 1 only), §6.

## What to build

The tracer bullet: a Claude Code skill `/refresh-day-passes` that, for one `html`-tier spa (`--spa <id>`, e.g. Beech Hill), runs the whole path thin but complete: curl the spa's `dayPassUrl` with a browser UA → save the fetch artifact under `.claude/content-out/refresh-runs/<date>/` → extract each existing pass's current price with a verbatim quote → run a script gate that greps the quote in the artifact and confirms the stored figure appears inside it (whitespace/entity normalization only) → update `priceGBP` on grounded changes and bump `lastVerified` on all grounded passes → open a draft PR via `gh` whose body follows the normative template's price-change + verified-unchanged sections (blockquoted quote, source URL, fetch timestamp).

Ungrounded passes go to a ⚠️ flag section with no data change and no `lastVerified` bump. Nothing is ever deleted. Later slices add the other tiers, gates, matching, and failure lanes — this slice only needs stubs where they'd plug in.

## Acceptance criteria

- [x] `/refresh-day-passes --spa 10` produces a real draft PR for Beech Hill with grounded evidence per pass
- [x] Fetch artifact saved; the gate script greps quotes against that exact artifact, and a gate failure lands in the flag section, never the diff
- [x] Diff touches only price fields and `lastVerified`; `npm test` stays green
- [x] Skill + gate script committed; PR body sections match the normative template's layout for the sections exercised

## Blocked by

None - can start immediately

## Comments

**Resolution** (2026-07-27, Claude agent): Built and demoed. Skill at `.claude/skills/refresh-day-passes/SKILL.md`; gate-1 script (exact-quote grounding, whitespace/entity normalization only, £-anchored figure match, boundary-safe) at `.claude/skills/refresh-day-passes/scripts/gate.mjs` with 7 unit tests (`tests/unit/refresh-day-passes-gate.test.ts`). Demo run `--spa 10` (Beech Hill): fetch HTTP 200 via curl+browser UA, artifact + checks + gate results + evidence.md committed under `.claude/content-out/refresh-runs/2026-07-27/`; gate grounded 4/4 passes, zero price drift (£140/£115/£45×2 all match), so diff = 4 `lastVerified` bumps only — draft data PR #16 (`refresh/day-pass-run-2026-07-27`). Skill PR on `refresh/01-walking-skeleton`. Stubs left for later slices: `--tier`/`--accept-successor` flags, gates 2-5 plug-in point in `runCheck()`, portal/pdf/blocked tiers, matching cascade, per-failure issue filing. Unblocks 02, 05, 07.
