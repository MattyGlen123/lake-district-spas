Read the plan file at the path provided as an argument to this prompt.

Analyse the plan and break it into a multi-phase structure, then overwrite the file with the updated version.

---

## How to split phases

Split on **natural logical boundaries** — the kind where one concern is fully resolved before the next begins. Common seams:

- Type / interface changes before the code that depends on them
- Data layer before the logic that consumes it
- Implementation before tests that verify it
- Code changes before generated content (articles, copy, config)
- Shared utilities before the features that use them

Each phase should be **independently completable and reviewable** — a developer should be able to stop after any phase, inspect the output, and pick up cleanly at the next.

Aim for **3–6 phases**. If the plan is small enough to fit in one phase, say so and leave the file unchanged.

---

## Checkpoint steps

Only include a checkpoint at the end of a phase (e.g. `Run: npm test`, `Run: npm run typecheck`) if the original plan **already contains** that verification step. Do not invent new checkpoints. Move existing ones to the end of the phase they logically close.

---

## Output format

Overwrite the plan file in-place. Preserve all existing content — reorder and group it into phases rather than rewriting it. The updated file should follow this structure:

```
## Overview
[Brief summary of the full feature — preserve original if present]

---

## Phase 1 — [Short label]
[All steps, file changes, and notes that belong to this phase]

### Checkpoint *(only if a relevant test/typecheck step existed in the original plan)*
[Exact command(s) from the original plan]

---

## Phase 2 — [Short label]
...

---

## Files Created / Modified
[Preserved from original, with a Phase column added]

---

## Notes & Constraints
[Preserved from original, unchanged]
```

Add a `Phase` column to the files table if one is not already present.

Do not add explanatory commentary about why you split the phases the way you did. The file should read as a clean plan, not a critique.
