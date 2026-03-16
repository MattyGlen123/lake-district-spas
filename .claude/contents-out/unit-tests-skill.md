# Implementation Plan — Unit Test Skill Update

Source doc: `.claude/contents-in/unit-tests-skill.md`
Skill file: `.claude/skills/unit-test/SKILL.md`
Answers: `.claude/contents-in/unit-tests-skill-answers-01.md`

---

## Summary of Changes

Based on the transcript review and answers, the skill needs five focused changes, plus three patches from the post-plan audit:

1. **Update the frontmatter description** — make it explicit about when to use and when NOT to use the skill
2. **Add Phase 0** — a hard gate that checks if a unit test is the right choice before any planning begins
3. **Update Phase 1** — add a pure function check as the first analytical step, with downstream adjustments based on the result
4. **Add a critical business logic definition** — with concrete examples so the gate in Phase 0 can be applied consistently
5. **Strengthen the mocking rules** — add a hard redirect threshold (≥3 mocks = stop, recommend integration test)
6. **(Patch A)** Fix Phase 0 redirect text — remove broken `tdd` skill reference
7. **(Patch B)** Add "code assurance vs code coverage" rationale to Phase 0
8. **(Patch C)** Define output format for the redirected case
9. **(Patch D)** Clarify mock threshold as a deliberate choice, not arbitrary

No changes to: Vitest syntax, testing hierarchy section, or passing-case output format.

---

## Change 1 — Update Frontmatter Description

**File location:** Line 3, `description:` field

**Current:**
> Write meaningful unit tests for a given component or function. Use when the user provides code and wants unit tests written for it. Covers happy paths, edge cases, error handling, and boundary conditions. Generic — not tied to any specific project.

**Replace with:**
> Write meaningful unit tests for a given component or function. Best suited for pure functions and critical business logic. Will redirect to integration testing if the code requires significant mocking. Generic — not tied to any specific project.

**Why:** The description is the trigger signal Claude uses to decide when to invoke the skill. It needs to encode the transcript's core lesson — unit tests have a specific best-use zone — so it's applied correctly and not over-used.

---

## Change 2 — Add Phase 0: Is This a Unit Test?

**File location:** Insert before current `## Phase 1: Analyse the Code`

**Insert this entire section:**

```markdown
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
```

**Why:** This is the highest-value change. It encodes the transcript's central argument as a decision tree the AI runs before generating any tests. The 3-mock threshold is a concrete, actionable version of "too much mocking = wrong test type."

---

## Change 3 — Update Phase 1: Add Pure Function Check as Step 0a

**File location:** Inside `## Phase 1: Analyse the Code`, before the numbered list.

**Insert after the opening paragraph ("Before writing a single test, read the code and answer:"):**

```markdown
**0. Is this a pure function?** *(Confirm from Phase 0 or assess now)*
Note whether the function always returns the same output for the same input with no observable side effects. This shapes how confident you can be in the tests and whether any mocking will be needed. A pure function needs zero mocks and gives maximum confidence.
```

**Why:** Phase 1 is where the deep code read happens. Flagging purity explicitly here — not just as a Phase 0 gate but as an analytical output — means the rest of the analysis (deps, side effects, mocking plan) is framed correctly from the start.

---

## Change 4 — Strengthen Mocking Rules with Hard Threshold

**File location:** `## Mocking Rules` section, after the opening rule "Only mock at system boundaries."

**Insert this block after the existing mock/don't-mock table:**

```markdown
### Mocking threshold

Count the mocks you are planning to write. The threshold is **3 or more** — chosen as the point where mocking overhead consistently outweighs the confidence gained. If the total reaches 3, stop.

> **Redirect:** Returning to Phase 0, Step 3 — this level of mocking is a strong signal that this code is better covered by an integration test. Heavy mocking means you are testing your fake collaborators, not real behaviour. The confidence gain from the unit test will be low.

If you reached Phase 3 before realising this, discard the test plan and recommend an integration test to the user instead.
```

**Why:** Phase 0 catches this upfront, but a developer may only discover the mocking count during Phase 3 when they start writing. This rule provides a second checkpoint so the redirect still happens even if Phase 0 was passed too quickly.

---

## Change 5 — Add Critical Business Logic Definition to Phase 1

**File location:** Inside `## Phase 1: Analyse the Code`, after question **1. What does it do?**

**Insert:**

```markdown
If the function appears to be critical business logic (see examples in Phase 0, Step 2), note this explicitly. It means the test suite should prioritise correctness and completeness over brevity — do not skip edge cases here.
```

**Why:** Answers Q5-A: the examples already exist in Phase 0, Step 2. This note in Phase 1 creates a link back to them and adjusts the test-writing posture — critical logic gets more thorough coverage, not the same treatment as a minor utility.

---

## Change 6 — Define Output for the Redirected Case (Patch C)

**File location:** `## Output Format` section, append after the existing two-item list.

**Insert:**

```markdown
### When Phase 0 redirects

If the code did not pass the Phase 0 gate, output the following instead of a test file:

1. **Which step failed** — state clearly: "This code did not pass the Phase 0 unit test gate at Step [1/2/3]."
2. **Why** — one sentence explaining the specific signal (not a pure function / not critical business logic / [N] mocks required).
3. **Recommendation** — advise the user to use an integration test instead and briefly explain what that would cover that a unit test cannot.

Do not produce a partial test file. Do not apologise. State the finding and the recommendation directly.
```

**Why:** Phase 0 introduces a new terminal state — the skill stops before Phase 1. Without defining what to output in that case, behaviour is undefined and will vary across invocations.

---

## Implementation Order

Apply changes in this order to avoid conflicts:

1. Phase 0 section (Change 2 + Patch A redirect text + Patch B rationale paragraph)
2. Phase 1 Step 0a (Change 3)
3. Phase 1 critical logic note (Change 5)
4. Mocking rules threshold (Change 4 + Patch D threshold clarification)
5. Output format — redirect output (Change 6)
6. Frontmatter description (Change 1)

---

## What Is Not Changing

- Vitest syntax and code examples — unchanged (Q6-C)
- Testing hierarchy / philosophy section — not added (Q7-C)
- Passing-case output format — unchanged (Q8-C)
- Phase 2 (test case buckets) — unchanged
- Phase 3 (assertions, async patterns, fake timers) — unchanged
- "What Makes a Good Unit Test" section — unchanged
