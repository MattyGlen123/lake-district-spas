# Static TypeScript data — no CMS or database

All spa, treatment, and day pass data lives as `.ts` files in `src/data/`. There is no headless CMS, no API, and no database. This was a deliberate choice to keep infrastructure as simple as possible for as long as possible — zero deployment dependencies, instant static builds, and all data changes go through the normal code review workflow. The trade-off is that non-technical editors cannot update content without a code deploy.

## Considered alternatives

- Headless CMS (Contentful, Sanity): rejected — unnecessary complexity at this scale
- Database + API: rejected — same reason; all content is editorial and changes infrequently
