# Matching cascade + rename engine

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §4 (excluding successors).

## What to build

Match each fetched pass to an existing entry via the cascade: (1) booking-portal item id (stable `bookingUrl` path segment) — auto-applies, including renames when the name differs; (2) exact normalized name — auto-applies; (3) structural similarity (price/duration/inclusions) — rendered as "possible rename: X → Y", never applied. On an applied rename: re-slug the id to `<spa-prefix>-<slug-of-new-name>`, auto-rewrite mechanical refs (`dayPassId` props, `#<id>` anchor fragments) in the same PR so the priced-content validation stays green, and flag — not rewrite — prose mentions (case-insensitive grep of the old name, each hit a ⚠️ with file:line + context). Slug collision → flag, never invent a disambiguated id.

Existing entry matched by nothing → ⚠️ missing-from-source flag (data untouched, no `lastVerified` bump). Fetched pass matching nothing → ℹ️ note only.

## Acceptance criteria

- [ ] Tier-1 rename end-to-end: id re-slugged, mechanical refs rewritten, `npm test` (incl. priced-content validation) green in the PR branch
- [ ] Tier-3 candidates and prose mentions appear as suggestions/flags only; data untouched
- [ ] Matching unit-tested per tier, including dead-bookingUrl + changed-name falling to tier 3, and slug collision flagged

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
