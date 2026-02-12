---
name: blog-writer
description: Generate high-quality blog posts for lakedistrictspa.co.uk that read naturally and avoid AI-detection patterns. Use when the user requests blog content creation for the Lake District spa directory, provides blog topic JSON, or asks to write articles about Lake District spas with specific SEO and style requirements.
---

# Lake District Spas - Blog Content Generation

Generate natural-sounding blog posts for lakedistrictspa.co.uk that prioritize clarity, usefulness, and local expertise.

## Quick Start

When the user provides a blog topic (usually as JSON), generate:
1. Complete MDX file with frontmatter
2. Pre-publish checklist

## Core Writing Approach

**Write as a humanized assistant focused on action and usefulness.**

Key principles:
- Friendly local expert voice (like a helpful neighbor who's visited all the spas)
- Direct and confident (not hedging)
- Stay neutral and factual (avoid hype)
- **Business-friendly tone** - inform users without criticizing spas (frame as user guidance, not spa shortcomings)
- Practical focus (concrete actions, steps, outcomes)
- Address reader directly with "you" and "your"

## Workflow

### 1. Review the Topic
User provides blog topic information including:
- Title and slug
- Target keyword
- Category
- Related spas
- Any specific notes

### 2. Check References
Before writing, review relevant reference files:

**Always read:**
- `references/writing-rules.md` - Complete style guide, banned phrases, voice guidelines

**Read when needed:**
- `references/spa-data.md` - When mentioning spa access, pricing, or need spa slugs for links
- `references/categories.md` - To understand the specific category's tone and approach

### 3. DATA VALIDATION - CRITICAL

**NEVER fabricate spa details. Your competitive advantage is accuracy and transparency.**

**MANDATORY DATA REVIEW PROCESS:**

Before writing ANY content about spas, you MUST:

1. **Read the actual data files** using the `view` tool:
   - View `/home/claude/src/data/spas.ts` to see ALL spa data
   - View treatment files: `/home/claude/src/data/treatments/spa-[id]-treatments.ts`
   - View day pass files: `/home/claude/src/data/day-passes/spa-[id]-day-passes.ts`

2. **Extract verified facts** from these files for each spa mentioned
   - Note exact facility names, counts, and features
   - Record pricing from treatments/day passes data
   - Copy access policy details verbatim

3. **Cross-check every claim** before including it
   - Can you find this facility in the data? → Include it
   - Is this pricing in the data? → Use it
   - Is this detail not in the data? → Either research it or omit it

**PRIMARY DATA SOURCES (100% Verified):**

1. **Spa Facilities** (`/home/claude/src/data/spas.ts`)
   - Thermal facilities (exact names: "Finnish Sauna", "Salt Steam Room")
   - Pool features (exact descriptions: "20-metre indoor pool with floor-to-ceiling glass")
   - Access policies ("18+ only", "Free for all guests")
   - Age restrictions, booking requirements
   - Key features, thermalFacilities array, poolFeatures array

2. **Treatments** (`/home/claude/src/data/treatments/spa-[id]-treatments.ts`)
   - Exact treatment names, brands, categories
   - Verified durations and prices
   - Actual descriptions (don't embellish)

3. **Day Passes** (`/home/claude/src/data/day-passes/spa-[id]-day-passes.ts`)
   - Exact package names and prices
   - Verified inclusions (what's actually included)
   - Booking requirements, age restrictions

**ABSOLUTE RULES:**

✅ **DO:**
- View the actual data files before writing
- Quote facility names exactly as they appear in data
- Use verified prices from treatments/day passes
- State access policies as written in the data
- If data says "outdoor hot tub" → write "outdoor hot tub" (singular)
- Track which facts came from which data source

❌ **DON'T:**
- Invent facility counts ("four hot tubs" when data shows "outdoor hot tub")
- Fabricate specific hours ("7pm-10pm") unless in data
- Make up pricing ("£220-280") unless in data
- Assume facilities ("rooftop" hot tubs when data says "outdoor")
- Add descriptive details not in data ("panoramic views for 2 miles")
- Use your general knowledge about spas to fill gaps

**WHEN YOU NEED ADDITIONAL INFORMATION:**

If article topic requires details not in verified data:

1. **Use web_search** for official spa website information
2. **Document your sources** - create a "Data Sources" section in your working notes
3. **Include attribution** in pre-publish checklist:
   ```
   Data Sources Used:
   - Verified repository data: [list spas and what data was used]
   - Web research: [URLs and what information was found]
   ```

**Example of proper data usage:**

From actual data in spas.ts for Another Place (spa id: 14):
```typescript
poolFeatures: [
  { name: 'Outdoor Hot Tub', details: 'Swedish-design heated outdoor hot tub overlooking grounds, 20 minute session limit when busy, 16+ only' }
]
```

✅ CORRECT (from verified data):
"Another Place features a Swedish-design heated outdoor hot tub overlooking the grounds, with 16+ age restrictions and 20-minute session limits when busy."

❌ INCORRECT (fabricated):
"Four separate rooftop hot tubs overlook Ullswater. Adults-only hours run 7pm-10pm."

**VERIFICATION MANDATE:**

Every spa-specific claim in your article must be traceable to either:
1. Verified repository data (preferred)
2. Web search results with URL citation (when necessary)

If you cannot verify a detail, DO NOT include it. Better to be accurate with less detail than comprehensive but wrong.

### 4. Write the Content

**Target length:** 800-900 words (substantive content only, no filler)

**Structure:**
1. Opening hook (2-3 sentences) - Address pain point directly, no preamble
2. Main content (600-700 words) - Specific facts, mechanisms, data, local context
3. Specific recommendations (150-200 words) - Name actual spas with reasons
4. Closing (1-2 sentences) - Brief, no "in conclusion"

**Content Density Requirements:**
Every sentence must contain at least ONE of:
- Specific data (temperatures, times, distances, percentages)
- Expert knowledge (mechanisms, benefits, physiological effects)
- Actionable information (what to do, when, why)
- Local Lake District context (weather, geography, culture)

**Lists and formatting:**
Use bullet points and numbered lists when organizing data, options, or step-by-step information. This improves clarity and scannability. Avoid lists for narrative content or when prose flows better.

### 5. Avoid Filler Content

**The Replacement Test:**
Ask for every paragraph: "Could this appear in any spa article about any location?"
- If YES → Delete it (generic filler)
- If NO → Keep it (substantive content)

**Common Filler Patterns to AVOID:**

*Generic advice:*
- ❌ "Ask about X when booking if Y concerns you"
- ❌ "Contact the spa for more details"
- ❌ "Book in advance for best availability"

*Circular/tautological statements:*
- ❌ "Indoor pools work equally well at any time. The experience stays consistent"
- ❌ "If you get cold easily, indoor pools suit you better"

*Shallow personal preferences:*
- ❌ "Choose indoor if you prefer consistency"
- ❌ "People who run warm prefer outdoor facilities"

**Write Substantive Content Instead:**

Replace personal preferences with mechanisms:
- ❌ "If you get cold easily, choose indoor"
- ✅ "Outdoor hot tubs trigger contrast therapy - alternating between 38°C water and 5°C air boosts circulation and releases endorphins"

Replace obvious observations with specific data:
- ❌ "Outdoor facilities depend on weather"
- ✅ "Wind speeds above 15mph make outdoor hot tubs uncomfortable - Windermere averages 12mph in winter"

Replace generic advice with specific examples:
- ❌ "Ask about screening when booking"
- ✅ "Armathwaite Hall screens its outdoor hot tub with mature hedging - you get Skiddaw views but privacy from hotel windows"

**If word count falls short:**
- ADD more facts, data, or mechanisms (not filler)
- If no more facts exist, the section is complete

### 6. Add Internal Links
Link to spas using format: `[Spa Display Name](/spa/spa-slug)`

Get correct slugs from `references/spa-data.md`

### 7. Create MDX Frontmatter

```yaml
---
title: 'Article Title Here'
slug: article-slug-here
excerpt: 'Compelling 1-2 sentence summary with target keyword'
publishedAt: '2025-01-XX'
author: 'Lake District Spas'
category: guides # guides, comparisons, seasonal, facilities, locations
tags:
  - tag-1
  - tag-2
  - tag-3
seoTitle: 'SEO-optimized title if different'
seoDescription: 'Meta description with target keyword'
relatedSpas:
  - spa-slug-1
  - spa-slug-2
---
```

### 8. Quality Check

Before final output, verify:

**Content Quality:**
- [ ] Each sentence adds information or direction
- [ ] Every sentence contains specific data, expert knowledge, actionable info, OR local context
- [ ] No filler patterns (generic advice, circular logic, obvious statements)
- [ ] Passes replacement test: "Could this appear anywhere?" = NO
- [ ] Reader knows what to do next
- [ ] Sounds natural when read aloud
- [ ] No banned phrases or constructions (check writing-rules.md)

**Data Verification (CRITICAL):**
- [ ] Viewed actual data files for all spas mentioned
- [ ] Every facility claim verified against spa data (thermalFacilities, poolFeatures)
- [ ] All pricing verified from treatments or day passes data
- [ ] Access policies quoted from verified data
- [ ] Age restrictions confirmed from data
- [ ] No fabricated facility counts, hours, or measurements
- [ ] Data Sources section included in checklist (see below)

**Formatting & Links:**
- [ ] Opening hooks immediately, no preamble
- [ ] Concrete details, prices, names included
- [ ] All spa links use correct `/spa/slug` format from spa-data.md
- [ ] Sounds like local expert, not corporation
- [ ] Word count: 800-900
- [ ] Clear H2 sections, logical flow, tight paragraphs
- [ ] Brief closing, no "in conclusion"
- [ ] **No negative framing of individual spas** - information presented as user guidance, not criticism

## Output Format

Provide:

1. **Complete MDX File** - Ready to paste into `content/blog/[slug].mdx`
2. **Pre-publish Checklist** - Confirmation of quality standards met, MUST include:
   - Quality checklist items (all checked)
   - **Data Sources Used** section documenting:
     * Which spas mentioned and what repository data was referenced
     * Any web search conducted (URLs and information found)
     * Confirmation that NO details were fabricated

**Example Data Sources Section:**
```
Data Sources Used:
✓ Lodore Falls Hotel Spa (spa id: 1)
  - Facilities from /src/data/spas.ts (thermalFacilities, poolFeatures)
  - Treatments from /src/data/treatments/spa-1-treatments.ts
  - Day passes from /src/data/day-passes/spa-1-day-passes.ts

✓ Low Wood Bay Spa (spa id: 7)
  - Facilities from /src/data/spas.ts
  - No treatments mentioned (not needed for article topic)
  
✓ Web Research: None conducted (all data from verified repository)
✓ Fabrication Check: No facility details, prices, or policies fabricated
```

## Additional Resources

- `references/writing-rules.md` - Complete style guide (ALWAYS READ)
- `references/spa-data.md` - Spa slugs, access tiers, pricing models
- `references/categories.md` - Category-specific guidelines
