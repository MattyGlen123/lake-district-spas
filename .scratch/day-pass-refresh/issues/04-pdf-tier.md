# PDF fetch tier + vintage gate

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §2 (pdf tier), §5 gate 4.

## What to build

Support the `pdf` spa (Armathwaite 2), whose brochure PDF is the sole price source: locate the linked brochure, extract its text layer via poppler (`pdftotext`), save that text layer as the fetch artifact, and ground quotes against it — the same artifact the model reads. Add the vintage gate: the extractor must state document-year evidence (filename year, cover date, "valid until") in the PR row; prior-year evidence demotes the whole source to a fetch failure with a filed issue. Claude API document blocks are the fallback if the text layer is unusable.

Demo: a run on Armathwaite produces a grounded PR with vintage evidence shown.

## Acceptance criteria

- [ ] `/refresh-day-passes --spa 2` fetches the brochure, saves the text-layer artifact, and grounds all passes against it
- [ ] PR rows for PDF-sourced passes include document-year evidence; a prior-year brochure demotes the whole spa to fetch-failure
- [ ] Missing poppler is reported with the install hint, not a crash

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
- [02 Gate suite](02-gate-suite.md)
