# PRD: Day Pass Data Refresh (`/refresh-day-passes`)

Status: locked (2026-07-27) · **amended 2026-08-27** — see [§4a](#4a-withdrawals-auto-delete)
Labels: wayfinder:destination
Map: MAP.md

> **Amendment 2026-08-27 — auto-delete reinstated, on conditions.** §8 originally listed
> "auto-delete" as rejected and not to be reopened. Matthew reopened it: re-flagging the same dead
> package every month is manual noise that never resolves itself. §1 and §8 are amended accordingly
> and **§4a** defines the conditions. The reversal is narrow — deletion needs five independent
> conditions including a second sighting on a later run, so nothing is deleted on first sight.

A manually-triggered automation that fetches every listed spa's day-pass data from its source, diffs against `src/data/day-passes/`, and opens a spot-checkable PR. This spec folds every decision from the [day-pass-freshness map](MAP.md); nothing here is new. Implementation is a follow-on effort — break this document into tickets with `/to-issues`.

Decision provenance: [01 fetch mechanism](issues/01-fetch-mechanism.md) · [02 source audit](issues/02-source-audit.md) · [03 rename/id policy](issues/03-rename-id-stability.md) · [04 PR anatomy](issues/04-pr-anatomy.md) · [05 verification gates](issues/05-verification-trust.md) · [06 schema fit](issues/06-schema-fit.md) · [08 seasonal churn](issues/08-seasonal-churn.md). Full research: branches `research/fetch-mechanism`, `research/source-audit`.

## 1. Goal & shape

- A **local Claude Code skill** `/refresh-day-passes`. Manual trigger only. Runs on the user's machine (residential IP avoids the bot-blocking observed on macdonaldhotels.co.uk), user's own tokens.
- Per run: fetch sources → extract → verify (deterministic gates) → write diff to a branch → open PR via `gh`.
- **Never auto-delete, except a proven withdrawal (§4a).** The diff touches only price fields and `lastVerified` (plus approved renames, plus withdrawn entries that clear all five §4a conditions). Everything else is a flag in the PR, not a change.
- **Never auto-add.** Unchanged: discovery stays out of scope.
- **Evidence per change**: every proposed change cites exact scraped text + source URL/PDF, script-verified (§5).

### Scope

Refresh the **existing** passes of the 15 spas with day-pass files: ids 1, 2, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 19 (~110 `DayPassOption` entries).

Out of scope (per map): discovering new passes or spas; verifying "no day passes" for the other 7 spas; treatments freshness; fixing the pre-existing inert `#<pass-id>` blog anchors. One precise exception to no-additions: strict-1:1 successor suggestion (§4).

### CLI flags

- `--spa <id>[,<id>…]` — scope to given spas (ad-hoc re-runs after fixes).
- `--tier <tier>` — scope by fetch tier (§2).
- `--accept-successor <existing-id>` — apply a previously-suggested tier-3 successor rename (§4).

## 2. Fetch

**Mechanism**: plain `curl` with a browser User-Agent; Claude reads raw HTML / embedded `__NEXT_DATA__`/booking-engine JSON / PDF text. WebFetch, Firecrawl-class MCPs, and GitHub Actions are rejected (see §8).

**Fallbacks**: repo's existing Playwright for client-rendered or bot-blocked pages (expected: Old England 403); Claude API document blocks for PDFs; `brew install poppler` (`pdftotext`) for local PDF text layers.

**Every fetch is saved as an artifact** under `.claude/content-out/refresh-runs/<date>/` — the artifact the model reads is the artifact the gates grep (§5). PDF artifacts = the poppler text layer.

### Fetch tiers (from 2026-07-24 audit)

| Tier | Fetch target | Spas |
| --- | --- | --- |
| `html` | `dayPassUrl` page source | Lodore Falls (1), Daffodil (4), Swan (5), Low Wood Bay (7), Beech Hill (10), Whitewater (13), Another Place (14), Netherwood (16), Grange (17) |
| `portal` | `bookingUrl` (try.be / onejourney JSON; prices in **pence**) | Lakeside (9), North Lakes (12), Appleby (15), Underscar (19) |
| `pdf` | linked brochure PDF (sole price source) | Armathwaite (2) |
| `blocked` | Playwright fallback (curl gets 403) | Old England (6) |

Known-bad URLs from the audit (Lodore ×2, Daffodil ×2 dead; Appleby apex redirect) surface as fetch failures / missing-flags on the first run — the run does not pre-patch them.

### Failure UX

A failed spa never blocks the run. Its entries and `lastVerified` are untouched; the PR's "Not fetched" table links **one separately-filed issue per failure** (error, URL, retry log) so each failure gets its own review lane and drives an automation fix. Re-run with `--spa <id>` once addressed.

## 3. Extraction & normalization rules

`DayPassOption` (`src/types/spa.ts`) needs **no schema change**. The extractor normalizes what spas publish into the existing shape:

1. **Weekday/weekend splits → duplicate entries stay canonical.** One `DayPassOption` per bookable variant (~40 such ids across 7 spas). Never collapse; tier-1 matching keys per-entry on bookingUrl item.
2. **"From £X" → silent floor.** Store the floor in `priceGBP`, no marker. Source "from £X" vs stored `X` is a **match**, not drift.
3. **Promo codes → PR-note only.** `priceGBP` always records undiscounted list price; surfaced promos go in the PR description as evidence.
4. **Per-hour extensions → prose only.** `spaDuration` keeps base duration; extensions live in `included`/`description` text.
5. **Per-couple quoting → existing pattern.** Normalize to `priceGBP` (group total) + `pricePerPerson` + `requiredNumbers` (pence→GBP and per-person ×2 arithmetic are explicit script cases in gate 1).

Consequence: zero component ripple — `getLowestDayPassPrice`, `SpaAccessPrice`, `DayPassPrice`, `DayPassCard`, `priced-content.test.ts` all untouched.

## 4. Matching, renames & successors

**Ids are not immutable — they track the current name.** Ids never surface in user-facing URLs (React keys + MDX lookup props only).

**Matching cascade** (fetched pass → existing entry):

1. **Booking-portal item id** (stable path segment of `bookingUrl`) — auto-applies; a tier-1 match with a differing name auto-applies the rename.
2. **Exact normalized name** — auto-applies.
3. **Structural similarity** (price/duration/inclusions) — **suggestion-only**, rendered as "possible rename: X → Y", never applied automatically.

**On rename** (tier-1 auto or human-approved tier-3): re-slug id to `<spa-prefix>-<slug-of-new-name>`; auto-rewrite **mechanical** refs in the same PR (`dayPassId="…"` props, `#<id>` anchor fragments) — this keeps `priced-content.test.ts` green; **flag, don't rewrite, prose** (grep old name case-insensitively; list each hit as ⚠️ with file:line + context). Slug collision → flag, never invent a disambiguated id.

**Seasonal replacement = rename-plus** (strict 1:1): exactly one vanished existing pass structurally matching one new pass → tier-3 "possible successor: X → Y" with match evidence; applied only via `--accept-successor <id>` re-run or manual edit, then the full rename policy runs. Recurrence churn (twice-yearly swings) accepted — no dampening machinery. No-predecessor additions, multi-candidate ambiguity, and merges stay ⚠️ flag + ℹ️ note.

**Flag, never block**: existing entry matched by nothing → ⚠️ checklist item (lastVerified, source URL, what was fetched), data untouched *unless* §4a applies. Fetched pass matching nothing → ℹ️ note only.

## 4a. Withdrawals (auto-delete)

*Added by the 2026-08-27 amendment; supersedes the blanket "never auto-delete" of §1 and §8.*

A pass that is **missing** is not the same as a pass that is **withdrawn**. Missing means we could not read a price; withdrawn means the spa no longer sells it. Only the second justifies deleting data, and only when the source says so twice, in two independent ways, on two different runs.

**All five conditions must hold. Any one missing leaves the pass as today's ⚠️ flag, data untouched.**

| # | Condition | Why it is not enough on its own |
| --- | --- | --- |
| 1 | `pageGone` — the pass's own page returns **404/410** | A timeout, 403 or 5xx is an outage or a bot-block, not a withdrawal. Only a definitive "not here" counts. |
| 2 | `absentFromIndex` — absent from the spa's own offers/day-pass listing, fetched **this run** | A dead deep link can just be a broken link on a live package. The spa's own index is the second, independent signal. |
| 3 | `noSuccessor` — `classifySuccessors` offered no strict-1:1 successor | A renamed package is a **rename**, never a deletion. |
| 4 | `priorSighting` — a previous run recorded the same pass as a withdrawal candidate | A site migration can 404 every URL at once. Requiring two runs means a bad week deletes nothing. |
| 5 | `noReferences` — nothing in the repo still points at the pass id | See below. |

**On condition 5 — why a referenced pass is never deleted.** `getDayPassPrice` returns `null` for an unknown id, and every call site falls back to a hardcoded literal (`{itsAllGoodWeekdayPrice || '£170'}`). So deleting a referenced pass does **not** break the build, fail a test, or show a gap — it silently freezes a dead package's price into the page and keeps advertising it. That is exactly the stale claim the §5 gates exist to prevent. A referenced pass therefore demotes to a ⚠️ flag listing the references; clean them, and the next run deletes it unprompted.

**The withdrawal ledger.** Condition 4 needs memory across runs. Each run writes `spa-<id>-withdrawal-candidates.json` into its run dir listing every pass meeting conditions 1–3, and reads the most recent prior run's ledger to resolve `priorSighting`. Deletions actually applied are recorded in `spa-<id>-withdrawals.json`, which `check-invariant.mjs` reads: a withdrawn id legitimately has a gate verdict and no data entry, and — two-way — an id claimed withdrawn that is **still** in the data file is itself a violation.

**Evidence is unchanged in kind.** A deletion cites the 404 status from the fetch log, the fetched index artifact that lacks the package, the empty `successors` result, and the prior run dir that first recorded it. Deletions render in the PR under **🗑 Withdrawn**, with that evidence, in a diff that still adds nothing.

**Human override.** Matthew may authorise a deletion that has not met condition 4 (or 5, having cleaned the references by hand). Such deletions are labelled **human-authorised** in the PR and evidence, never presented as the rule having fired.

## 5. Verification gates

**Trust model: no gate depends on the model's opinion of itself — every gate is a deterministic script check against the saved fetch artifact.** Gate failure → flagged lane, never the diff.

1. **Exact-quote grounding (hard gate).** Every price entering the PR — changed *and* confirmed-unchanged — needs a quote a script greps verbatim in the fetch artifact, with the stored figure inside the quote. Only whitespace/entity normalization allowed. Pence conversion and per-couple ×2 are explicit script cases. Portal quotes = raw JSON fragment; PDF quotes = poppler text layer.
2. **Contiguity.** The quote is one contiguous span containing *both* the pass name (or booking-item title) *and* the price.
3. **Poison words.** `member|membership|resident|voucher|deposit|per month` in the span or ±200 chars of artifact context → demote to ⚠️ flag with quote shown.
4. **PDF vintage.** Extractor states document-year evidence (filename year, cover date, "valid until") in the PR row; prior-year evidence → whole source treated as fetch failure with filed issue.
5. **Plausibility bounds, flag-never-block.** Move >±75%, or any extracted price outside £20–£400 (spec constants), even if unchanged → ⚠️ flag with quote + computed %.

   > **Amended 2026-08-27→28 (threshold ±40% → ±75%).** Authorised by Matthew during the spa-5 run after manually verifying the disputed price. Swan item `14258` moved £35 → £59 (+68.6%) because the booking item was **repurposed** — a £35 Mon–Thu pass became a £59 Friday one — not because it was repriced. Gate 5 cannot tell a repriced pass from a replaced one, and because the move is measured against a `storedGBP` that never changes while the pass is flagged, ±40% would have re-flagged it every run forever with no path to resolution.
   >
   > This is knowingly a looser net for every spa: gates 1–3 (grounding, contiguity, poison words) remain the real defence against a wrong figure, and gate 5 was always "flag, never block". The narrower fix — detecting a repurposed item from a simultaneous name **and** day-of-week change, and routing it out of the price-plausibility check entirely — is tracked as issue 15 and would allow ±40% to be restored.

Unchanged passes are gated identically, rendered differently: no groundable quote → missing-from-source flag and **no `lastVerified` bump**. Full per-pass quote set written to `.claude/content-out/refresh-runs/<date>/evidence.md`, linked from the PR; the PR body shows per-spa samples.

## 6. PR anatomy

**Normative template — adopted verbatim**: [`.claude/content-out/day-pass-refresh-mock-pr.md`](../../.claude/content-out/day-pass-refresh-mock-pr.md). Locked layout:

- Header: run stats line + a deletions statement — "this PR deletes nothing" when no withdrawal applied, otherwise "this PR deletes N withdrawn passes (§4a); nothing else is removed".
- Section order: 💷 price changes → 🗑 withdrawn (§4a; omitted when empty) → ⚠️ missing-flags → 🏷 promo notes → ❌ not-fetched table (linked filed issues) → ✅ verified-unchanged (collapsed `<details>`) → diff summary table.
- Per change: id + field diff, blockquoted scraped text, linked source URL, fetch timestamp; ℹ️ inline normalization notes.
- Missing passes render as ⚠️ action-needed flags, never diffs; successors as tier-3 suggestions with match evidence.

**`lastVerified` bumps on all confirmed-unchanged passes** (run date); date churn (~95% of diff lines) accepted. **Post-run invariant: stale `lastVerified` = exactly the failed/flagged set.**

## 7. Rollout

1. **Mandated 3-spa pilot**: Whitewater (13), Lakeside (9), Armathwaite (2) — covers clean-HTML-with-drift + per-couple + missing-flag lanes, portal-JSON-pence tier, PDF tier. Matthew reviews the pilot PR and feeds back before any full run.
2. **Full 15-spa run** after pilot sign-off. No further version gates; `--spa`/`--tier` remain for ad-hoc scoping.

Expected first-run findings (audit baseline, will have drifted further): Whitewater +17–25%, Low Wood Bay 9/17 underpriced, Lodore Restart £180→£205, Daffodil 4 passes on 404s, Swan Winter Glow → Spring Awakening successor, Old England 403.

## 8. Considered and rejected — do not reopen

- **WebFetch** — disqualified by probe (empty on onejourney portal). **Firecrawl-class MCPs** — unneeded at 15-URL scale, subscription-only. **GitHub Actions** — datacenter IPs risk bot-blocking.
- **Schema changes**: `isFromPrice` flag, `seasonal`/dormant field, collapsing weekday/weekend duplicates — all rejected (06, 08).
- **Double-pass extraction agreement** and **per-field confidence thresholds** — rejected (05): mechanical gates subsume the former; self-reported confidence is as trustworthy as the extraction it describes and isn't script-checkable.
- **Auto-applied renames below tier 1**, **blocking on flaky spas** — rejected throughout.
- ~~**Auto-delete**~~ — **reopened and reinstated 2026-08-27 under §4a.** The original rejection assumed deletion would key on a single signal (a pass going missing), which is unsafe. §4a instead requires five conditions, including a second sighting on a later run and a clean reference scan. The rejection of *single-signal* auto-delete stands; that is not what §4a does.

## 9. Acceptance criteria

- [ ] `/refresh-day-passes` skill exists; manual local trigger; opens PR via `gh`.
- [ ] All four fetch tiers implemented with saved artifacts; Playwright + PDF fallbacks work.
- [ ] Verification gates 1–5 run as scripts against artifacts; gate failures land in flagged lanes only.
- [ ] PR body matches the normative template; evidence.md written and linked.
- [ ] Failed spas → partial PR + one filed issue each; post-run stale-`lastVerified` invariant holds.
- [ ] Rename cascade + mechanical rewrites keep `priced-content.test.ts` green; prose flagged not rewritten.
- [ ] Withdrawal engine (§4a): five conditions enforced in script; candidate ledger written and read across runs; referenced passes refused; `check-invariant.mjs` reconciles withdrawals two-way.
- [ ] `--spa`, `--tier`, `--accept-successor` flags work.
- [ ] Pilot run (spas 13, 9, 2) reviewed before full run.
