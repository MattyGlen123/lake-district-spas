---
name: spa-faq-research
description: Research-driven FAQ creation workflow for Lake District spa directory pages. Use when creating SEO-optimized FAQ sections with Schema markup for individual spa detail pages. Takes spa data as input, guides keyword research, analyzes Google Reviews and TripAdvisor, and outputs 4-5 targeted FAQs with complete implementation prompts. Designed for Next.js/React spa directory with dynamic helper functions and internal linking strategy.
---

# Spa FAQ Research & Creation Skill

## Overview

This skill implements a systematic research workflow to create highly targeted, SEO-optimized FAQ sections for spa detail pages on lakedistrictspas.co.uk. Each spa gets 4-5 unique FAQs based on keyword research and review analysis, designed to capture search traffic and answer real guest questions.

## Workflow

The process has 6 steps (Steps 2 and 5 are always skipped):

1. **Receive Spa Data** - User provides spa JSON data
2. **SKIPPED** - Google People Also Ask (not useful for branded searches)
3. **Keyword Research** - Generate keyword list, user provides CSV results
4. **Reviews Research** - Analyze Google Reviews and TripAdvisor
5. **SKIPPED** - Brainstorming (not needed per user preference)
6. **Compile & Select** - Choose final 4-5 FAQs and create Cursor implementation prompt

## Step 1: Receive Spa Data

User provides full spa data including:
- Basic info (name, location, ID)
- Spa access details (included with room, time limits, pricing)
- Day pass options and pricing
- Treatment data (brands, categories, pricing if available)
- Facilities (thermal pool, sauna, steam, outdoor features)
- Unique features (watersports, family times, branded facilities)

**Action:** Review the data to understand the spa's unique positioning before keyword research.

## Step 2: SKIPPED - Google People Also Ask

Google People Also Ask is not useful for branded hotel/spa searches. Always skip this step.

## Step 3: Keyword Research

### Generate Keyword List

Based on spa data, create a list of 12-20 keywords for the user to research in Google Keyword Planner. Focus on:

**Branded Terms (ALWAYS include):**
- Main spa name variations
- Hotel name + spa
- Location + spa name

**Feature Specific Terms (if applicable):**
- Branded facility names (e.g., "Swim Club", "Spa Village")
- Unique features (e.g., "watersports", "outdoor hot tub", "family spa")
- Treatment brands if well known

**Intent Terms (ALWAYS include):**
- Spa name + "prices"
- Spa name + "reviews"
- Spa name + "day pass"
- Spa name + "gift voucher"
- Spa name + "afternoon tea" (if spa offers it)
- Spa name + "booking"

**Location Terms:**
- Village/town name + spa (e.g., "Watermillock spa", "Keswick spa")
- Lake name + spa (e.g., "Ullswater spa")

**Avoid:**
- Generic Lake District terms (covered by location landing pages)
- Non-spa related hotel features
- Very long tail terms (<10 searches/month)

### Analyze Keyword Results

User will provide 1-2 CSV files from Google Keyword Planner. Create a keyword analysis document (saved as `{Spa_Name}_Keyword_Research_Analysis.md`) covering:

**Required Analysis:**
1. **Volume Summary** - How does this spa compare to previous spas?
2. **High Volume Terms** - What gets 500+ searches/month?
3. **Intent Signals** - Reviews, prices, booking, vouchers, deals
4. **Feature Specific** - Unique facilities, brands, activities
5. **Missing Keywords** - What spa features have NO search volume? (Critical gap analysis)
6. **FAQ Topic Signals** - What questions do keywords suggest?
7. **Unique Positioning** - What makes this spa different?

**Key Patterns to Identify:**
- **Voucher growth** (500-1000% YoY growth is common)
- **Watersports integration** (5,000/mo for Low Wood Bay)
- **Branded facilities** (50/mo for "Swim Club" at Another Place)
- **Price transparency demand** (500/mo consistent across all spas)
- **Review research** (500/mo = people researching before booking)
- **Awareness gaps** (spa features with zero keyword volume)

