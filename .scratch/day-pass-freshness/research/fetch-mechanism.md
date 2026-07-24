# Fetch mechanism for day-pass freshness automation

Ticket: `.scratch/day-pass-freshness/issues/01-fetch-mechanism.md`
Researched: 2026-07-24. Probes run against live source URLs from `src/data/day-passes/*.ts`.

## TL;DR

**Mechanism:** plain HTTP (curl, browser UA) fetched into a local Claude Code session that reads the *raw* HTML/JSON/PDF — with repo-local Playwright as fallback for the rare page needing real JS. **Not** WebFetch (proved lossy), **not** a paid fetching MCP (unneeded).
**Run environment:** local Claude Code skill (slash command), manual trigger; opens PR via `gh`.

## Evidence: live probes (2026-07-24)

| Source | Probe | Result |
| --- | --- | --- |
| `another.place/the-lake/swim-club/` | curl, browser UA | 200, plain HTML, prices inline (£60/£110/£120) |
| `macdonaldhotels.co.uk/old-england/.../spa/days` | curl, browser UA | 200, prices inline (£98–£225). "captcha" strings present in page scripts — bot-protection is armed; datacenter IPs (CI) at risk |
| `crerarhotels.com/.../twilight-spa-offer/` | curl, browser UA | 200, price inline (£40) |
| `lakesidehotel.co.uk/spa/spa-day/` | curl + WebFetch | 200 but **zero prices on page**; prices live behind `lakesidehotel.onejourney.travel/spa/days` booking engine |
| `lakesidehotel.onejourney.travel/spa/days` | curl raw HTML | Next.js SPA (`<div id="__next">`), but `__NEXT_DATA__` JSON embeds **all** packages + prices in pence (`"Signature Sanctuary Spa Day" price 9500` = £95). Plain HTTP wins |
| same URL | **WebFetch** | Returned "content appears empty" — HTML→markdown conversion strips the JSON. **WebFetch silently loses exactly the data we need** |
| `whitewater-hotel.co.uk/.../Cascades-Spa-Brochure-26.pdf` (linked from spa page) | curl | 200, `application/pdf`, 1.7 MB, freely downloadable. Confirms PDF handling is required |

Notes:
- No spa in the probe set hard-blocked a curl with a browser User-Agent from a residential IP.
- This Mac currently has **no PDF tooling** (no poppler/pdftotext, no pypdf/pdf-parse). One-time `brew install poppler` enables Claude Code's native PDF `Read`. (Alternative: send PDF bytes to the Claude API as a document block — no local parser at all.)

## Mechanism comparison

| Mechanism | HTML | JS-rendered | PDF | Accuracy | Cost/setup | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **curl + Claude reads raw source** | Yes | Yes when data is SSR/embedded (onejourney: yes) | Yes (poppler or API doc block) | High — model sees exact source incl. `__NEXT_DATA__` | Zero cost, near-zero setup | **Primary** |
| Claude Code WebFetch | Yes | **No — proved lossy** (returned empty on onejourney) | No | Uses a small fast model on converted markdown; double accuracy risk | Zero | Reject as primary; fine for quick spot-checks of plain pages |
| Playwright (already a devDependency) | Yes | Yes, fully | Via download | High | Already installed; slower, heavier | **Fallback** for any future page with truly client-only pricing |
| Fetching MCP (Firecrawl et al.) | Yes | Yes | Partial | Good, but adds a conversion layer | Firecrawl now subscription-only (June 2026): free 1k credits/mo, Hobby $16/mo | Reject — solves bot-blocking/JS problems we demonstrably don't have at ~15-URL scale |

## Run environment comparison

| Environment | Web access | Key/session | PR flow | Setup | Verdict |
| --- | --- | --- | --- | --- | --- |
| **Local Claude Code skill** (`/refresh-day-passes`) | Residential IP — probes all passed; Macdonald's armed bot-protection is the risk CI would trip | User's existing Claude session; no new secret storage | `gh pr create` from a branch, human reviews diff | Write one skill file + `brew install poppler` | **Recommended** |
| GitHub Action (workflow_dispatch + claude-code-action) | Azure datacenter IPs — highest bot-block risk (Macdonald/Cloudflare-class sites) | `ANTHROPIC_API_KEY` repo secret to provision + rotate | Native; needs `contents`/`pull-requests` perms | Workflow + secret + poppler install step | Fallback if runs must be off-machine |
| Scheduled cloud agent / remote session | Same datacenter-IP concern; overkill for manual-only trigger | Managed | OK | More moving parts | Reject for now |

Deciding factors: manual trigger only (no need for CI cadence), accuracy > speed (review the diff in a PR regardless), token spend is fine, and the only observed anti-bot signal (Macdonald) is precisely the thing residential-IP local runs sidestep.

## Fallbacks (noted, in order)

1. Page raw-HTML lacks prices → follow booking-engine link (pattern: Lakeside → onejourney) and read its raw HTML/`__NEXT_DATA__`.
2. Still nothing / truly client-rendered → repo's Playwright: tiny script dumps rendered text for Claude to read.
3. A site starts blocking local curl → same Playwright fallback (real browser); only if *that* fails, revisit Firecrawl free tier (1k credits/mo covers 15 URLs trivially).
4. PDF unreadable locally → pass PDF as document block direct to Claude API.

## Recommendation

Build a **local Claude Code skill** (e.g. `/refresh-day-passes`, manual only) that, per spa: curls the `dayPassUrl`s (browser UA) and any linked booking-engine page or PDF, has Claude extract prices/durations/links from the **raw** fetched source (never WebFetch's markdown), diffs against `src/data/day-passes/*.ts`, edits the data files, runs `npm test`, and opens a PR via `gh` on a branch for human review. One-time setup: `brew install poppler`. Playwright (already installed) is the documented fallback for JS-only or newly-blocked pages. No MCP subscription, no CI secret, no new infrastructure.

Sources: [Firecrawl pricing 2026](https://www.eesel.ai/blog/firecrawl-pricing), [Firecrawl MCP pricing](https://toolradar.com/tools/firecrawl-mcp/pricing), [Firecrawl review 2026](https://use-apify.com/blog/firecrawl-review-2026), [Playwright MCP docs](https://playwright.dev/docs/getting-started-mcp), [Playwright MCP vs Claude in Chrome 2026](https://lalatenduswain.medium.com/playwright-mcp-vs-claude-in-chrome-which-browser-testing-tool-should-you-use-in-2026-e502bee0067a)
