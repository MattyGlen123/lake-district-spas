---
name: unit-test
description: Write or review unit tests given a file path argument. Pass a source file to generate a new test file. Pass an existing test file to review and improve it. Proceeds without confirmation. Generic — not tied to any specific project.
---

# Unit Test Writer

Given a function or component, produce a complete, meaningful unit test suite using Vitest.

## Input Phase: Detect File and Scenario

The skill requires a file path as its argument:

```
/unit-test src/lib/prices.ts          ← source file → Scenario 2
/unit-test src/lib/prices.test.ts     ← test file   → Scenario 1
```

**Step 1 — Was a file path provided?**

- **Yes** → Read the file at that path. Continue to Step 2.
- **No** → Ask the user: "Please provide a file path to proceed. Pass a source file to generate tests, or an existing test file to review it." Wait for the path, then continue to Step 2.

**Step 2 — What type of file is it?**

Check whether the file name contains `.test.` or `.spec.`:

- **Test file** (e.g. `prices.test.ts`) → **Scenario 1** — Review and update the existing test file. Skip Phase 0. Go directly to Scenario 1 below.
- **Source file** (e.g. `prices.ts`) → **Scenario 2** — Assess and generate a new test file. Continue to Scenario 2 / Phase 0 below.

---

## Scenario 1: Review Existing Test File

The input is an existing test file. The goal is to determine whether it needs updating and, if so, update it without asking for confirmation.

### Step 1 — Locate and read the source file

Identify the source file the test file is covering:

- `src/lib/prices.test.ts` → source is `src/lib/prices.ts`
- `src/components/Button.test.tsx` → source is `src/components/Button.tsx`

Read both files before continuing.

If the source file cannot be located at the inferred path, output:

`Cannot locate source file at [inferred path]. Please confirm the path and re-run.`

Stop. Do not modify the test file.

### Step 2 — Review the test file against two criteria

**Criterion A — Coverage gaps**

Compare the test cases against the source file's branches, return values, and edge cases (using the Phase 2 buckets: happy path, edge cases, error cases, state/branching). Identify any meaningful behaviour in the source that has no corresponding test.

**Criterion B — Quality issues**

Check every test against the warning signs in "What Makes a Good Unit Test":
- Test name contains "and" → should be split
- Test mocks an internal function → tests implementation, not behaviour
- Test has no assertion → cannot fail
- Test has many assertions without `expect.soft()` → should be split
- Assertion uses `toBeTruthy` where `toBe(true)` would be more specific

### Step 3 — Decide: update or no update needed?

**If no coverage gaps and no quality issues are found:**

Output: `No updates needed — [one-sentence reason, e.g. "all branches covered, no quality issues detected"].`

Stop. Do not modify the file.

**If gaps or issues are found:**

Proceed to Step 4.

### Step 4 — Write the updated test file

Rules:
- Keep every test that is correct exactly as-is. Do not rewrite, reformat, or rename passing tests unless they have a quality issue.
- Only add, fix, or remove tests where a specific gap or issue was identified in Step 2.
- Write the updated file silently — no confirmation prompt.

### Step 5 — Run the tests

Run the test file:

```bash
npx vitest run <path-to-test-file>
```

Report the result:
- **Pass** → State how many tests passed.
- **Fail** → Show the failing test names and error output. Fix the failures and re-run.

---

## Scenario 2: Generate Test File for a Source File

The input is a source file (component or utility function). Phase 0 through Phase 3 below cover this scenario. Phase 0 decides whether a unit test is appropriate; Phase 1–3 plan and write it.

---

## Phase 0: Is This the Right Test Type?

**Why this gate exists:** Unit tests increase *code coverage* — the percentage of lines executed during a test run. But coverage is not the same as confidence that your code works correctly in production. When a unit test mocks three collaborators to isolate one function, it proves that function works with *fake* inputs from *fake* dependencies. If those integrations are wrong, the test still passes. This gate filters for the cases where unit tests genuinely add confidence, not just coverage.

Before analysing the code, run this gate. Unit tests are the right choice only in specific situations.

### Step 1 — Is it a pure function?

A pure function always returns the same output for the same input and has no side effects.

Ask: "If I call this twice with identical arguments, will I always get identical results?"

- **Yes** → Unit test is the right choice. Proceed to Phase 1.
- **No** → Continue to Step 2.

### Step 2 — Is it critical business logic?

Critical business logic is code where a bug has a significant consequence: incorrect results, financial errors, security failures, or data corruption.

**Examples of critical business logic:**
- Price and discount calculations
- Tax, VAT, or currency conversion
- Authentication and authorisation rules
- Permission checks and access control
- Data validation before persistence
- Scheduling or date-boundary logic

Ask: "Would a bug here have a meaningful, real-world consequence?"

- **Yes** → Unit test is warranted. Proceed to Phase 1, but monitor mocking load in Step 3.
- **No** → Continue to Step 3.

