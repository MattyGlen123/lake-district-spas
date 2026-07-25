# PR anatomy & failure UX

Status: ready-for-human
Labels: wayfinder:prototype
Assignee: Matthew Glen (via Claude session)
Map: ../MAP.md

## Question

What exactly does the automation's PR look like — description layout, per-change evidence (quote + source link is already decided; how is it rendered?), how flagged-missing passes appear, what happens when some spas fail to fetch (partial PR? failure section?), and whether `lastVerified` updates on unchanged-but-confirmed passes.

Resolve by prototyping: mock up a realistic PR description with 2–3 price changes, 1 missing pass, 1 fetch failure, and react to it. Link the mock as an asset.

## Assets

- [Mock PR description](../../../.claude/content-out/day-pass-refresh-mock-pr.md) — realistic `/refresh-day-passes` PR body built from real audit data (Whitewater +25%, Lodore +14%, Winter Glow successor, Old England 403); ▶ marks the two open decision points.
