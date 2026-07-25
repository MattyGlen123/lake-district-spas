# Seasonal churn vs refresh-only scope

Status: closed
Labels: wayfinder:grilling
Assignee: Matthew Glen (via Claude session)
Map: ../MAP.md

## Question

The source audit found passes that are *replaced*, not just repriced: Swan's Winter Glow became Spring Awakening, and Low Wood Bay has 5 packages on its site that we don't list. The map's scope says refresh-existing-only (discovery is out of scope) and never-auto-delete — but a seasonal replacement is simultaneously a removal (flag) and an addition (out of scope?). Left unresolved, the automation would flag Winter Glow as missing forever while never listing its successor, making the data *worse* over time for seasonal spas.

Decide: does the spec treat a detected successor/replacement as in-scope (a "rename-plus" case, linking to the rename policy in [Rename & id-stability policy](03-rename-id-stability.md)), or does it stay out of scope with the flag noting "successor exists: <name>" for manual action? Does this nudge the scope boundary on new passes at known spas?

## Comments

**Surfaced by** the resolution of [Source audit of the 15 spas' day-pass pages](02-source-audit.md), 2026-07-24.

**Resolution** (2026-07-25, grilling session with Matthew):

- **Seasonal replacement = rename-plus.** A detected successor (existing pass vanished, structurally similar new pass in its place — e.g. Swan's Winter Glow → Spring Awakening) is a **tier-3 suggested rename** under [Rename & id-stability policy](03-rename-id-stability.md): surfaced in the PR as "possible successor: X → Y", never auto-applied. On human approval, 03's full rename policy runs (re-slug id, rewrite mechanical refs, flag prose).
- **Recurrence churn accepted.** When the season swings back (Spring Awakening → Winter Glow in November), a second suggested rename fires. Twice-yearly id re-slugs and mechanical rewrites are free; prose flags surface genuinely stale seasonal copy — the system working, not noise. No dampening machinery (no formerNames/aliases, no dormant state).
- **No seasonality schema field — considered and rejected.** No `seasonal` flag, no dormant marker on `DayPassOption`. Seasonality is handled entirely by the rename-plus flow; [Schema-fit](06-schema-fit.md) stays focused on pricing structures and must not reopen this.
- **Strict 1:1 scope edge.** A successor suggestion requires exactly one vanished existing pass structurally matching one new pass; the automation proposes only the single best match. No-predecessor additions (Low Wood Bay's 5 unlisted packages), multi-candidate ambiguity, and apparent merges stay ⚠️ missing-flag + ℹ️ note for manual action. Discovery remains out of scope — the boundary moves by one precise case (successorship), nothing more.
