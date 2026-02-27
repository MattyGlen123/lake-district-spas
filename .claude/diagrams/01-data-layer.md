# Data Layer — Spa Entity Relationships

```mermaid
erDiagram
    Spa {
        number id PK
        string url "slug — used in /spa/:slug route"
        string name
        string location "matches locationPageSlugs keys"
        AccessLabel[] accessLabels "filter dimension"
        Facilities facilities "9 boolean flags"
        SpaImage[] images
        string[] keyFeatures
        ThermalFacility[] thermalFacilities
        PoolFeature[] poolFeatures
        AccessPolicy[] accessPolicy
        string agePolicy
        number[] relatedSpas "FK array to other spa ids"
        SpaAccessForHotelGuest spaAccessForHotelGuest
        string hotelBookingUrl
        string dayPassBookingUrl
        string treatmentBookingUrl
    }

    Treatment {
        number spaId FK
        string name
        TreatmentCategory category "Massage | Facial | Body | Hands and Feet"
        string duration
        string price
        string brand
        string bookingUrl
    }

    DayPassOption {
        string id PK
        number spaId FK
        string packageName
        number priceGBP
        number pricePerPerson
        number spaDuration
        boolean treatmentsIncluded
        boolean refreshmentsIncluded
        boolean mealIncluded
        string[] included
        string daysAvailable
        string ageRestriction
        string lastVerified
    }

    FAQ {
        number spaId FK
        string question
        string answer
        string answerHtml
    }

    LocationFAQ {
        string location FK
        string question
        string answer
    }

    Spa ||--o{ Treatment : "src/data/treatments/spa-N-treatments.ts"
    Spa ||--o{ DayPassOption : "src/data/day-passes/spa-N-day-passes.ts"
    Spa ||--o{ FAQ : "src/data/faqs/index.ts"
    Spa }o--o{ Spa : "relatedSpas[]"
```

---
*Update this diagram when fields are added to `src/types/spa.ts`, or a new data collection is introduced. Treat as a living document.*
