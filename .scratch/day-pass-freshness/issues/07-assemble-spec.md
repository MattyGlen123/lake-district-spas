# Assemble the spec (PRD.md)

Status: closed
Labels: wayfinder:task
Assignee: Matthew Glen (via Claude session)
Blocked-by: [Fetch & extraction mechanism](01-fetch-mechanism.md), [Source audit of the 15 spas' day-pass pages](02-source-audit.md), [Rename & id-stability policy](03-rename-id-stability.md), [PR anatomy & failure UX](04-pr-anatomy.md), [Verification & trust gating for extracted data](05-verification-trust.md), [Schema fit: does DayPassOption hold what spas publish?](06-schema-fit.md), [Seasonal churn vs refresh-only scope](08-seasonal-churn.md)
Map: ../MAP.md

## Question

Fold every resolved decision on this map into `.scratch/day-pass-freshness/PRD.md` — the locked spec that is this map's destination. Structure it so `/to-issues` can break it into implementation tickets as a follow-on effort. Nothing new is decided here; if assembling exposes an unmade decision, that's a new ticket, not a judgment call inside this one.

## Comments

**Resolution** (2026-07-27, Claude session): [PRD.md](../PRD.md) written and locked — all seven ticket resolutions folded in with provenance links; no unmade decisions surfaced. Structure: goal/shape+scope+flags, fetch (mechanism, per-spa tier table, failure UX), normalization rules (06), matching/rename/successor policy (03+08), verification gates (05), PR anatomy (04, normative template referenced), rollout (3-spa pilot per 05), considered-and-rejected register, acceptance criteria for `/to-issues`. This closes the map — destination reached.
