# Location Pages — Structure and Data Flow

```mermaid
flowchart TD
    locationLib["src/lib/locationPages.ts"]

    subgraph Exports["Exports"]
        slugMap["locationPageSlugs\nRecord name→slug — 13 entries\ne.g. Windermere → windermere"]
        metadata["locationMetadata\nLocationMeta[] — name, slug, image, tagline"]
        getSlug["getLocationPageSlug(name) → slug | null"]
        getPath["getLocationPagePath(name) → /location/spas-in-:slug | null"]
    end

    locationLib --> Exports

    spaData["spaData"] --> |"filter: spa.location === locationName"| localSpas["Spas at this location"]

    localSpas --> LocationPage["src/app/location/spas-in-*/page.tsx\n13 individual static page folders"]
    metadata --> LocationPage
    locationFaqs["src/data/location-faqs/\ngetLocationFAQs(location)"] --> LocationPage

    LocationPage --> |"static build"| rendered["13 URLs:\n/location/spas-in-windermere\n/location/spas-in-ambleside\n... etc"]

    getPath --> |"used in SideMenu + internal links\nreturns null if no page exists yet"| internalLinks["Internal linking\nSideMenu/links.ts, spa cards"]
```

---
*Update this diagram when a new location page is added (new entry in `locationPageSlugs`) or the location FAQ structure changes. Treat as a living document.*
