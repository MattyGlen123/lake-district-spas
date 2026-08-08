# Evidence — day-pass refresh 2026-08-08 (pdf tier demo)

Run: `/refresh-day-passes --spa 2` (pdf tier) · fetched 2026-08-08 11:57 BST

## Armathwaite Hall Hotel Spa (2) — 6/12 grounded, 2 changes, 6 flagged

Source page: [armathwaite-hall.com/spa/spa-day-experience/](https://www.armathwaite-hall.com/spa/spa-day-experience/) (saved `spa-2-page.html`, curl 200) linked one brochure PDF: `https://www.armathwaite-hall.com/wp-content/uploads/2026/02/2531014-Spa-Brochure-October-V8.2.pdf`.

**Artifact = text layer** extracted by `fetch-pdf.mjs` (`spa-2.txt`, `pdftotext -layout`, 49,524 chars, `textLayerUsable: true` — well above the 200-char floor, so no Claude document-block fallback needed). Raw PDF fetched to `spa-2.pdf` (1 curl attempt, HTTP 200, 7.4MB) but **deliberately not committed** — at 7.4MB per run it would bloat the repo, and it is re-fetchable from the source URL in `spa-2-fetch-log.json`. The gated artifact is the committed text layer. Retry log `spa-2-fetch-log.json` · checks `spa-2-checks.json` · gate results `spa-2-gate-results.json`.

### Vintage evidence (gate 4)

`evidenceType: "filename"` — the source URL's upload path is `/wp-content/uploads/2026/02/...`, `documentYear: 2026` literally present in the URL, `runYear: 2026` (today 2026-08-08) → not stale, gate 4 passes on all 12 checks (`documentYear: 2026` recorded on every result). No cover-date/valid-until line was found in the extracted text as a second source of evidence.

### 💷 Price changes (2)

Both ground on the same span (`spa-2.txt` lines 103–111, Escape Half Day / Sereni-Tea Spa Half Day two-column block):

#### armathwaite-escape-weekday · stored £140 → source £150 · ✅ grounded, +7.1%

> `Escape Half Day Mon - Fri Sereni-Tea Spa Half Day Mon - Fri A half-day package with full use of the A half day package with full use of the £170 only luxurious facilities and including a 50-minute spa's luxurious facilities from 10.00am until £150 face or body treatment. The Escape 2.00pm including a 50-minute face or Weekend experience can be booked at the following Weekend body treatment followed by an indulgent & BH times: 10am until 2pm and 2pm until 6pm. & BH afternoon tea in the hotel's Lake View £180 £160 Lounge. 10.00am – 2.00pm.`

ℹ️ Two-column brochure layout means `pdftotext -layout` interleaves the Escape and Sereni-Tea columns line-by-line; the quote is genuinely contiguous in the saved artifact even though it reads as bleeding between the two packages.

#### armathwaite-escape-weekend · stored £150 → source £160 · ✅ grounded, +6.7%

Same span as above.

### ⚠️ Flags (6) — gate 2 pass-name-not-in-quote, no data change

The brochure shortens three package titles versus the stored `packageName` — gate 2 (contiguity) correctly refuses to ground a price against a name that isn't actually in the span, rather than trust a name I supply:

- **armathwaite-sereni-tea-weekday / -weekend** — stored name `Sereni-Tea Half Day`, brochure says `Sereni-Tea Spa Half Day` (extra "Spa"). Source prices are £170 / £180 (up from stored £160 / £170) but NOT applied — flagged only.
- **armathwaite-serenity-weekday / -weekend** — stored name `Serenity Full Spa Day`, brochure says just `Serenity`. Source prices £200 / £210 (up from stored £190 / £200) — flagged only.
- **armathwaite-mother-to-be-weekday / -weekend** — stored name `Mother To Be Full Day`, brochure says just `Mother To Be`. Source prices £150 / £160 match stored exactly (no change) — still flagged, since gate 2 runs before the price comparison.

None of these six is a vintage failure (gate 4 never runs — gate 2 demotes first) and none is the "whole spa" vintage-stale case (PRD §2/§5): the brochure itself is current, only the extractor-supplied name drifted from the stored title. `lastVerified` stays `2026-01-22` on all six; re-run after either updating the stored `packageName`s or confirming the brochure's shorter titles are intentional renames (05 matching/rename engine, out of scope here).

### ✅ Verified unchanged (4)

- **armathwaite-sunset-weekday** · stored £70 → source £70 · grounded
- **armathwaite-sunset-bank-holiday** · stored £80 → source £80 · grounded
- **armathwaite-sunrise-weekday** · stored £70 → source £70 · grounded
- **armathwaite-sunrise-bank-holiday** · stored £80 → source £80 · grounded

All four ground on `spa-2.txt` lines 94–100 (Sunrise Spa / Sunset Spa two-column block); both package names match the stored `packageName` exactly.

> `Sunrise Spa Mon - Thu Sunset Spa Mon - Fri Enjoy early spa access to our luxurious spa only Enjoy evening access to our spa facilities, only facilities, including tea, coffee and pastries £70 a glass of prosecco in our outdoor £70 on arrival. 7.30am until 10am. hydrotherapy pool and use of robes. BH BH 6pm until 8pm. £80 £80`

## Post-run invariant (PRD §6)

`check-invariant.mjs .claude/content-out/refresh-runs/2026-08-08 2026-08-08 2` → **ok, 0 violations**: the 6 grounded passes (2 changed + 4 unchanged) bumped to `2026-08-08`; the 6 flagged passes stayed at `2026-01-22`.

## Fetch failure lane — not exercised this run

Armathwaite's brochure fetched cleanly (HTTP 200 on the first attempt) and the text layer was usable, so the failure lane (filed tracker issue + ❌ not-fetched row) was not triggered by the live source. Per the task's fallback instruction, gate 4's stale-vintage/whole-spa-demotion path is separately proven against a fixture in `tests/unit/refresh-day-passes-gate.test.ts` (`pdf-vintage-stale`, `pdf-vintage-evidence-not-found-in-artifact`, etc. — 12 dedicated cases).
