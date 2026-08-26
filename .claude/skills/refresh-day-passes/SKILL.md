---
name: refresh-day-passes
description: Refresh day-pass prices from spa source sites and open an evidence-grounded draft PR. Use when the user runs /refresh-day-passes, optionally with --spa <id>. html + blocked (Playwright) + pdf (poppler) fetch tiers; failed fetches file tracker issues, never block the run.
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

- `pdf` — Armathwaite (2), sole pdf-tier spa: the brochure PDF linked from `dayPassUrl`'s page is the price source. `scripts/fetch-pdf.mjs` downloads it (curl + browser UA, same retry/backoff as `fetch.mjs`) then runs poppler's `pdftotext -layout` on it. **The extracted text layer is saved as the fetch artifact** (`spa-<id>.txt`) — that's the file the gate greps, same rule as every other tier ("the artifact the model reads is the artifact the gate greps"). The raw PDF is kept alongside at `spa-<id>.pdf` as a reading aid; it is NOT committed (large binaries bloat the repo, and it is re-fetchable from the source URL in the fetch log). See "PDF vintage (gate 4)" below for the extra check this tier requires. Missing poppler (`pdftotext` not on PATH) is reported via the log's `missingDependency`/install-hint fields, exit 2 → failure lane, never a crash — `brew install poppler` if you hit it locally (poppler binaries can sit outside the default shell PATH even when installed via Homebrew).

⚠️ **Multi-column brochures weaken gate 2.** `pdftotext -layout` flattens side-by-side package columns into interleaved lines, and the gate normalizes whitespace away — so a span can contain the right pass name next to a *neighbouring* package's price and still pass contiguity. When a pdf-tier quote's span contains more than one price, verify the column alignment in the raw text layer by hand before applying, and say so in evidence.md. See `.scratch/day-pass-refresh/issues/11-pdf-multicolumn-contiguity.md`.

- `portal-onejourney` — Appleby (15), sole spa on this tier. Prices live only in the booking portal, so fetch each pass's **`bookingUrl`, not `dayPassUrl`** — one artifact per pass (`spa-<id>-<item>.html`, `<item>` = the trailing path segment of the bookingUrl), with `scripts/fetch.mjs` exactly as the html tier uses it. The page embeds a React-Query SSR payload; quote the contiguous span from the item's `"name":"…"` through its `"price":{"amount":<pence>`, with `arithmetic: "pence"`. See "Portal tier extraction" below.

**Portal tiers are per-vendor, not per-portal.** The four portal spas split by whether their tenant server-renders, and that cuts across both vendors — do not generalize one spa's rule to another. Appleby (onejourney) server-renders; Lakeside (9, also onejourney) does NOT and is unimplemented (see `.scratch/day-pass-refresh/issues/03c-portal-lakeside-shell.md`); North Lakes (12) and Underscar (19) are try.be, whose JSON-LD prices are in **whole pounds, not pence**, and are unimplemented (see `03b-portal-trybe-jsonld.md`).

If a targeted spa is on no implemented tier (Lakeside 9, North Lakes 12, Underscar 19), report "tier not implemented in this slice" and stop for that spa — do not fetch. In particular **never point the html-tier fetch at a Lakeside bookingUrl**: it returns HTTP 200 and a shell full of Elemis retail-shop prices with no day-pass data, so a quote can ground a real-looking figure to entirely the wrong product.

### Portal tier extraction (onejourney SSR)

```
"queries":[{"state":{"data":{"id":<item>,"categories":[…],"name":"<item name>",
"description":"…", … ,"price":{"amount":<pence>,…
```

