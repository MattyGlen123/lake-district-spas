# Implementation Plan: next-article.md

## Feature Overview

Add 3 new blog article planning entries to `content/blog-topics.json` — one per target keyword — using the extended format (with `secondaryKeywords` and `searchVolume`). Also remove the duplicate `how-to-treat-pregnant-wife` entry already in the file. No application logic is involved; all changes are to a single static JSON planning file.

---

## TDD Scope Assessment

| Task | Classification | Reason |
|------|---------------|---------|
| Fix duplicate entry in `blog-topics.json` | **Non-TDD** | Pure data correction — no logic, state, or behaviour |
| Add hydrotherapy pool benefits snippet | **Non-TDD** | Static JSON content — no logic |
| Add hot stone vs swedish massage snippet | **Non-TDD** | Static JSON content — no logic |
| Add what is a rasul treatment snippet | **Non-TDD** | Static JSON content — no logic |
| Update `metadata.lastUpdated` | **Non-TDD** | Static field update |

No TDD cycles are warranted. All work is content/data authoring in a static planning file.

---

## Red-Green Test Cycles

_None — all work is Non-TDD._

---

## Refactor Notes

_Not applicable — no logic to refactor._

---

## Non-TDD Work

All changes are in `content/blog-topics.json`.

### Task 1 — Fix duplicate entry

Remove the second occurrence of `how-to-treat-pregnant-wife` (the entry at array index 16, lines ~216–233). The first occurrence (index 15) is the canonical entry and should be kept unchanged.

---

### Task 2 — Add entry: hydrotherapy pool benefits (priority 17)

Insert after the existing entries (before the closing `]` of the `topics` array):

```json
{
  "id": "hydrotherapy-pool-benefits",
  "title": "Hydrotherapy Pool Benefits: What to Expect at a Lake District Spa",
  "slug": "hydrotherapy-pool-benefits",
  "targetKeyword": "hydrotherapy pool benefits",
  "secondaryKeywords": [
    "hydrotherapy pool",
    "benefits of hydrotherapy pool",
    "what does a hydrotherapy pool do",
    "hydrotherapy spa pool"
  ],
  "category": "facilities",
  "priority": 17,
  "status": "planned",
  "searchVolume": "100-1k/mo (Low competition)",
  "relatedSpas": [
    "daffodil-hotel-spa",
    "rothay-garden-by-harbour-hotels"
  ],
  "notes": "Educational facility explainer targeting first-timers researching thermal spa facilities."
}
```

**Spa selection rationale:**
- **Daffodil Hotel Spa** — 33ft dedicated Hydrotherapy Pool with cascade features and multiple hydromassage levels; the most distinctive standalone hydrotherapy pool in the dataset.
- **Rothay Garden by Harbour Hotels** — Hydrotherapy Pool with massage jets; a smaller, more accessible option that provides contrast.

---

### Task 3 — Add entry: hot stone massage vs swedish massage (priority 18)

```json
{
  "id": "hot-stone-massage-vs-swedish-massage",
  "title": "Hot Stone Massage vs Swedish Massage: Which Is Right for You?",
  "slug": "hot-stone-massage-vs-swedish-massage",
  "targetKeyword": "hot stone massage vs swedish massage",
  "secondaryKeywords": [
    "hot stone massage vs swedish",
    "difference between hot stone and swedish massage",
    "swedish vs hot stone massage",
    "hot stone or swedish massage"
  ],
  "category": "comparisons",
  "priority": 18,
  "status": "planned",
  "searchVolume": "100-1k/mo (Low competition)",
  "relatedSpas": [
    "lakeside-hotel-spa",
    "whitewater-hotel-leisure-club"
  ],
  "notes": "Comparison article targeting treatment decision intent; both featured spas offer both treatment types, enabling direct like-for-like comparison."
}
```

**Spa selection rationale:**
- **Lakeside Hotel & Spa** — offers both Hot Stone Full Body Massage and Swedish Massage, allowing the article to show both options at one venue.
- **Whitewater Hotel & Leisure Club** — also offers both (Cascades Hot Stone Full Body Massage + Full Body Swedish Massage); noted as having one of the strongest treatment menus in the dataset.

---

### Task 4 — Add entry: what is a rasul treatment (priority 19)

```json
{
  "id": "what-is-a-rasul-treatment",
  "title": "What Is a Rasul Treatment? Your Lake District Guide",
  "slug": "what-is-a-rasul-treatment",
  "targetKeyword": "what is a rasul treatment",
  "secondaryKeywords": [
    "rasul treatment",
    "rasul mud treatment",
    "rasul spa treatment",
    "what is rasul"
  ],
  "category": "facilities",
  "priority": 19,
  "status": "planned",
  "searchVolume": "100-1k/mo (Low competition)",
  "relatedSpas": [
    "daffodil-hotel-spa",
    "lodore-falls-spa"
  ],
  "notes": "Awareness-stage explainer for a lesser-known treatment; natural entry point for visitors unfamiliar with rasul chambers."
}
```

**Spa selection rationale:**
- **Daffodil Hotel Spa** — dedicated Rasul Mud Chamber as a thermal facility (mineral-rich mud application in a tiled room); the most straightforward example of the treatment format.
- **Lodore Falls Hotel Spa** — offers "Journey of the Senses: Rasul Ritual" as a bookable group treatment (£60, 60 min, 2–4 people), giving the article a bookable angle and price point.

---

### Task 5 — Update metadata

Update `metadata.lastUpdated` from `"2025-01-14"` to `"2026-03-05"`.