## Step 4: Reviews Research

### Google Reviews

Navigate to Google Maps for the spa and analyze reviews. Focus on:

**Primary Research Questions:**
1. **Booking & Access** - Do guests mention needing to book in advance? Walk-in availability? Sold out experiences?
2. **Spa Access Clarity** - Confusion about whether spa is included with room? Extra charges? Time limits?
3. **Age Policies** - Questions about children, teenagers, family times, adults-only periods?
4. **Facilities** - Surprise about what's included or not included? Equipment needed (towels, robes, flip flops)?
5. **Time Slot System** - Confusion about family vs adult times? Peak crowding?
6. **Pricing Transparency** - Unexpected charges? Hidden fees? Value questions?
7. **Treatment Booking** - Difficulty booking treatments? Advance notice needed?
8. **Unique Features** - Comments about watersports, outdoor facilities, branded elements?

**What to Capture:**
- Star rating and review count
- Awards or recognition badges
- AI summary themes (if available)
- Specific recurring complaints or questions
- "Wish I'd known" type comments
- Positive surprises that could be FAQs

**How to Research:**
- Use browser automation (Claude in Chrome) to navigate and screenshot
- Use WebSearch if direct access blocked
- Combine screenshot analysis with read_page tool
- Capture enough context for FAQ decisions

### TripAdvisor Research

Navigate to TripAdvisor page for the spa/hotel and analyze:

