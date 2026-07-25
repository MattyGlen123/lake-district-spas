# Source audit of the 15 spas' day-pass pages

Status: closed
Labels: wayfinder:research
Assignee: Matthew Glen (via research subagent)
Map: ../MAP.md

## Question

For every day pass in `src/data/day-passes/` (15 spa files): is its `dayPassUrl` still live and does it still show the pass? Which spas publish day-pass data in PDFs rather than (or in addition to) HTML? And what pricing structures do the live pages actually use — flat price, per-person, weekday/weekend split, seasonal, "from £X"?

Output: a per-spa table (spa, passes listed, source URL status, HTML/PDF, pricing structure observed, obvious drift already visible vs our data). This audit feeds both the schema-fit question and the verification discussion.

Research branch (findings will land here): `research/source-audit`

## Comments

**Resolution** (2026-07-24, research subagent): Full findings on branch `research/source-audit` at `.scratch/day-pass-freshness/research/source-audit.md`. 110 passes, 15 spas, 24 distinct dayPassUrls fetched.

- **Dead/moved**: 4× 404 (Lodore ×2, Daffodil ×2 — 6 pass entries affected), 1× 403 bot-block (Macdonald Old England), 1 redirect (Appleby apex → `http://www.`).
- **Prices not in HTML**: 5 spas (Lakeside, North Lakes, Appleby, Underscar, Armathwaite) — prices only in try.be/onejourney booking portals or a PDF. Key mechanism implication: fetch `bookingUrl` not `dayPassUrl` for these.
- **PDFs**: 3 spas link brochures; only Armathwaite *requires* PDF parsing (sole price source).
- **Structures single `priceGBP` can't represent**: "from £X" floors (all Low Wood Bay), weekday/weekend splits (currently faked as duplicate entries), promo codes (Lodore 20%), per-hour extensions (Netherwood £10pp/hr), seasonal package churn (Swan), per-couple vs pp quoting (Whitewater).
- **Worst drift**: Whitewater +17–25% despite lastVerified 2026-01-22; Low Wood Bay 9/17 underpriced £4–20 + 5 new packages missing; Lodore Restart £180→£205; Daffodil 4/10 passes at 404s; Swan Winter Glow replaced by Spring Awakening. Clean: Beech Hill, Grange, Another Place.