### Step 3 — How many external dependencies need mocking?

Count the things the code reaches outside itself that would need to be faked: API calls, database queries, file system reads, external SDKs, environment variables.

- **0–2 mocks** → Acceptable for a unit test. Proceed to Phase 1.
- **3 or more mocks** → **Stop.**

> **Redirect:** This code has significant external dependencies. A unit test here will require heavy mocking that reduces confidence in the result — you end up testing fake interactions, not real behaviour. This is a better candidate for an **integration test**, where external calls are allowed to run for real. Stop here and advise the user to switch test type before proceeding.

---

## Phase 1: Analyse the Code

Before writing a single test, read the code and answer:

**0. Is this a pure function?** *(Confirm from Phase 0 or assess now)*
Note whether the function always returns the same output for the same input with no observable side effects. This shapes how confident you can be in the tests and whether any mocking will be needed. A pure function needs zero mocks and gives maximum confidence.

**1. What does it do?**
State the purpose in one sentence. If you can't, the code may need refactoring before testing.

If the function appears to be critical business logic (see examples in Phase 0, Step 2), note this explicitly. It means the test suite should prioritise correctness and completeness over brevity — do not skip edge cases here.

**2. What are the inputs?**
List every parameter, argument, or prop. Note types, optional vs required, and any constraints (min/max, enum values, etc).

**3. What are the outputs / observable effects?**
- Return values
- Thrown errors or rejected promises
- Mutations to arguments or external state (note: these are harder to test and often a design smell)
- Side effects at system boundaries (network, file system, clock, randomness)

**4. What are the dependencies?**
List everything the code reaches outside itself. These are candidates for mocking — but only if they are true system boundaries (see mocking rules below).

**5. What are the interesting cases?**
Scan for: conditionals, loops, type coercions, null/undefined checks, early returns, throws, async paths, and boundary values.

Present a brief summary. Proceed to Phase 2 without asking for confirmation.

---

## Phase 2: Plan the Test Cases

Organise into four buckets:

| Bucket | What belongs here |
|--------|-------------------|
| **Happy path** | The common, expected use — correct inputs, correct outputs |
| **Edge cases** | Boundary values, empty inputs, zeros, empty arrays, minimum/maximum |
| **Error cases** | Invalid inputs, missing required args, values that trigger throws or rejections |
| **State / branching** | Each meaningful branch of an `if`/`switch`/ternary that changes observable behaviour |

**Rules:**
- One behaviour per test. If a test name needs "and", split it into two tests.
- Prioritise by importance. If you have 10 cases, rank them — start with the ones that matter most.
- Skip trivial cases. Don't test that `1 + 1 === 2` lives inside your function.

---

## Phase 3: Write the Tests

> **Auto-proceed:** Write the test file directly to disk without asking for confirmation.

### File naming

Place tests next to the source or in a `__tests__` folder:
```
src/utils/formatPrice.ts           → src/utils/formatPrice.test.ts
src/components/Button.tsx          → src/components/Button.test.tsx
```

### Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { myFunction } from './myFunction'

describe('myFunction', () => {
  // Happy path
  it('returns the expected result for valid input', () => {
    expect(myFunction('valid')).toBe('expected')
  })

  // Edge cases
  it('returns empty string when input is empty', () => {
    expect(myFunction('')).toBe('')
  })

  // Error cases
  it('throws when input is null', () => {
    expect(() => myFunction(null)).toThrow('Input cannot be null')
  })

  // Async
  it('resolves with data on success', async () => {
    const result = await myFunction('valid')
    expect(result.status).toBe('ok')
  })
})
```

### Assertions — use the most specific one available

| Situation | Use |
|-----------|-----|
| Exact value equality | `toBe` (primitives), `toEqual` (objects/arrays) |
| Partial object match | `toMatchObject` |
| Array contents (any order) | `expect.arrayContaining` |
| Thrown error | `toThrow` / `toThrowError` |
| Rejected promise | `rejects.toThrow` |
| Value exists | `toBeDefined` / `not.toBeNull` |
| Truthy/falsy | `toBeTruthy` / `toBeFalsy` |
| Approximate number | `toBeCloseTo` |
| Called with args | `toHaveBeenCalledWith` |

Avoid `toBeTruthy` when you can use `toBe(true)`. Be as specific as possible — vague assertions hide bugs.

### Async patterns

```typescript
// Resolved promise
it('resolves with correct data', async () => {
  const result = await fetchData('id-1')
  expect(result.name).toBe('Alice')
})