**Key Metrics:**
- Overall rating (out of 5)
- Total review count
- Awards or badges (e.g., Traveller's Choice 2026)
- AI generated summary themes

**Review Themes:**
- Same categories as Google Reviews above
- Look for practical tips mentioned in reviews (e.g., "bring beach shoes", "need payment card for pool purchases")
- Identify gaps between expectations and reality

**Output:** Create reviews research document (`{Spa_Name}_Reviews_Research.md`) with key findings organized by theme.

## Step 5: SKIPPED - Brainstorming

Per user preference, skip the brainstorming step. Move directly to Step 6.

## Step 6: Compile & Select FAQs

### Select 4-5 Final FAQs

Based on keyword research + reviews research, select FAQs that:

1. **Match search intent** - Prioritize topics with keyword volume (500+/mo ideal, 50+/mo acceptable)
2. **Answer real questions** - Directly address themes from reviews
3. **Leverage unique positioning** - Highlight what makes this spa different
4. **Fill awareness gaps** - Educate about features people don't know exist
5. **Reduce friction** - Answer pre-booking questions that might prevent bookings

**Variety Balance:**
- At least 1 pricing/value FAQ (always high volume)
- At least 1 access/booking FAQ (practical)
- At least 1 unique feature FAQ (differentiation)
- Consider age policies if family-friendly or adults-only
- Consider time slots if relevant to the spa

**Selection Document:**

Create `{Spa_Name}_FAQ_Research_Complete.md` with:
- Brief summary of keyword research findings
- Brief summary of reviews research findings
- List of 4-5 recommended FAQs with justification:
  - Question text
  - Why this question (keyword volume + review themes)
  - Key points to cover in answer
  - Internal links needed

### Create Cursor Implementation Prompt

Create `Cursor_Prompt_{Spa_Name}_FAQs.md` with complete implementation instructions for Cursor AI to add FAQs to the spa detail page.

**IMPORTANT:** Before writing the Cursor prompt, read the [implementation examples reference](references/implementation-examples.md) to see real code from Lodore Falls (Spa ID 1) and Low Wood Bay (Spa ID 7). This shows the exact patterns, helper functions, and code structure to follow.

**Critical Requirements:**

**NO HYPHENS in prose** - User feedback: "You've used way too many dashes in the text. Don't use them going forward."
- ✅ "2 hour time slots" NOT "2-hour time slots"
- ✅ "adults only" NOT "adults-only"
- ✅ "£100 per person" NOT "£100-per-person"

**Two Answer Versions Required:**
1. **JSX Answer** - With `<Link>` components for internal links
2. **Schema Text** - Plain text version (no HTML/JSX) for JSON-LD markup

**Answer Structure (150-250 words each):**
- **Direct answer first** (40-60 words) - Clear yes/no or specific info
- **Supporting detail** (100-150 words) - Context, options, practical tips
- **Call to action** (optional) - Booking link or related section link

**Internal Linking:**
- Link to relevant sections: `#thermal`, `#treatments`, `#access`, `#book`
- Use existing JumpToLinks navigation (NOT intro section)
- 2-3 links max per answer

**Dynamic Values:**
Use helper functions instead of hardcoding:
- `{spa.name}` - Spa name
- `{durationText}` from `getSpaAccessDuration()`
- `{priceRange}` from `getSpaAccessPriceRange()`
- `{thermalCount}` from `getThermalFacilitiesCount()`
- `{ageRestriction}` from spa data

**Schema Markup Template:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Full question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Plain text answer here (no HTML, no JSX, no markdown). Use \\n for line breaks if needed."
      }
    }
  ]
}
```

**File Structure Notes:**
- FAQ files are `.tsx` files (contain JSX)
- Stored in `/app/spas/[slug]/faqs/` directory
- Named descriptively (e.g., `booking-in-advance.tsx`, `spa-access-included.tsx`)

**Cursor Prompt Must Include:**

1. **Context section** - Brief summary of spa positioning and research findings
2. **Complete TypeScript function** - Full `getSpa{ID}FAQs()` function with:
   - All imports (FAQ, Link, Spa, helpers)
   - All dynamic value extractions at top of function
   - All 4-5 FAQ objects with question, answer (JSX), and schemaText
3. **Registration instructions** - How to add function to index.ts
4. **Implementation notes** - Any spa-specific considerations

**See [implementation examples](references/implementation-examples.md) for:**
- Complete real examples from Spa 1 and Spa 7
- All helper function usage patterns
- JSX formatting rules (NO HYPHENS, &apos;, <br />, spacing)
- Internal link patterns and section IDs
- Dynamic value extraction patterns
- Conditional rendering patterns
- Schema text formatting
- Quality checklist

## Writing Quality Standards

### Tone & Style
- **Helpful and informative** - Not salesy or promotional
- **Specific and practical** - Give real details (times, prices, policies)
- **Clear and scannable** - Short paragraphs, easy to skim
- **Natural language** - Avoid SEO-stuffing, write for humans
- **NO HYPHENS in prose** - Critical requirement from user feedback

### Answer Quality
- **Direct answers** - Don't bury the answer in context
- **Accurate data** - Use spa data and helper functions
- **Practical tips** - Include "good to know" details from reviews
- **Updated info** - Reference current policies, don't speculate on future
- **Call out uniqueness** - Highlight differentiators vs other spas

### SEO Optimization
- **Question in H3** - Exact match to search intent
- **Answer starts immediately** - No preamble
- **Related keywords naturally** - Don't force keyword stuffing
- **Internal links** - Support site structure and user journey
- **Schema markup** - Enable rich snippets in search results

## Common FAQ Topics by Spa Type

### Adults Only Spas (e.g., Lodore Falls)
- Do I need to book treatments in advance?
- Is spa access included with my room?
- How long can I use the spa facilities?
- What time slots are available?
- Can children use the spa?

### Activity Spas (e.g., Low Wood Bay)
- Can I combine watersports with spa?
- How much does a spa day cost?
- What's included in a spa day?
- Do I need to book in advance?
- Can teenagers use the spa?

### Family Friendly Spas (e.g., Another Place)
- What is the [branded facility name]?
- Is spa access included with my room?
- Can children use the spa?
- What are the opening times?
- Can I visit just for the spa?

### Luxury Treatment Spas
- What treatments do you offer?
- How much do treatments cost?
- Can I book treatments as a day visitor?
- Do you offer couples treatments?
- What treatment brands do you use?

## Efficiency Tips

### Parallel Research
When possible, run multiple research steps in parallel:
- Navigate to TripAdvisor AND Google Reviews simultaneously
- Take screenshots while reading page content

### Document Naming Convention
- Keyword analysis: `{Spa_Name}_Keyword_Research_Analysis.md`
- Reviews research: `{Spa_Name}_Reviews_Research.md`
- Final selection: `{Spa_Name}_FAQ_Research_Complete.md`
- Cursor prompt: `Cursor_Prompt_{Spa_Name}_FAQs.md`

### Time Estimates
- Step 1 (Receive data): 0 hours (user provides)
- Step 3a (Generate keywords): 0.5 hours
- Step 3b (Analyze keywords): 1 hour
- Step 4 (Reviews research): 2 hours
- Step 6a (Select FAQs): 1 hour
- Step 6b (Create Cursor prompt): 2 hours
- **Total: ~6.5 hours per spa**

## Success Criteria

A complete FAQ implementation should:
- ✅ Have 4-5 unique questions tailored to this specific spa
- ✅ Address at least one high-volume keyword (500+/mo)
- ✅ Answer at least one recurring review theme
- ✅ Highlight at least one unique feature of this spa
- ✅ Include complete Schema markup (FAQPage JSON-LD)
- ✅ Use NO HYPHENS in prose
- ✅ Have both JSX and plain text versions of answers
- ✅ Include 2-3 internal links per answer
- ✅ Use helper functions for dynamic values
- ✅ Provide clear implementation instructions for Cursor

## Technical Context

### Next.js/React Implementation
- FAQ components are `.tsx` files (TypeScript + JSX)
- Use `<Link>` from Next.js for internal navigation
- Helper functions extract values from spa data object
- Schema markup goes in JSON-LD script tag

### Helper Functions Available
```typescript
getSpaAccessDuration(spa) // Returns "2 hours", "3 hours", "unlimited", etc.
getSpaAccessPriceRange(spa) // Returns "£50-£120", "Included", etc.
getThermalFacilitiesCount(spa) // Returns number of thermal facilities
// ... other helpers based on spa data structure
```

### Internal Link Targets
- `#thermal` - Thermal facilities section
- `#treatments` - Treatments section
- `#access` - Access information section
- `#book` - Booking section
- `#facilities` - General facilities