- **Quote** = `"name":"<item name>"` … `"price":{"amount":<pence>` — one contiguous span, typically 1.3–2.7 KB. `arithmetic: "pence"`, `quotedFigure` = the pence integer. Gate 1 already implements this case; no gate change is needed.
- **`passName` must be the artifact-literal form.** The payload JSON-escapes non-ASCII, so `&` appears as `&`. Gate 2's normalization decodes HTML entities, not JSON escapes — pass `Aqua Thermal Journey & Light Afternoon Tea Fri-sun`, not the decoded form, or gate 2 demotes with `pass-name-not-in-quote`.
- **Decode before writing data.** The reverse applies to renames: `packageName` in the data file takes the decoded human form (`&`). Same string, two representations — artifact-literal for the gate, decoded for the data.
- An empty SSR slot (`"queries":[]`) means the tenant does not server-render. Treat it as tier-not-implemented, never as a fetch to salvage from the shell.
- The payload is emitted twice, camelCase and snake_case. Quote from the camelCase copy; gate 3 poison-scans every occurrence of a repeated span, which is correct and was verified clean.

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
# pdf tier: fetch dayPassUrl's page first to locate the linked brochure PDF
# (curl, same as above — no dedicated script, it's a plain HTML page), then
# download + extract the brochure itself. exit 0's log carries
# textLayerUsable + textChars — see "thin text layer" under step 3 when false.
node .claude/skills/refresh-day-passes/scripts/fetch-pdf.mjs \
  "<brochurePdfUrl>" "$RUN_DIR/spa-<id>.txt" "$RUN_DIR/spa-<id>-fetch-log.json"
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
- `quote` — a verbatim contiguous span copied from the artifact containing **both** that price **and** the pass name / booking-item title (gate 2 requires both in the one span). Only whitespace/entity differences from the artifact are tolerated by the gate; do not paraphrase, reorder, or bridge gaps with `…`.
- `passName` — the name the span shows (source title if it differs from `packageName`); the gate greps it inside the quote, case- and tag-insensitively.

A pass whose price cannot be found in the artifact gets no quote — it will fail the gate and land in the ⚠️ flag section. That is the correct outcome; never force a quote.

**pdf tier, thin text layer** — if `fetch-pdf.mjs`'s log reports `textLayerUsable: false` (under ~200 chars — a scanned/image brochure with little or no embedded text), reading `spa-<id>.txt` won't surface real quotes. Fall back to reading `spa-<id>.pdf` directly as a Claude API document content block to see what the brochure says. This is a **reading aid only** — it does not relax grounding. The `quote` you write into `checks.json` must still be a verbatim span that greps in the saved **text-layer artifact** (`spa-<id>.txt`), same as any other tier; if the thin layer genuinely doesn't contain the price as text, the gate will correctly return `quote-not-found-in-artifact` and the pass lands in ⚠️, exactly as the iron rule requires ("no gate depends on model self-assessment"). Do not point the gate at the PDF itself or at anything the document block "read" that isn't literally in the text-layer file.

### 3b. Trim + bundle the committed artifact

The committed artifact exists so any figure in the PR can be re-proved later. Committing whole pages does that but does not scale: a full 22-spa run is ~5–6 MB and ~65 files EVERY month (Old England's rendered page alone is 1.8 MB, and portal spas need one page PER PASS), and git keeps every version forever.

So the page(s) fetched in step 1 are **working files, not the committed evidence**. Once quotes exist, reduce them to one trimmed, bundled artifact per spa:

```bash
node .claude/skills/refresh-day-passes/scripts/trim-artifact.mjs \
  "$RUN_DIR/spa-<id>-checks.json" "$RUN_DIR/spa-<id>.html" <full-page> [<full-page>…]
```

It keeps every occurrence of every quote plus `DEFAULT_PAD` (2,000) raw chars either side — comfortably more than gate 3's ±200 **normalized** chars, since normalization collapses whitespace — merges overlapping windows, and joins segments with a long neutral separator so no two windows bleed into each other's poison range. Multiple input pages bundle into ONE output artifact, which is why portal spas collapse from 11 files to 1.

**The equivalence is enforced, not asserted.** The script runs the real gate over both the full page(s) and the trimmed bundle and **exits 2 unless every verdict — grounded, gate, reason, poison words — is identical**; it also exits 2 if a quote is missing from the source entirely. A lossy trim cannot ship. Measured: Appleby 1,233 KB → 148 KB (88%), 11/11 identical; North Lakes + Underscar 374 KB → 60 KB (84%), 17/17 identical.

Gate and commit the TRIMMED artifact (`spa-<id>.html`, uniform across tiers). Keep one `spa-<id>-fetch-log.json` per spa — an array of per-page logs for portal tiers. Do **not** commit the full pages; they are re-fetchable from the URLs in the log.

This does not weaken the iron rule. The model still reads the full page to extract, and `trim-artifact.mjs` locates each quote **in that full page** — a quote that isn't really there produces no window, so it is absent from the bundle and gate 1 demotes it exactly as before.

### 4. Gate

Write `spa-<id>-checks.json` in the run dir — one entry per existing pass:

```jsonc
[{
  "passId": "beech-hill-relax-spa-day",   // existing DayPassOption id
  "passName": "Relax Spa Day",            // name/title as the span shows it (gate 2)
  "quote": "<strong>Relax Spa Day</strong> <em>£115.00</em>",
  "figureGBP": 115,                       // sourcePriceGBP, in GBP
  "storedGBP": 115,                       // current priceGBP (gate 5 % move)
  "arithmetic": "none",                   // "none" | "pence" | "per-couple"
  "quotedFigure": 115                     // figure literally in the span (see below)
}]
```

**pdf tier only** — every check for a pdf-tier spa also carries `pdfVintage` (omit it entirely for other tiers; gate 4 is then a no-op):

```jsonc
{
  "pdfVintage": {
    "documentYear": 2026,          // year the evidence points to
    "evidenceType": "filename",    // "filename" | "cover-date" | "valid-until"
    "evidence": "https://.../uploads/2026/02/brochure.pdf", // see below
    "runYear": 2026                // optional, defaults to current calendar year
  }
}
```

`evidenceType` decides what `evidence` is and how it's checked:

- `filename` — the PDF's **source URL** (from the fetch log, not the text-layer artifact — URLs aren't part of the extracted text). Must literally contain `documentYear`. This is what Armathwaite's demo run uses: the upload path `/wp-content/uploads/2026/02/...` carries the year.
- `cover-date` / `valid-until` — a verbatim quote that must grep in the artifact (same grounding rule as gate 1) **and** literally contain `documentYear` — a self-reported date only counts if it's actually printed in the brochure.

