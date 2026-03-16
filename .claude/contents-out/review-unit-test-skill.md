# Implementation Plan — Update unit-test SKILL.md

**Source doc:** `.claude/contents-in/review-unit-test-skill.md`
**Target file:** `.claude/skills/unit-test/SKILL.md`
**Approach:** Targeted additions only — insert new content into existing sections without restructuring. Overall length increases modestly.

---

## Summary of decisions (from answers)

| Q | Decision |
|---|----------|
| Q1 | No Given/When/Then section — four-bucket structure is sufficient |
| Q2 | Add a dedicated "Test Data Factories" section with code examples; factory files live in `tests/` |
| Q3 | Leave single-assertion rule as-is — "one behaviour per test" in Phase 2 covers it |
| Q4 | Leave test isolation as-is — `vi.clearAllMocks()` in `beforeEach` is sufficient |
| Q5 | Add 1–2 sentences to "What Makes a Good Unit Test" on behaviour vs implementation |
| Q6 | Add one bullet to "What Makes a Good Unit Test" on test naming |
| Q7 | Targeted additions only — no restructuring |
| Q8 | Keep Vitest examples; frame principles generically |

---

## Changes — in order of appearance in the file

### Change 1 — New section: "Test Data Factories" (after the Mocking Rules section, before "What Makes a Good Unit Test")

**Why:** Q2-A. The transcript dedicates significant time to this pattern. Nothing in the current skill addresses it. This is the only new top-level section added. Opening paragraph leads with the *principle* (complex setup is a smell) before the mechanics.

**Location:** Insert between `### Fake timers` block and `## What Makes a Good Unit Test`.

**Content to add:**

````markdown
---

## Test Data Factories

Test setup must be as simple as possible. When setup is complicated, developers avoid adding tests and resist modifying existing ones — the very thing unit tests are supposed to enable. The two tools for keeping setup simple are **factories** (for shared object construction) and **random helpers** (for values whose specific content doesn't matter).

If your test setup requires creating the same data shape more than once, extract it into a factory function. Duplicated setup code makes tests fragile — a field rename means touching every test instead of one helper.

**Where to put factory files:** `tests/factories/` — shared across all test files that need them.

```
tests/
  factories/
    makeSpa.ts        ← factory for Spa objects
    makeDayPass.ts    ← factory for DayPassOption objects
    random.ts         ← random data helpers
```

### Factory pattern

```typescript
// tests/factories/makeSpa.ts
import type { Spa } from '@/types/spa'

let _id = 1

export function makeSpa(overrides: Partial<Spa> = {}): Spa {
  return {
    id: _id++,
    name: 'Test Spa',
    location: 'Windermere',
    url: 'test-spa',
    facilities: {
      indoorPool: false,
      outdoorPool: false,
      spa: true,
      gym: false,
      restaurant: false,
      accommodation: false,
      iceRoom: false,
      coldPlunge: false,
      steamRoom: false,
    },
    images: [],
    keyFeatures: [],
    thermalFacilities: [],
    poolFeatures: [],
    accessPolicy: [],
    accessLabels: [],
    agePolicy: 'Adults only (18+)',
    relatedSpas: [],
    spaAccessForHotelGuest: 'included',
    hotelBookingUrl: '',
    dayPassBookingUrl: '',
    treatmentBookingUrl: '',
    ...overrides,
  }
}
```

Use `overrides` to set only the fields your test cares about:

```typescript
it('shows outdoor pool badge when facility is present', () => {
  const spa = makeSpa({ facilities: { ...defaultFacilities, outdoorPool: true } })
  // test against spa
})
```

### Random data helpers

When the specific value doesn't matter — only its type or shape does — generate it randomly. This prevents tests from accidentally passing because of a hardcoded coincidence.

```typescript
// tests/factories/random.ts
export const randomString = (prefix = 'str') =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`

export const randomInt = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const randomPick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]
```

**Rule:** Use a hardcoded value when the test cares about *that specific value*. Use a random helper when the test only cares about *the type or shape*.

### Extracting the "When" call

If the function under test has a signature that might change (different parameter order, added arguments), wrap the call in a single helper. Every test calls the helper — only the helper needs updating when the signature changes.

```typescript
// Single point of change if the function signature evolves
function whenGetLowestPrice(spaId: number) {
  return getLowestDayPassPrice(spaId)
}

