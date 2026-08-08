# PDF fetch tier + vintage gate

Status: closed
Type: AFK
Assignee: Claude (agent, 2026-08-08)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (pdf tier), §5 gate 4.

## What to build

Support the `pdf` spa (Armathwaite 2), whose brochure PDF is the sole price source: locate the linked brochure, extract its text layer via poppler (`pdftotext`), save that text layer as the fetch artifact, and ground quotes against it — the same artifact the model reads. Add the vintage gate: the extractor must state document-year evidence (filename year, cover date, "valid until") in the PR row; prior-year evidence demotes the whole source to a fetch failure with a filed issue. Claude API document blocks are the fallback if the text layer is unusable.

Demo: a run on Armathwaite produces a grounded PR with vintage evidence shown.

## Acceptance criteria

- [x] `/refresh-day-passes --spa 2` fetches the brochure, saves the text-layer artifact, and grounds all passes against it
- [x] PR rows for PDF-sourced passes include document-year evidence; a prior-year brochure demotes the whole spa to fetch-failure
- [x] Missing poppler is reported with the install hint, not a crash

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)

## Comments

**Resolution** (2026-08-08, Claude agent + PM): Shipped in two parts. Code (PR #26, merged): `scripts/fetch-pdf.mjs` — curl+browser-UA download with the same 3-attempt/2s/8s backoff as `fetch.mjs`, then poppler `pdftotext -layout`; the extracted TEXT LAYER is saved as the fetch artifact (`spa-<id>.txt`) so the artifact the model reads is the one the gate greps, with the raw PDF kept alongside as a reading aid and `textLayerUsable`/`textChars` in the log driving the Claude document-block fallback. Missing poppler is caught up front (ENOENT only) and reported via `missingDependency` + install hint, exit 2 → failure lane, never a crash. Gate 4 (vintage) in `gate.mjs`: `pdfVintage = { documentYear, evidenceType: filename|cover-date|valid-until, evidence, runYear? }`; `filename` evidence is matched against the PDF source URL, `cover-date`/`valid-until` must grep in the artifact AND contain the year; prior-year → `pdf-vintage-stale`, which demotes the WHOLE spa to a fetch failure. No-op for non-pdf tiers. Tests: gate suite 32 → 43 plus 4 fetch-pdf tests.

Docs + demo (PR #28) and data (PR #27): SKILL.md documents the pdf tier, the text-layer-as-artifact rule, the `pdfVintage` schema, gate 4's reason table, the whole-spa stale-vintage rule and the thin-text-layer fallback. Demo run `--spa 2` (Armathwaite): brochure located from the day-pass page, fetched HTTP 200 first attempt, 49,524-char text layer; 6/12 grounded (2 price changes — Escape weekday £140→£150, weekend £150→£160 — and 4 verified-unchanged), 6 demoted on gate 2 because the brochure's titles are shorter than the stored `packageName`s (correct behaviour: four of those show higher source prices that were deliberately NOT applied). Vintage passed on all 12 checks via `filename` evidence (`/uploads/2026/02/`). `check-invariant.mjs` → ok, 0 violations.

Note for reviewers: PR #25 originally carried this code but was merged into `refresh/02-gate-suite` after that branch had already reached main, so it never landed; re-opened as #26. The raw 7.4MB brochure PDF is deliberately not committed (re-fetchable from the fetch log's URL). PM review of the demo also found a real gate weakness on multi-column brochures — filed as [11 PDF multi-column contiguity](11-pdf-multicolumn-contiguity.md).
