# Source audit of the 15 spas' day-pass pages

Status: ready-for-agent
Labels: wayfinder:research
Assignee: (unclaimed)
Map: ../MAP.md

## Question

For every day pass in `src/data/day-passes/` (15 spa files): is its `dayPassUrl` still live and does it still show the pass? Which spas publish day-pass data in PDFs rather than (or in addition to) HTML? And what pricing structures do the live pages actually use — flat price, per-person, weekday/weekend split, seasonal, "from £X"?

Output: a per-spa table (spa, passes listed, source URL status, HTML/PDF, pricing structure observed, obvious drift already visible vs our data). This audit feeds both the schema-fit question and the verification discussion.

Research branch (findings will land here): `research/source-audit`
