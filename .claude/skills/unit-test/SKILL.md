---
name: unit-test
description: Write meaningful unit tests for a given component or function. Best suited for pure functions and critical business logic. Will redirect to integration testing if the code requires significant mocking. Generic — not tied to any specific project.
---

# Unit Test Writer

Given a function or component, produce a complete, meaningful unit test suite using Vitest.

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

Present a brief summary. Get confirmation before writing tests if anything is ambiguous.

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

## What Makes a Good Unit Test

A good unit test:
- Tests **one behaviour** per test
- Uses the **public interface** — not internals
- Has a name that reads like a sentence: `"returns zero when the list is empty"`
- **Survives a refactor** — if the behaviour hasn't changed, the test shouldn't break
- Is **fast** — no I/O, no network, no sleep

### Warning signs

- Test name contains "and" → split it
- Test mocks an internal function (not a boundary) → testing implementation, not behaviour
- Test breaks when you rename a private variable → coupled to internals
- Test calls `expect` zero or one time → probably not testing enough
- Test always passes → assertion may be wrong

---

## Output Format

Produce:
1. The complete test file, ready to run
2. A brief summary listing:
   - How many tests were written
   - Which buckets were covered
   - Any behaviours that were **intentionally skipped** and why

If the code is untestable as-is (e.g. hidden dependencies, no injectable seams), flag this and suggest the minimal refactor that would make it testable.

### When Phase 0 redirects

If the code did not pass the Phase 0 gate, output the following instead of a test file:

1. **Which step failed** — state clearly: "This code did not pass the Phase 0 unit test gate at Step [1/2/3]."
2. **Why** — one sentence explaining the specific signal (not a pure function / not critical business logic / [N] mocks required).
3. **Recommendation** — advise the user to use an integration test instead and briefly explain what that would cover that a unit test cannot.

Do not produce a partial test file. Do not apologise. State the finding and the recommendation directly.
