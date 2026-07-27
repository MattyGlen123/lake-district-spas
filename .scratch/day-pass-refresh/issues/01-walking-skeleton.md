# Walking skeleton: `/refresh-day-passes --spa <id>` on one clean-HTML spa

Status: ready-for-agent
Type: AFK
Assignee: (unclaimed)

## Parent

[Day Pass Data Refresh PRD](../../day-pass-freshness/PRD.md) — §1, §2, §5 (gate 1 only), §6.

## What to build

The tracer bullet: a Claude Code skill `/refresh-day-passes` that, for one `html`-tier spa (`--spa <id>`, e.g. Beech Hill), runs the whole path thin but complete: curl the spa's `dayPassUrl` with a browser UA → save the fetch artifact under `.claude/content-out/refresh-runs/<date>/` → extract each existing pass's current price with a verbatim quote → run a script gate that greps the quote in the artifact and confirms the stored figure appears inside it (whitespace/entity normalization only) → update `priceGBP` on grounded changes and bump `lastVerified` on all grounded passes → open a draft PR via `gh` whose body follows the normative template's price-change + verified-unchanged sections (blockquoted quote, source URL, fetch timestamp).

Ungrounded passes go to a ⚠️ flag section with no data change and no `lastVerified` bump. Nothing is ever deleted. Later slices add the other tiers, gates, matching, and failure lanes — this slice only needs stubs where they'd plug in.

## Acceptance criteria

- [ ] `/refresh-day-passes --spa 10` produces a real draft PR for Beech Hill with grounded evidence per pass
- [ ] Fetch artifact saved; the gate script greps quotes against that exact artifact, and a gate failure lands in the flag section, never the diff
- [ ] Diff touches only price fields and `lastVerified`; `npm test` stays green
- [ ] Skill + gate script committed; PR body sections match the normative template's layout for the sections exercised

## Blocked by

None - can start immediately
