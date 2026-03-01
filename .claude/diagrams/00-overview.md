# System Overview

```mermaid
graph TD
    subgraph Data["Data Layer — static TypeScript"]
        spas[spas.ts — spaData array]
        treatments[treatments/spa-N-treatments.ts]
        dayPasses[day-passes/spa-N-day-passes.ts]
        faqs[faqs/index.ts + helpers.ts]
        locationFaqs[location-faqs/index.ts + helpers.ts]
    end

    subgraph Lib["Libraries"]
        spaCatalog[spa-catalog.ts — filter / sort / count]
        locationLib[locationPages.ts — slugs + metadata]
        blogLib[blog.ts — getAllBlogPosts / getRelated]
        prices[prices.ts — price helpers]
        treatCatalog[treatment-catalog.ts]
        dayPassCatalog[day-pass-catalog.ts]
    end

    subgraph Pages["App Router — all statically generated"]
        home[/ — Homepage]
        spasPage[/spas — Listing + filter + sort]
        spaDetail[/spa/:slug — Spa detail]
        spaDays[/spa-days — Day passes]
        spaTreatments[/spa-treatments — Treatments]
        blog[/blog — Blog list]
        blogPost[/blog/:slug — MDX post]
        location[/location/spas-in-:slug — 14 location pages]
        locations[/locations — Location hub]
        couples[/couples-spa-lake-district]
    end

    spas --> spaDetail
    spas --> spasPage
    spas --> home
    spas --> location
    treatments --> spaDetail
    dayPasses --> spaDetail
    dayPasses --> spaDays
    faqs --> spaDetail
    locationFaqs --> location
    spaCatalog --> spasPage
    locationLib --> location
    blogLib --> blog
    blogLib --> blogPost
    treatCatalog --> spaTreatments
    dayPassCatalog --> spaDays
```

---
*Update this diagram when a new page, data source, or library is added. Treat as a living document.*
