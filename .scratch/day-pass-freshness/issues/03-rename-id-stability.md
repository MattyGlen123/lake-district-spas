# Rename & id-stability policy

Status: closed
Labels: wayfinder:grilling
Assignee: Matthew Glen (via Claude session)
Map: ../MAP.md

## Question

When a spa renames a day pass (or restructures it enough that matching is ambiguous), what should the automation do — and what keeps `id` values stable given that FAQ and blog content reference passes by id, enforced by the `src/data/priced-content.test.ts` build-time validation?

Sub-questions: is `id` immutable once published? How does the automation match a fetched pass to an existing one (by name? by URL? fuzzy)? When matching fails, does the change land in the PR as a flagged review item (consistent with never-auto-delete) or block the PR?

## Comments

**Resolution** (2026-07-25, grilling session with Matthew):

- **Ids are NOT immutable — they track the current name.** On rename, re-slug the id to `<spa-prefix>-<slug-of-new-name>` (existing convention) and rewrite every FAQ/blog reference in the same PR. Safe because ids never surface in user-facing URLs: verified they're only React keys and MDX lookup props. (Blog markdown links do embed ids as `#<id>` anchor fragments — those get rewritten too — but no component renders a matching DOM anchor, so the fragments were already inert; see map note.)
- **Matching cascade**: (1) booking-portal item id (stable path segment of `bookingUrl`, e.g. the try.be hash) → (2) exact normalized name → (3) structural similarity (price/duration/inclusions). Tiers 1–2 auto-apply; tier 3 is **suggestion-only**, surfaced in the PR as "possible rename: X → Y" and never applied automatically.
- **Rename auto-applies only on a tier-1 match with a differing name.** Dead booking URL + changed name falls to tier 3 → suggested-only.
- **Flag, never block.** An existing entry matched by nothing fetched → ⚠️ PR checklist item (last-verified date, source URL, what was fetched instead), data untouched (never-auto-delete). A fetched pass matching no existing entry → ℹ️ informational note only, no data change (discovery stays out of scope). One flaky spa never blocks other spas' updates.
- **Content rewrites on rename**: mechanical references (`dayPassId="..."` props, `#<id>` anchor fragments) auto-rewritten — this is what keeps `priced-content.test.ts` green. Authored prose (link text, sentences using the old name) is **flagged, not rewritten**: grep content for the old package name case-insensitively, list each hit as a ⚠️ checklist item with file:line + surrounding text.
- **Slug collision** (re-slug produces an id already in use at that spa): flag in the PR, never silently invent a disambiguated id.
