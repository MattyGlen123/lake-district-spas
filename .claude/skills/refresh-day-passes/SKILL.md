---
name: refresh-day-passes
description: Refresh day-pass prices from spa source sites and open an evidence-grounded draft PR. Use when the user runs /refresh-day-passes, optionally with --spa <id>. html + blocked (Playwright) fetch tiers; failed fetches file tracker issues, never block the run.
---

# /refresh-day-passes

Manually-triggered refresh of existing `src/data/day-passes/` entries against each spa's live source. Spec: `.scratch/day-pass-freshness/PRD.md` (locked). PR body template (normative, verbatim layout): `.claude/content-out/day-pass-refresh-mock-pr.md`.

**Iron rules (PRD §1, §5):**

- Never delete or add entries. The diff touches ONLY `priceGBP` (and sibling price fields like `pricePerPerson`) and `lastVerified`.
- Every figure entering the diff — changed AND confirmed-unchanged — must pass the deterministic gate script against the saved fetch artifact. Gate failure → ⚠️ flag section of the PR, never the diff, and NO `lastVerified` bump.
- No gate depends on model self-assessment; the script's output is final.

## Flags

- `--spa <id>[,<id>…]` — scope to given spas. **Implemented.**
- `--tier <tier>` — STUB (slice 03/04/08). Error: "not implemented in this slice".
- `--accept-successor <existing-id>` — apply a previously-suggested successor rename for one existing id, re-running the same matching pass first. **Implemented** (step 2).

## Fetch tiers (PRD §2)

Implemented tiers:

