# Gate 2 contiguity is weak on multi-column PDF brochures

Status: needs-triage
Type: AFK
Filed-by: PM review of the pdf-tier demo run (2026-08-08)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §5 gate 2.

## What happened

The Armathwaite pdf-tier demo (spa 2, PR #27) grounded two price changes against a two-column brochure block. `pdftotext -layout` preserves columns with whitespace, but the gate **normalizes whitespace away** before grepping — so the column alignment that actually assigns a price to a package is destroyed before gate 2 ever runs.

The flattened span looked like this (four prices, two packages):

```
Escape Half Day        Mon - Fri    Sereni-Tea Spa Half Day    Mon - Fri
A half-day package...               A half day package...      £170
                       only
luxurious facilities...             spa's luxurious...
                       £150
```

Gate 2 only proves "pass name AND price appear in the one span". Both `Escape Half Day` and `£150` are in that span — but so are `£170`, `£180` and `£160`. The gate would have passed identically had the extractor assigned Sereni-Tea's £170 to Escape.

The demo's assignment was verified correct by a human reading the column positions in the raw text layer, **not** by the gate. That violates the spirit of the iron rule "no gate depends on model self-assessment" (PRD §1): for multi-column PDFs, the price↔package binding is currently a model judgment.

## Why it matters

The pdf tier is the only tier whose artifact has semantically-meaningful whitespace. Every other tier's artifact is HTML/JSON, where the markup carries the binding. As more pdf-tier spas are added, a silently-swapped column price would enter the diff fully "grounded".

## Possible directions (not prescriptive)

- Column-aware gate case for pdf-tier checks: preserve the raw (un-normalized) line, require the price to sit within the same column x-range as the pass name.
- Use `pdftotext -bbox`/`-tsv` to get coordinates and gate on geometric proximity rather than string adjacency.
- Cheap interim guard: demote when a pdf-tier span contains **more than one** price figure, forcing a tighter quote or a human check.

The interim guard alone would have caught this case.

## Acceptance criteria

- [ ] A pdf-tier check whose span contains a neighbouring package's price cannot ground silently
- [ ] Unit test with a two-column fixture: correct assignment grounds, swapped assignment demotes
- [ ] SKILL.md's pdf-tier warning replaced by the enforced behaviour

## Blocked by

None — [04 PDF tier](04-pdf-tier.md) has shipped.