it('returns the lowest price from multiple options', () => {
  expect(whenGetLowestPrice(1)).toBe(45)
})
```

Keep these helpers in the same test file unless multiple test files share the same function under test.
````

---

### Change 2 — Strengthen "behaviour vs implementation" in "What Makes a Good Unit Test"

**Why:** Q5-B. The transcript's strongest principle is testing behaviour not implementation. The existing bullet is the right entry point — add a clarifying sentence.

**Location:** The bullet starting with `- **Survives a refactor**` in the `## What Makes a Good Unit Test` section.

**Current text:**
```
- **Survives a refactor** — if the behaviour hasn't changed, the test shouldn't break
```

**Replace with:**
```
- **Survives a refactor** — if the behaviour hasn't changed, the test shouldn't break. Test what the function *returns or renders*, not which internal functions it calls. A test that breaks when you rename a private function is testing implementation, not behaviour.
```

---

### Change 3 — Add naming bullet to "What Makes a Good Unit Test"

**Why:** Q6-B. Specific test names are critical for CI debugging — a failure should tell you what broke without reading the test body.

**Location:** The bullet starting with `- Has a name that reads like a sentence` in `## What Makes a Good Unit Test`.

**Current text:**
```
- Has a name that reads like a sentence: `"returns zero when the list is empty"`
```

**Replace with:**
```
- Has a name that reads like a sentence: `"[subject] [condition] [expected outcome]"` — e.g. `"returns zero when the list is empty"`, `"throws when input is null"`. Specific names mean a CI failure tells you exactly what broke without reading the test body.
```

---

### Change 4 — Fix contradicting warning sign (single assertion)

**Why:** The current warning sign `"Test calls expect zero or one time → probably not testing enough"` tells readers that having one assertion is bad. The transcript says the opposite — one assertion per test is the goal. This is actively misleading and must be corrected.

**Location:** The warning signs list in `## What Makes a Good Unit Test`.

**Current text:**
```
- Test calls `expect` zero or one time → probably not testing enough
```

**Replace with:**
```
- Test has **no** assertion → it cannot fail; delete or fix it
- Test has **many** assertions → split into separate tests, each with a name that describes the one thing it checks
```

---

### Change 5 — Add `expect.soft()` caveat after the new warning signs (Change 4)

**Why:** The transcript explicitly says some frameworks let you run multiple assertions and still surface each failure independently. Vitest supports this via `expect.soft()`. Omitting it makes the rule from Change 4 appear absolute when a legitimate tool exists.

**Location:** Immediately after the two new bullets added in Change 4.

**Content to add:**
````markdown
  - *Exception:* Vitest's `expect.soft()` continues running after a failure and attaches a per-assertion message. If you use it, give every assertion an explicit description — without one you lose the CI debuggability that justifies the exception.
  ```typescript
  it('returns correct shape for valid input', () => {
    const result = transform(input)
    expect.soft(result.name, 'name field').toBe('Alice')
    expect.soft(result.age, 'age field').toBe(30)
  })
  ```
````

---

## What is NOT changing

- Phase 0 gate — no changes
- Phase 1 (Analyse) — no changes
- Phase 2 (Plan) — no changes; four-bucket structure stands
- Phase 3 structure and assertions table — no changes
- Mocking Rules — no changes
- Output Format — no changes
- File description frontmatter — no changes

---

## Implementation steps

1. Apply Change 2 (behaviour vs implementation bullet — small edit)
2. Apply Change 3 (naming bullet — adjacent to Change 2)
3. Apply Change 4 (fix the contradicting warning sign)
4. Apply Change 5 (add `expect.soft()` caveat immediately after Change 4)
5. Apply Change 1 (insert Test Data Factories section between fake timers and "What Makes a Good Unit Test")
6. Read the file back top-to-bottom and verify:
   - No existing content was moved or removed
   - All five insertions are syntactically correct Markdown
   - Code blocks are properly fenced with language tags
   - File still reads coherently top-to-bottom
