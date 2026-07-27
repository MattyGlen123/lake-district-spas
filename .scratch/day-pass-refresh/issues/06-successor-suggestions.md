# Successor suggestions + `--accept-successor`

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §4 (seasonal replacement = rename-plus), §1 flags.

## What to build

Detect seasonal replacements under the strict 1:1 rule: exactly one vanished existing pass structurally matching exactly one unmatched new pass → render "possible successor: X → Y" in the PR's missing-flag section with match evidence (price, shape, availability, positional replacement), never auto-applied. `--accept-successor <existing-id>` on a re-run applies it via the full rename engine (re-slug, mechanical rewrites, prose flags). Multi-candidate ambiguity, no-predecessor additions, and apparent merges stay ⚠️ flag + ℹ️ note — discovery remains out of scope.

## Acceptance criteria

- [ ] A vanished pass with one structural match renders a successor suggestion with evidence; with two candidates it renders a plain missing-flag + notes
- [ ] `--accept-successor <id>` re-run applies the rename through the engine and the priced-content validation stays green
- [ ] Nothing is ever added or renamed without the flag→accept round-trip

## Blocked by

- [05 Matching cascade + rename engine](05-matching-rename-engine.md)
