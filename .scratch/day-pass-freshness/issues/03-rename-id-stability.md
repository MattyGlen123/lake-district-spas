# Rename & id-stability policy

Status: ready-for-human
Labels: wayfinder:grilling
Assignee: (unclaimed)
Map: ../MAP.md

## Question

When a spa renames a day pass (or restructures it enough that matching is ambiguous), what should the automation do — and what keeps `id` values stable given that FAQ and blog content reference passes by id, enforced by the `src/data/priced-content.test.ts` build-time validation?

Sub-questions: is `id` immutable once published? How does the automation match a fetched pass to an existing one (by name? by URL? fuzzy)? When matching fails, does the change land in the PR as a flagged review item (consistent with never-auto-delete) or block the PR?
