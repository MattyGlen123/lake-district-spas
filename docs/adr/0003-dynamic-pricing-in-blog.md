# Dynamic pricing components in blog posts — no hardcoded prices

Blog posts must never hardcode prices (e.g. `£75`). All prices are rendered via MDX components — `<SpaAccessPrice>`, `<DayPassPrice>`, `<DayPassLink>`, `<TreatmentLink>` — which pull from the live spa data at build time. Two reasons: prices change and a stale price in an article is worse than no price; and dynamic prices improve SEO by keeping content accurate. This rule is enforced by tests.
