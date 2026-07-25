# Seasonal churn vs refresh-only scope

Status: ready-for-human
Labels: wayfinder:grilling
Assignee: Matthew Glen (via Claude session)
Map: ../MAP.md

## Question

The source audit found passes that are *replaced*, not just repriced: Swan's Winter Glow became Spring Awakening, and Low Wood Bay has 5 packages on its site that we don't list. The map's scope says refresh-existing-only (discovery is out of scope) and never-auto-delete — but a seasonal replacement is simultaneously a removal (flag) and an addition (out of scope?). Left unresolved, the automation would flag Winter Glow as missing forever while never listing its successor, making the data *worse* over time for seasonal spas.

Decide: does the spec treat a detected successor/replacement as in-scope (a "rename-plus" case, linking to the rename policy in [Rename & id-stability policy](03-rename-id-stability.md)), or does it stay out of scope with the flag noting "successor exists: <name>" for manual action? Does this nudge the scope boundary on new passes at known spas?

## Comments

**Surfaced by** the resolution of [Source audit of the 15 spas' day-pass pages](02-source-audit.md), 2026-07-24.
