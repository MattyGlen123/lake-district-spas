# Fetch & extraction mechanism

Status: ready-for-agent
Labels: wayfinder:research
Assignee: (unclaimed)
Map: ../MAP.md

## Question

How should the automation fetch spa websites and PDF downloads, and extract day-pass data from them — and where should it run when manually triggered?

Compare at minimum: Claude Code session with WebFetch, headless browser (Playwright), a fetching MCP (e.g. Firecrawl or similar), plain HTTP + PDF parsing. For the run environment, compare: local Claude Code slash command vs GitHub Action (`workflow_dispatch`) vs other — weighing web access from CI, where the API key/tokens live, and how the PR gets opened. Constraints from the map's Notes: manual trigger, user's own tokens are fine, MCP/integration choices are ours to make. Some sources are PDFs linked from spa websites — the mechanism must handle both. Recommend one mechanism + one run environment, with fallbacks noted.

Research branch (findings will land here): `research/fetch-mechanism`