Any `documentYear` older than `runYear` demotes with `pdf-vintage-stale` — see the whole-spa rule below.

**Arithmetic cases** (PRD §3 rule 5) — `figureGBP` is always GBP; `quotedFigure` is what the span literally shows:

| `arithmetic` | Span shows | `quotedFigure` | Gate proves |
| --- | --- | --- | --- |
| `none` (default) | `£115` | (ignored) | `£<figureGBP>` in span |
| `pence` (portal tier) | `"price":14000` | `14000` | integer in span AND `= figureGBP × 100` |
| `per-couple` | `£95 per person` | `95` | `£95` in span AND `figureGBP = 95 × 2` (group total) |

Run:

```bash
node .claude/skills/refresh-day-passes/scripts/gate.mjs \
  ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>.html" \
  ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>-checks.json" \
  > ".claude/content-out/refresh-runs/$RUN_DATE/spa-<id>-gate-results.json"
```

Gates run in order and the first failure demotes (`grounded: false`, with `gate` + `reason` + the `quote` on the result):

| Gate | Checks | Demote reasons |
| --- | --- | --- |
| 1 grounding | quote greps verbatim in the artifact (whitespace/entity normalization only); figure inside it; arithmetic case holds | `empty-quote`, `quote-not-found-in-artifact`, `figure-not-in-quote`, `arithmetic-mismatch`, `arithmetic-missing-per-person` |
| 2 contiguity | pass name AND price in the one span | `pass-name-not-in-quote`, `missing-pass-name` |
| 3 poison words | `member`/`membership`/`resident`/`voucher`/`deposit`/`per month` in the span or ±200 chars of artifact context (any occurrence of a repeated span) | `poison-word:<word>` (+ `poisonWords`) |
| 4 PDF vintage (pdf tier only; no-op without `pdfVintage`) | `documentYear` present + evidence proven per `evidenceType` (see above) + not older than `runYear` | `pdf-vintage-year-missing`, `pdf-vintage-evidence-type-invalid`, `pdf-vintage-evidence-missing`, `pdf-vintage-year-not-in-evidence`, `pdf-vintage-evidence-not-found-in-artifact`, `pdf-vintage-stale` |
| 5 plausibility | move ≤ ±40% vs `storedGBP`; price within £20–£400, even if unchanged | `move-exceeds-40pct`, `price-out-of-bounds` (+ computed `movePct`) |

