---
name: refresh-day-passes
description: Refresh day-pass prices from spa source sites and open an evidence-grounded draft PR. Use when the user runs /refresh-day-passes, optionally with --spa <id>. Walking skeleton — html fetch tier only.
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
- `--accept-successor <id>` — STUB (slice 06). Error: "not implemented in this slice".

## Fetch tiers (PRD §2)

This slice implements the `html` tier only: Lodore Falls (1), Daffodil (4), Swan (5), Low Wood Bay (7), Beech Hill (10), Whitewater (13), Another Place (14), Netherwood (16), Grange (17). If a targeted spa is not in this list, report "tier not implemented in this slice" and stop for that spa — do not fetch. Portal/pdf/blocked tiers plug in as later slices.

## Procedure

Work from repo root. `RUN_DATE=$(date +%F)`; run dir = `.claude/content-out/refresh-runs/$RUN_DATE/`.

### 1. Fetch → artifact

For each target spa, take `dayPassUrl` from its `src/data/day-passes/spa-<id>-day-passes.ts` entries and fetch the page source with plain curl and a browser UA (never WebFetch — PRD §8):

```bash
curl -sSL --max-time 30 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" \
  -o ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>.html" -w '%{http_code}' "<dayPassUrl>"
```

Record the fetch timestamp (`date '+%Y-%m-%d %H:%M %Z'`). Non-200 / curl error: the spa goes to the ❌ not-fetched table, its entries untouched (per-failure issue filing is slice 07 — for now put error detail in the table row) and continue with other spas. A failed spa never blocks the run.

### 2. Extract quotes — from the artifact only

Read the SAVED ARTIFACT (never the live page again — the artifact the model reads is the artifact the gate greps). For each existing pass in the spa's data file, find the current source price and capture:

- `sourcePriceGBP` — the figure the source shows now. "From £X" → store the floor X, no marker; "from £X" vs stored X is a match, not drift (PRD §3). Promo/discount prices are NEVER extracted — list price only; note promos for the 🏷 section.
- `quote` — a verbatim contiguous span copied from the artifact containing that price (prefer one also containing the pass name). Only whitespace/entity differences from the artifact are tolerated by the gate; do not paraphrase, reorder, or bridge gaps with `…`.

A pass whose price cannot be found in the artifact gets no quote — it will fail the gate and land in the ⚠️ flag section. That is the correct outcome; never force a quote.

### 3. Gate

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

### 4. Apply

Edit only the fields above in `src/data/day-passes/spa-<id>-day-passes.ts`. Run `npm test` — must stay green.

### 5. Evidence file

Write `evidence.md` in the run dir: per spa, per pass — id, stored → source figure, the quote, gate verdict, source URL, fetch timestamp.

### 6. PR

Branch `refresh/day-pass-run-$RUN_DATE` off `origin/main`; commit the data edits AND the run dir (artifact, checks, gate results, evidence.md). Commit message: `chore(data): day-pass refresh $RUN_DATE — <n> price changes, <n> flags`.

PR body follows the normative template layout exactly for every non-empty section, in template order: header (run stats line + "this PR deletes nothing" statement) → 💷 price changes → ⚠️ missing-flags → 🏷 promo notes → ❌ not-fetched table → ✅ verified-unchanged (collapsed `<details>`) → diff summary table. Per change: id + field diff, blockquoted quote, linked source URL, fetch timestamp, ℹ️ normalization notes. Omit sections with zero entries.

Open as DRAFT via `gh pr create --draft` (gh lives at `/opt/homebrew/bin/gh`).

## Later slices (stubs only — do not build here)

- Gates 2–5 (contiguity, poison words, PDF vintage, plausibility) — plug into `runCheck()` in `scripts/gate.mjs`.
- Portal (pence), PDF (poppler), blocked (Playwright) tiers — plug into step 1.
- Matching cascade / renames / successors (PRD §4) — this slice matches passes by their existing ids only.
- Per-failure issue filing (PRD §2 failure UX).
