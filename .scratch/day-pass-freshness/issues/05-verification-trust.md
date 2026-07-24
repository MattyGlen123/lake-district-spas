# Verification & trust gating for extracted data

Status: needs-triage
Labels: wayfinder:grilling
Assignee: (unclaimed)
Blocked-by: [Fetch & extraction mechanism](01-fetch-mechanism.md), [Source audit of the 15 spas' day-pass pages](02-source-audit.md)
Map: ../MAP.md

## Question

The user's core worry: fetched data may be inaccurate at the source of extraction (LLM misreading a page or PDF, picking up a member price, last year's PDF). What verification must extracted data pass before it can appear in the PR at all — e.g. exact-quote grounding (extracted price must appear verbatim in fetched content), double-pass extraction agreement, confidence thresholds per field?

Depends on which mechanism was chosen (what guardrails it makes possible) and what the source audit showed about how messy the real pages are.
