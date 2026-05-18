# Lake District Spas

A directory of hotel spa facilities across the Lake District, helping users find and compare spas before booking.

## Language

**Spa**:
A hotel spa facility — a thermal and treatment suite within a Lake District hotel. Always hotel-based; standalone day spas are not listed.
_Avoid_: Wellness centre, health club, leisure centre

**Day Pass**:
A purchased ticket granting non-hotel-guests access to a Spa's facilities for a fixed duration. Distinct from hotel guest access, which is either complimentary or charged to the room.
_Avoid_: Spa day (too generic), day experience, day visit

**Access Label**:
A tag on a Spa describing how it can be accessed — e.g. `free-for-all-guests`, `paid-for-guests`, `day-passes-available`. A Spa can have multiple Access Labels simultaneously.
_Avoid_: Access type, access tier, access mode

**Thermal Suite**:
The heat-based facilities within a Spa — sauna, steam room, ice room, infrared sauna. Distinct from pool and water features.
_Avoid_: Thermal facilities, heat experiences, thermal area

**Pool Features**:
The water-based facilities within a Spa — indoor pool, outdoor pool, hot tub, cold plunge. Distinct from the Thermal Suite.
_Avoid_: Aqua facilities, water features, pool suite

**Treatment**:
A bookable therapy service (massage, facial, body wrap, etc.) offered by a Spa. May be purchased standalone or bundled into a Day Pass.
_Avoid_: Service, therapy, spa service

## Design

**Luxury editorial aesthetic**:
The site's visual identity — elegant, unhurried, magazine-inspired. Generous spacing, serif headings, stone and amber tones. Deliberately static UI (see ADR-0002). Full design token reference in `docs/STYLE_GUIDE.md`.
_Avoid_: Minimal, clean (too generic), premium (too marketing)

## Relationships

- A **Spa** has zero or more **Treatments** and zero or more **Day Passes**
- A **Spa** has one or more **Access Labels** that together describe who can access it and how
- A **Spa** has a **Thermal Suite** (heat experiences) and **Pool Features** (water experiences) — both are optional
- A **Day Pass** may bundle **Treatments** (`treatmentsIncluded: true`) or sell facility-only access
- A **Treatment** belongs to exactly one **Spa** and may be booked standalone or as part of a **Day Pass**

## Example dialogue

> **Dev:** "Can a user filter by 'has treatments'?"
> **Domain expert:** "No — **Treatments** are listed on the **Spa** detail page. The filter is for **Access Labels** and facilities like **Thermal Suite** or **Pool Features**."

> **Dev:** "If a Day Pass includes treatments, do we show the Treatment list for it?"
> **Domain expert:** "No — the **Day Pass** just flags `treatmentsIncluded`. The specific **Treatments** available are on the **Spa** page, not the **Day Pass**."
