# Rename engine can mint duplicate ids for fan-out passes

Status: needs-triage
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §4 (matching/rename).
Found while building [03b](03b-portal-trybe-jsonld.md).

## The problem

When two existing passes are weekday/weekend variants sharing ONE booking item, they also share a
`packageName`. If the source renames that package, tier-1 matching reports a rename for BOTH — and
`planRename` re-slugs both to the SAME new id, reporting `applied: true` each time.

Verified against real North Lakes data (2026-08-26):

```js
planRename('north-lakes-simple-ritual-weekday', 'The Simple Ritual', 'Simple Ritual', siblings)
// -> { applied: true, newId: 'north-lakes-simple-ritual' }
planRename('north-lakes-simple-ritual-weekend', 'The Simple Ritual', 'Simple Ritual', siblings)
// -> { applied: true, newId: 'north-lakes-simple-ritual' }   // same id
```

Two distinct failures fall out:

1. **Lost variant distinction.** `…-weekday` re-slugs to `north-lakes-simple-ritual`, which no longer
   says weekday, while its twin keeps `-weekend`. Asymmetric and misleading.
2. **Duplicate ids.** Applied naively (as a single batch computed up front) both entries end up with
   the same id. `checkSlugCollision` only catches this if the caller re-reads sibling ids between
   renames — it compares against the ids it was handed, and the new id is in neither list.

`applyRenameToFiles`'s global `packageName` replace compounds it, though that half is fixed
separately in [03a](03a-portal-onejourney-ssr.md).

## Current mitigation

03b documents the rule in `SKILL.md` — **fan-out passes never auto-apply a rename**; render them as
⚠️ suggestions for a human — and hand-applies it. Nothing enforces it in code.

## What to build

Make the engine refuse rather than rely on the operator remembering:

- `planRename` (or a wrapper) should reject when the computed `newId` is already claimed by a pass
  in the same batch, not just in `siblingIds` — i.e. give the caller a way to plan a SET of renames
  atomically and have the whole set fail on any internal collision.
- Model fan-out explicitly: a matched pair where two existing passes share one fetched item should
  be marked (e.g. `fanOut: true` on the match) so callers can apply the never-auto-rename rule
  without re-deriving it from `daysAvailable`.
- Unit tests for: two variants of one item renaming to the same slug; a batch whose members collide
  only with each other.

## Acceptance criteria

- [ ] A rename set that would produce duplicate ids is refused with a clear reason, never applied
- [ ] Fan-out matches are identifiable from `matchPasses` output
- [ ] `npm run typecheck && npm test` green

## Blocked by

- [05 Matching/rename engine](05-matching-rename-engine.md)