- `html` — Lodore Falls (1), Daffodil (4), Swan (5), Low Wood Bay (7), Beech Hill (10), Whitewater (13), Another Place (14), Netherwood (16), Grange (17).
- `blocked` — Old England (6): curl gets 403, so fetch goes straight to the Playwright fallback (`scripts/fetch-playwright.mjs`, repo's existing `@playwright/test` install; `npx playwright install` once if browsers missing). The rendered-HTML artifact it saves is gated exactly like a curl artifact.

If a targeted spa is in neither list (`portal`/`pdf` tiers), report "tier not implemented in this slice" and stop for that spa — do not fetch.

## Procedure

Work from repo root. `RUN_DATE=$(date +%F)`; run dir = `.claude/content-out/refresh-runs/$RUN_DATE/`.

### 1. Fetch → artifact

For each target spa, take `dayPassUrl` from its `src/data/day-passes/spa-<id>-day-passes.ts` entries. Both fetch scripts retry with backoff internally and write a JSON retry log; exit 0 = fetched, exit 2 = failed → failure lane.

```bash
RUN_DIR=".claude/content-out/refresh-runs/$RUN_DATE"
# html tier (plain curl + browser UA — never WebFetch, PRD §8; 3 attempts, 2s/8s backoff):
node .claude/skills/refresh-day-passes/scripts/fetch.mjs \
  "<dayPassUrl>" "$RUN_DIR/spa-<id>.html" "$RUN_DIR/spa-<id>-fetch-log.json"
# blocked tier, or an html fetch that failed with "botBlocked": true in its log —
# Playwright fallback (2 attempts, appends to the same retry log):
node .claude/skills/refresh-day-passes/scripts/fetch-playwright.mjs \
  "<dayPassUrl>" "$RUN_DIR/spa-<id>.html" "$RUN_DIR/spa-<id>-fetch-log.json"
```

Record the fetch timestamp (`date '+%Y-%m-%d %H:%M %Z'`). A failed spa never blocks the run — continue with other spas.

**Failure lane** (fetch script exit 2, all fallbacks exhausted): the spa is excluded from the run — its entries and `lastVerified` stay untouched, no checks/gate for it. For EACH failed spa:

1. **File one tracker issue** (docs/agents/issue-tracker.md): `.scratch/day-pass-refresh/issues/<NN>-fetch-failure-spa-<id>-$RUN_DATE.md`, `<NN>` = next free number in that dir. Contents: title `Fetch failure: <spa name> (<id>) — day-pass refresh $RUN_DATE`; `Status: needs-triage`; error summary (HTTP code / curl or Playwright error, whether the Playwright fallback was tried); source URL; the full retry log JSON from `spa-<id>-fetch-log.json` in a fenced block; re-run line: after the fix, `/refresh-day-passes --spa <id>`.
2. **Render a ❌ not-fetched table row** in the PR (normative template layout): spa name (id) · pass count · linked source URL · error + retry count · relative link to the filed issue file.

Commit filed issues on the SAME run branch as the data PR so the table links resolve.

### 2. Match fetched passes to existing entries

Before extracting quotes, identify which fetched pass (if any) each existing `DayPassOption` corresponds to. Build `existing` (from the spa's data file: `id`, `packageName`, `priceGBP`, `spaDuration`, `included`, `bookingUrl`) and `fetched` (from the artifact: `name`, `priceGBP`, `spaDuration`, `included`, `bookingUrl` — whatever the source page/portal exposes) arrays, then run:

```bash
node .claude/skills/refresh-day-passes/scripts/matching.mjs existing.json fetched.json
```

Cascade (PRD §4): (1) booking-portal item id (stable trailing path segment of `bookingUrl`) — auto-applies, including a rename when the name differs; (2) exact normalized name — auto-applies; (3) structural similarity (price/duration/inclusions) — `tier3Suggestions`, rendered in the PR as "possible rename: X → Y", **never applied**. `missingFlags` (existing matched by nothing) become ⚠️ checklist items, data untouched, no `lastVerified` bump. `unmatchedFetched` (fetched matching nothing existing) become ℹ️ notes only — discovery stays out of scope.

**On a tier-1 match with a `rename` (or a human-approved tier-3/successor via `--accept-successor`, issue 06):**

```bash
node .claude/skills/refresh-day-passes/scripts/rename.mjs <repo-root> <spa-id> <old-id> <new-id> <old-name> <new-name>
```

This re-slugs the id to `<spa-prefix>-<slug-of-new-name>` (derived from the old id/name pair — see `deriveSpaPrefix` in `scripts/rename.mjs`), edits the data file's `id` and `packageName` fields, and auto-rewrites MECHANICAL references across `content/blog/**/*.mdx` and `src/data/faqs/*.tsx` — quoted id literals (`dayPassId="…"`, `getDayPassPrice(spa.id, '…')`) and `#<id>` anchor fragments — so `priced-content.test.ts` stays green. It prints `proseFlags` (case-insensitive hits of the OLD NAME in prose, file:line + context) — these go into the PR as ⚠️ checklist items and are **never rewritten**. If re-slugging would collide with another id already in use at that spa, nothing is renamed — it prints `{ applied: false, reason: 'slug-collision' }` and the PR gets a ⚠️ flag instead. Run `npm test` after any rename to confirm the priced-content validation is still green before continuing.

**Successor suggestions (strict 1:1, PRD §4).** After `matchPasses`, feed its result plus the same `existing`/`fetched` arrays through:

```bash
node .claude/skills/refresh-day-passes/scripts/successor.mjs existing.json fetched.json matchResult.json
```

`classifySuccessors` applies the strict-1:1 rule: only when a spa's WHOLE post-tier-1/2 leftover pool is exactly one vanished existing pass and one unmatched fetched pass, and they clear `TIER3_THRESHOLD`, does it render a `successors` entry — `{ existingId, existingName, fetchedName, score, evidence }`, `evidence` being price/duration/inclusions-shape/availability/positional-index lines for the PR's "possible successor: X → Y" flag. Two+ vanished passes, two+ unmatched passes, a no-predecessor addition, or an apparent merge all demote back to plain `missingFlags`/`unmatchedFetched` — never a guessed pairing. Successors are rendered in the PR's ⚠️ missing-flag section as a suggestion only, same as a tier-3 rename — **never applied on this run**.

**On `--accept-successor <existing-id>` (a re-run):** re-run fetch + matching + `classifySuccessors` for that spa as normal, find the `successors` entry with the matching `existingId`, then apply it exactly like a tier-1 auto-rename:

```js
import { applySuccessor } from './successor.mjs';
const { plan, updatedFiles, proseFlags } = applySuccessor(successor, siblingIds, files);
```

Same collision/prose-flag semantics as `rename.mjs` (it composes `planRename` + `applyRenameToFiles` underneath). If no `successors` entry matches the given id on the re-run (source changed again, or it was never strict 1:1), stop and report that — never fall back to a manual rename. Run `npm test` afterwards to confirm `priced-content.test.ts` stays green.

### 3. Extract quotes — from the artifact only

Read the SAVED ARTIFACT (never the live page again — the artifact the model reads is the artifact the gate greps). For each existing pass in the spa's data file (using its post-rename id, if renamed), find the current source price and capture:

- `sourcePriceGBP` — the figure the source shows now. "From £X" → store the floor X, no marker; "from £X" vs stored X is a match, not drift (PRD §3). Promo/discount prices are NEVER extracted — list price only; note promos for the 🏷 section.
- `quote` — a verbatim contiguous span copied from the artifact containing that price (prefer one also containing the pass name). Only whitespace/entity differences from the artifact are tolerated by the gate; do not paraphrase, reorder, or bridge gaps with `…`.

A pass whose price cannot be found in the artifact gets no quote — it will fail the gate and land in the ⚠️ flag section. That is the correct outcome; never force a quote.

### 4. Gate

Write `spa-<id>-checks.json` in the run dir: `[{ "passId", "quote", "figureGBP": <sourcePriceGBP> }, …]` — one entry per existing pass. Run:

```bash
node .claude/skills/refresh-day-passes/scripts/gate.mjs \
  ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>.html" \
  ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>-checks.json" \
  > ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>-gate-results.json"
```

Route strictly by `gate-results.json`:

| Gate result | Source vs stored | Outcome |
| --- | --- | --- |
| grounded | equal | ✅ verified unchanged — bump `lastVerified` to run date |
| grounded | differs | 💷 price change — set `priceGBP` (and `pricePerPerson` if applicable), bump `lastVerified` |
| not grounded | — | ⚠️ flag — NO data change, NO `lastVerified` bump |

### 5. Apply

Edit only the fields above in `src/data/day-passes/spa-<id>-day-passes.ts`. Run `npm test` — must stay green.

Then run the post-run invariant check (PRD §6: stale `lastVerified` = exactly the failed/flagged set for the targeted spas):

```bash
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  "$RUN_DIR" "$RUN_DATE" "<id>,<id>,…"
```

Exit 2 = the data edits don't match the fetch/gate outcomes — fix the data (never the report) before opening the PR. Include the check's verdict line in evidence.md.

### 6. Evidence file

Write `evidence.md` in the run dir: per spa, per pass — id (post-rename, if renamed), stored → source figure, the quote, gate verdict, source URL, fetch timestamp. Include the matching tier used (1/2/3), any applied rename (old name → new name), and any tier-3 "possible rename"/prose flags or "possible successor: X → Y" (with its evidence lines) for that spa.

### 7. PR

Branch `refresh/day-pass-run-$RUN_DATE` off `origin/main`; commit the data edits (including any renamed ids/mechanical-ref rewrites) AND the run dir (artifact, checks, gate results, evidence.md). Commit message: `chore(data): day-pass refresh $RUN_DATE — <n> price changes, <n> flags`.

PR body follows the normative template layout exactly for every non-empty section, in template order: header (run stats line + "this PR deletes nothing" statement) → 💷 price changes → ⚠️ missing-flags (include tier-3 "possible rename: X → Y" suggestions, "possible successor: X → Y" suggestions with their evidence lines, and prose-mention flags here) → 🏷 promo notes → ❌ not-fetched table → ✅ verified-unchanged (collapsed `<details>`) → diff summary table. Per change: id + field diff, blockquoted quote, linked source URL, fetch timestamp, ℹ️ normalization notes. Omit sections with zero entries.

Open as DRAFT via `gh pr create --draft` (gh lives at `/opt/homebrew/bin/gh`).

## Later slices (stubs only — do not build here)

- Gates 2–5 (contiguity, poison words, PDF vintage, plausibility) — plug into `runCheck()` in `scripts/gate.mjs`.
- Portal (pence) and PDF (poppler) tiers — plug into step 1.
