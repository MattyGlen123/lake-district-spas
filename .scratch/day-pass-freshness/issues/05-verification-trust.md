# Verification & trust gating for extracted data

Status: closed
Labels: wayfinder:grilling
Assignee: Matthew Glen (via Claude session)
Blocked-by: [Fetch & extraction mechanism](01-fetch-mechanism.md), [Source audit of the 15 spas' day-pass pages](02-source-audit.md)
Map: ../MAP.md

## Question

The user's core worry: fetched data may be inaccurate at the source of extraction (LLM misreading a page or PDF, picking up a member price, last year's PDF). What verification must extracted data pass before it can appear in the PR at all — e.g. exact-quote grounding (extracted price must appear verbatim in fetched content), double-pass extraction agreement, confidence thresholds per field?

Depends on which mechanism was chosen (what guardrails it makes possible) and what the source audit showed about how messy the real pages are.

## Comments

**Resolution** (2026-07-26, grilling session with Matthew):

**Trust model: no gate depends on the model's opinion of itself — every gate is a deterministic check against the saved fetch artifact.**

1. **Hard gate — script-enforced exact-quote grounding.** Every price entering the PR (changed *and* confirmed-unchanged) needs a quote that a script greps verbatim in the saved fetch artifact, with the stored price figure appearing inside the quote (pence conversion and per-couple ×2 arithmetic as explicit script cases). Only whitespace/entity normalization allowed. Per tier: booking-portal quotes = raw JSON fragment (pence); PDF quotes = poppler text layer (same artifact the model read). Gate fails → flagged lane, never the diff.
2. **Contiguity rule.** Quote must be one contiguous span containing *both* pass name (or booking-item title) *and* price — kills wrong-price-nearby stitching. Script-checkable.
3. **Poison-word check.** `member|membership|resident|voucher|deposit|per month` in quoted span or ±200 chars of artifact context → demote to ⚠️ flag with quote shown.
4. **Vintage check (PDF/brochure sources).** Extractor states document-year evidence (filename year, cover date, "valid until") in the PR row; prior-year evidence → whole source demoted, treated as fetch failure with filed issue.
5. **No double-pass extraction.** Mechanical gates subsume its value (fabrication and transcription slips die at gate 1); consistent wrong-context misreads pass agreement anyway — Q2's rules are the actual defence.
6. **Plausibility bounds, flag-never-block.** Move >±40%, or any extracted price outside £20–£400 (spec constants, even if unchanged) → ⚠️ flagged lane with quote + computed %, human applies manually.
7. **Unchanged passes gated identically, rendered differently.** No groundable quote = missing-from-source flag, no `lastVerified` bump (preserves 04's invariant: stale date = failed/flagged set). PR renders per-spa samples; full per-pass quote set written to `.claude/content-out/refresh-runs/<date>/evidence.md`, linked from the PR.
8. **Per-field confidence thresholds: considered-and-rejected** (07 must not reopen) — self-reported confidence is exactly as trustworthy as the extraction it describes, and isn't script-checkable.
9. **Staging fog item resolved: mandated 3-spa pilot, then full 15.** First run scoped to Whitewater (13), Lakeside (9), Armathwaite (2) — chosen for coverage: clean-HTML-with-drift + per-couple + missing-flag lanes, portal-JSON-pence tier, PDF-only tier. Matthew reviews and feeds back before the full run. `--spa` (optionally `--tier`) documented as ad-hoc scoping; no version gates beyond the pilot.