// Rejected promise
it('rejects on network error', async () => {
  await expect(fetchData('bad-id')).rejects.toThrow('Not found')
})
```

---

## Mocking Rules

**Only mock at system boundaries.** Internal collaborators should run for real.

| Mock this | Do NOT mock this |
|-----------|-----------------|
| Network / HTTP calls | Pure utility functions |
| File system (`fs`) | Internal modules your code calls |
| Database clients | `Date` unless testing time-sensitive logic |
| External SDK calls | `Math.random` unless testing randomness directly |
| Clock / timers (when testing time behaviour) | Anything you control and can run cheaply |

### Mocking threshold

Count the mocks you are planning to write. The threshold is **3 or more** — chosen as the point where mocking overhead consistently outweighs the confidence gained. If the total reaches 3, stop.

> **Redirect:** Returning to Phase 0, Step 3 — this level of mocking is a strong signal that this code is better covered by an integration test. Heavy mocking means you are testing your fake collaborators, not real behaviour. The confidence gain from the unit test will be low.

If you reached Phase 3 before realising this, discard the test plan and recommend an integration test to the user instead.

### Vitest mock patterns

```typescript
// Module mock
vi.mock('./sendEmail', () => ({
  sendEmail: vi.fn().mockResolvedValue({ sent: true }),
}))

// Spy on a method without replacing the module
const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

// Reset between tests
beforeEach(() => {
  vi.clearAllMocks()
})

// Restore originals after test file
afterAll(() => {
  vi.restoreAllMocks()
})
```

### Fake timers

```typescript
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

it('fires callback after 1s', () => {
  const cb = vi.fn()
  setTimeout(cb, 1000)
  vi.advanceTimersByTime(1000)
  expect(cb).toHaveBeenCalledOnce()
})
```

---

## Test Data Factories

Test setup must be as simple as possible. When setup is complicated, developers avoid adding tests and resist modifying existing ones — the very thing unit tests are supposed to enable. The two tools for keeping setup simple are **factories** (for shared object construction) and **random helpers** (for values whose specific content doesn't matter).

If your test setup requires creating the same data shape more than once, extract it into a factory function. Duplicated setup code makes tests fragile — a field rename means touching every test instead of one helper.

**Where to put factory files:** `tests/factories/` — shared across all test files that need them.

```
tests/
  factories/
    makeSpa.ts        ← factory for a domain object
    random.ts         ← random data helpers
```

### Factory pattern

```typescript
// tests/factories/makeUser.ts
import type { User } from '@/types/user'

let _id = 1

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: _id++,
    name: 'Test User',
    email: 'test@example.com',
    role: 'viewer',
    ...overrides,
  }
}
```

Use `overrides` to set only the fields your test cares about:

```typescript
it('grants access when role is admin', () => {
  const user = makeUser({ role: 'admin' })
  expect(canAccess(user, 'dashboard')).toBe(true)
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
function whenGetLowestPrice(id: number) {
  return getLowestDayPassPrice(id)
}

it('returns the lowest price from multiple options', () => {
  expect(whenGetLowestPrice(1)).toBe(45)
})
```

Keep these helpers in the same test file unless multiple test files share the same function under test.

---

## What Makes a Good Unit Test

A good unit test:
- Tests **one behaviour** per test
- Uses the **public interface** — not internals
- Has a name that reads like a sentence: `"[subject] [condition] [expected outcome]"` — e.g. `"returns zero when the list is empty"`, `"throws when input is null"`. Specific names mean a CI failure tells you exactly what broke without reading the test body.
- **Survives a refactor** — if the behaviour hasn't changed, the test shouldn't break. Test what the function *returns or renders*, not which internal functions it calls. A test that breaks when you rename a private function is testing implementation, not behaviour.
- Is **fast** — no I/O, no network, no sleep

### Warning signs

- Test name contains "and" → split it
- Test mocks an internal function (not a boundary) → testing implementation, not behaviour
- Test breaks when you rename a private variable → coupled to internals
- Test has **no** assertion → it cannot fail; delete or fix it
- Test has **many** assertions → split into separate tests, each with a name that describes the one thing it checks
  - *Exception:* Vitest's `expect.soft()` continues running after a failure and attaches a per-assertion message. If you use it, give every assertion an explicit description — without one you lose the CI debuggability that justifies the exception.
  ```typescript
  it('returns correct shape for valid input', () => {
    const result = transform(input)
    expect.soft(result.name, 'name field').toBe('Alice')
    expect.soft(result.age, 'age field').toBe(30)
  })
  ```
- Test always passes → assertion may be wrong

---

## Output Format

Write the complete test file directly to disk without asking for confirmation. Then run the file:

```bash
npx vitest run <path-to-test-file>
```

Report the result:
- **Pass** → State how many tests passed.
- **Fail** → Show the failing test names and error output. Fix the failures and re-run.

If the code is untestable as-is (e.g. hidden dependencies, no injectable seams), flag this and suggest the minimal refactor that would make it testable.

### When Phase 0 redirects

If the code did not pass the Phase 0 gate, output a single brief message:

`No test file needed — [one sentence: which step failed and why, e.g. "requires 4 mocks, better suited to an integration test"].`

Do not produce a partial test file. Do not run the test runner. Do not apologise.
