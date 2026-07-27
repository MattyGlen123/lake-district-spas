# Full deterministic gate suite + evidence artifact

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §5.

## What to build

Extend the walking skeleton's gate script into the full suite, every check deterministic against the saved fetch artifact:

- **Contiguity**: quote must be one contiguous span containing both pass name (or booking-item title) and price.
- **Poison words**: `member|membership|resident|voucher|deposit|per month` in the span or ±200 chars of artifact context → demote to ⚠️ flag with quote shown.
- **Plausibility bounds**: move >±40%, or any price outside £20–£400 (spec constants), even if unchanged → ⚠️ flag with quote + computed %.
- **Arithmetic cases**: pence→GBP conversion and per-couple ×2 (`priceGBP` = group total, `pricePerPerson` quoted) as explicit script cases, ready for the portal/PDF tiers.
- **Evidence artifact**: full per-pass quote set written to `.claude/content-out/refresh-runs/<date>/evidence.md`, linked from the PR; PR body shows per-spa samples only.

## Acceptance criteria

- [ ] Each gate has unit tests including at least one demote case (wrong-price-nearby, member price, out-of-bounds)
- [ ] Gate failures land in the flagged lane with the quote rendered; the diff and `lastVerified` are untouched for demoted passes
- [ ] A run on a clean-HTML spa produces evidence.md and links it from the PR body

## Blocked by

- [01 Walking skeleton](01-walking-skeleton.md)
