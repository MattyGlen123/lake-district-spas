# Fetch & extraction mechanism

Status: closed
Labels: wayfinder:research
Assignee: Matthew Glen (via research subagent)
Map: ../MAP.md

## Question

How should the automation fetch spa websites and PDF downloads, and extract day-pass data from them — and where should it run when manually triggered?

Compare at minimum: Claude Code session with WebFetch, headless browser (Playwright), a fetching MCP (e.g. Firecrawl or similar), plain HTTP + PDF parsing. For the run environment, compare: local Claude Code slash command vs GitHub Action (`workflow_dispatch`) vs other — weighing web access from CI, where the API key/tokens live, and how the PR gets opened. Constraints from the map's Notes: manual trigger, user's own tokens are fine, MCP/integration choices are ours to make. Some sources are PDFs linked from spa websites — the mechanism must handle both. Recommend one mechanism + one run environment, with fallbacks noted.

Research branch (findings will land here): `research/fetch-mechanism`

## Comments

**Resolution** (2026-07-24, research subagent): Full findings on branch `research/fetch-mechanism` at `.scratch/day-pass-freshness/research/fetch-mechanism.md`.

- **Mechanism**: plain `curl` (browser UA) feeding raw HTML/`__NEXT_DATA__`/PDF into a Claude Code session. WebFetch disqualified by probe: returns empty on the onejourney booking engine holding Lakeside's prices. Firecrawl-class MCPs unneeded at 15-URL scale (now subscription-only).
- **Run environment**: local Claude Code skill (`/refresh-day-passes`), manual trigger, PR via `gh`. Residential IP avoids the bot protection observed on macdonaldhotels.co.uk that would risk blocking GitHub Actions datacenter IPs.
- **Fallbacks**: repo's existing Playwright for client-rendered/blocked pages; Claude API document blocks for PDFs (confirmed real case: Whitewater Cascades-Spa-Brochure-26.pdf); `brew install poppler` for local PDF reads.
- Probe evidence: all 5 live probed URLs returned 200 to curl with prices recoverable from raw source (one only via embedded booking-engine JSON, prices in pence).