## Common Pitfalls to Avoid

❌ **Using hyphens in prose** - User explicitly requested NO hyphens
❌ **Generic answers** - Each spa should have unique FAQs based on research
❌ **Skipping keyword research** - Don't guess what people search for
❌ **Ignoring review themes** - Reviews show real guest questions
❌ **Hardcoding spa names** - Use `{spa.name}` instead
❌ **Over-linking** - Max 2-3 links per answer
❌ **Keyword stuffing** - Write naturally for humans
❌ **Missing Schema text version** - Both JSX and plain text required
❌ **Incomplete Cursor prompt** - Should be copy-paste ready for implementation

## Example Research Findings

### High Volume Patterns
- **Prices**: 500/mo across all spas (always create pricing FAQ)
- **Reviews**: 500/mo across branded spas (people research before booking)
- **Vouchers**: 500-1000% YoY growth (emerging trend)
- **Watersports**: 5,000/mo at Low Wood Bay (unique feature = high volume)

### Low Volume Opportunities
- **Branded facilities**: 50/mo (e.g., "Swim Club" - awareness building)
- **Age policies**: Often NO keyword data but critical from reviews
- **Time slots**: Often NO keyword data but causes confusion per reviews
- **Day passes**: 50-100/mo (practical question, good conversion FAQ)

### Review Theme Patterns
- **Booking in advance** - Mentioned in 80% of spa reviews
- **Spa access confusion** - Included vs extra charge (top pain point)
- **Time limits** - 2-3 hour limits often surprise guests
- **Crowding** - Peak times, advance booking needed
- **Age restrictions** - Children policies vary widely, causes confusion