**Stale vintage demotes the whole spa, not just the pass** (PRD §2): `pdf-vintage-stale` on any one check means the brochure itself is out of date — every pass sourced from it is unreliable, not just that pass. Treat the spa exactly like a fetch failure (step 1's failure lane): exclude it from the run (entries and `lastVerified` untouched, no `priceGBP` edits from any of its checks even if other passes on the same brochure grounded fine), file one tracker issue (same shape as a fetch failure, error summary = "brochure dated `documentYear`, current run is `runYear`" + the vintage evidence), and render the ❌ not-fetched table row linking it. This is the one case where a gate-4 reason reaches back past step 4 into step 1's failure handling — every other gate reason (including the other pdf-vintage reasons: missing/invalid/unproven evidence) stays a normal per-pass ⚠️ flag. A pass-level flag for a **different** reason (e.g. gate 2 name drift) on a pdf-tier spa does NOT trigger this whole-spa rule — only `pdf-vintage-stale` does.

Route strictly by `gate-results.json`:

| Gate result | Source vs stored | Outcome |
| --- | --- | --- |
| grounded | equal | ✅ verified unchanged — bump `lastVerified` to run date |
| grounded | differs | 💷 price change — set `priceGBP` (and `pricePerPerson` if applicable), bump `lastVerified` |
| not grounded | — | ⚠️ flag with the quote + `reason` (+ `movePct` where computed) rendered — NO data change, NO `lastVerified` bump |

Never re-quote or re-run a demoted pass to get it green: a demotion is a review item, not a retry.

### 5. Apply

Edit only the fields above in `src/data/day-passes/spa-<id>-day-passes.ts`. Run `npm test` — must stay green.

Then run the post-run invariant check (PRD §6: stale `lastVerified` = exactly the failed/flagged set for the targeted spas):

```bash
node .claude/skills/refresh-day-passes/scripts/check-invariant.mjs \
  "$RUN_DIR" "$RUN_DATE" "<id>,<id>,…"
```

Exit 2 = the data edits don't match the fetch/gate outcomes — fix the data (never the report) before opening the PR. Include the check's verdict line in evidence.md.

### 6. Evidence file

Write `evidence.md` in the run dir — the **full** per-pass quote set (PRD §5), never a sample. Per spa: source URL, artifact filename + HTTP status, gate-results filename, fetch timestamp, grounded/flagged counts, plus any tier-3 "possible rename: X → Y"/prose-mention flags and "possible successor: X → Y" suggestions (with their evidence lines). Per pass: id (post-rename, if renamed), the matching tier used (1/2/3) and any applied rename (old name → new name), stored → source figure, computed `movePct` when the price moved, the blockquoted quote, and the gate verdict — for demoted passes, the demoting gate + reason + "no data change, no `lastVerified` bump". Close with the `check-invariant.mjs` verdict line.

### 7. PR

Branch `refresh/day-pass-run-$RUN_DATE` off `origin/main`; commit the data edits (including any renamed ids/mechanical-ref rewrites) AND the run dir (the TRIMMED artifact from step 3b, checks, gate results, fetch log, evidence.md — never the full fetched pages). Commit message: `chore(data): day-pass refresh $RUN_DATE — <n> price changes, <n> flags`.

PR body follows the normative template layout exactly for every non-empty section, in template order: header (run stats line + "this PR deletes nothing" statement) → 💷 price changes → ⚠️ missing-flags (include tier-3 "possible rename: X → Y" suggestions, "possible successor: X → Y" suggestions with their evidence lines, and prose-mention flags here) → 🏷 promo notes → ❌ not-fetched table → ✅ verified-unchanged (collapsed `<details>`) → diff summary table. Per change: id + field diff, blockquoted quote, linked source URL, fetch timestamp, ℹ️ normalization notes. Omit sections with zero entries.

The header links `evidence.md` (relative repo path, in-branch) as the full quote set; **the PR body itself shows per-spa samples only** (PRD §5). Every gate demotion appears in the ⚠️ section with its quote, gate number and reason.

Open as DRAFT via `gh pr create --draft` (gh lives at `/opt/homebrew/bin/gh`).

## Later slices (stubs only — do not build here)

- Portal tier, try.be half (North Lakes 12, Underscar 19) — JSON-LD prices are whole pounds and fit **no existing arithmetic case**; needs a new bare-integer/identity mode in `gate.mjs`. See issue 03b.
- Portal tier, Lakeside (9) — no SSR payload; needs a rendered/API artifact, not a curl one. See issue 03c.
