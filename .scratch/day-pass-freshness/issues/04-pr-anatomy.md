# PR anatomy & failure UX

Status: closed
Labels: wayfinder:prototype
Assignee: Matthew Glen (via Claude session)
Map: ../MAP.md

## Question

What exactly does the automation's PR look like — description layout, per-change evidence (quote + source link is already decided; how is it rendered?), how flagged-missing passes appear, what happens when some spas fail to fetch (partial PR? failure section?), and whether `lastVerified` updates on unchanged-but-confirmed passes.

Resolve by prototyping: mock up a realistic PR description with 2–3 price changes, 1 missing pass, 1 fetch failure, and react to it. Link the mock as an asset.

## Assets

- [Mock PR description](../../../.claude/content-out/day-pass-refresh-mock-pr.md) — realistic `/refresh-day-passes` PR body built from real audit data (Whitewater +25%, Lodore +14%, Winter Glow successor, Old England 403). **Adopted verbatim as the normative PR template.**

## Comments

**Resolution** (2026-07-25, prototype session with Matthew):

**The mock is the answer — adopted verbatim as the normative PR template** for [Assemble the spec](07-assemble-spec.md). Layout locked: section order (price changes → missing-flags → promo notes → failures → verified-unchanged → diff summary); per-change evidence = blockquoted scraped text + linked source URL + fetch timestamp; ℹ️ inline normalization notes ([Schema fit](06-schema-fit.md) rules); missing passes rendered as ⚠️ action-needed flags, never diffs ([never-auto-delete]); successor rendered as tier-3 "possible successor: X → Y" with match evidence, applied only via `--accept-successor <id>` re-run or manual edit ([Seasonal churn](08-seasonal-churn.md)); promos listed as evidence with list price kept ([Schema fit](06-schema-fit.md)); unchanged list collapsed in `<details>`.

Two open sub-questions decided:

1. **Partial-fetch UX: partial PR + one filed issue per failure.** A failed spa never blocks the run; its entries and `lastVerified` are untouched, the PR's "Not fetched" table links a separately-filed issue per failure (error, URL, retry log) so failures get their own review lane and each drives an automation fix.
2. **`lastVerified` bumps on unchanged-but-confirmed passes.** All confirmed passes get `lastVerified → run date` even with no price change; date churn (~95% of diff lines) accepted. Post-run invariant: stale `lastVerified` = exactly the failed/flagged set.
