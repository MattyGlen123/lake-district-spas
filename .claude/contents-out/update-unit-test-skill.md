# Implementation Plan — Update Unit Test Skill

## Summary of decisions

| Question | Answer | Impact |
|----------|--------|--------|
| Q1 — No file path provided | Prompt user before proceeding | Add Input Phase |
| Q2 — Update criteria | Coverage gaps + quality issues | Scenario 1 review scope |
| Q3 — Phase 0 gate | Still runs; fail = stop | Phase 0 applies to Scenario 2 only |
| Q4 — Run tests after write | Yes — `npx vitest run <file>` | Add execution step to both scenarios |
| Q5 — "No test needed" message | Brief note only | Remove verbose redirect output |
| Q6 — Post-write summary | No summary | Remove Output Format summary requirement |
| Q7 — Existing correct tests | Keep exactly as-is | Scenario 1 rule |
| Q8 — Project conventions | Keep generic | No change |
| Q9 — Overwrite safety | Silent overwrite | No confirmation prompt |
| Q10 — Input format | Argument after skill name | Input Phase detection |

---

## Changes to `SKILL.md`

### 1. Update the frontmatter description

**Current:**
```
description: Write meaningful unit tests for a given component or function. Best suited for pure functions and critical business logic. Will redirect to integration testing if the code requires significant mocking. Generic — not tied to any specific project.
```

**Replace with:**
```
description: Write or review unit tests given a file path argument. Pass a source file to generate a new test file. Pass an existing test file to review and improve it. Proceeds without confirmation. Generic — not tied to any specific project.
```

---

### 2. Add a new "Input Phase" as the first section (before Phase 0)

Insert this block between the `# Unit Test Writer` heading and `## Phase 0`:

```markdown
## Input Phase: Detect File and Scenario

The skill requires a file path as its argument:

```
/unit-test src/lib/prices.ts          ← source file → Scenario 2
/unit-test src/lib/prices.test.ts     ← test file   → Scenario 1
```

**Step 1 — Was a file path provided?**

- **Yes** → Read the file at that path. Continue to Step 2.
- **No** → Ask the user: "Please provide a file path to proceed. Pass a source file to generate tests, or an existing test file to review it."
  Wait for the path, then continue to Step 2.

**Step 2 — What type of file is it?**

Check whether the file name contains `.test.` or `.spec.`:

- **Test file** (e.g. `prices.test.ts`) → **Scenario 1** — Review and update the existing test file.
  Skip Phase 0. Go directly to [Scenario 1: Review Existing Test File](#scenario-1-review-existing-test-file).
- **Source file** (e.g. `prices.ts`) → **Scenario 2** — Assess and generate a new test file.
  Continue to Phase 0.
```

---

### 3. Add a new "Scenario 2" header before Phase 0

Insert this block immediately before the `## Phase 0` heading. This makes the two workflows symmetrical and explicit:

```markdown
---

## Scenario 2: Generate Test File for a Source File

The input is a source file (component or utility function). Phase 0 through Phase 3 below cover this scenario. Phase 0 decides whether a unit test is appropriate; Phase 1–3 plan and write it.
```

---

### 4. Add a new "Scenario 1" section (after the Input Phase, before the Scenario 2 block)

Insert this full section. Phase 0 and beyond are only reached via Scenario 2.

```markdown
---

## Scenario 1: Review Existing Test File

The input is an existing test file. The goal is to determine whether it needs updating and, if so, update it without asking for confirmation.

### Step 1 — Locate and read the source file

Identify the source file the test file is covering:

- `src/lib/prices.test.ts` → source is `src/lib/prices.ts`
- `src/components/Button.test.tsx` → source is `src/components/Button.tsx`

Read both files before continuing.

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

### Edge case — source file not found

If the source file cannot be located at the inferred path (e.g. `prices.test.ts` → `prices.ts` does not exist), output:

`Cannot locate source file at [inferred path]. Please confirm the path and re-run.`

Stop. Do not modify the test file.

---
```

---

### 6. Remove the confirmation prompt from Phase 1

**Current line at the end of Phase 1:**
```
Present a brief summary. Get confirmation before writing tests if anything is ambiguous.
```

**Replace with:**
```
Present a brief summary. Proceed to Phase 2 without asking for confirmation.
```

---

### 7. Add no-confirmation statement to Phase 3

**Current Phase 3 "Write the Tests" section has no mention of auto-proceeding.**

Add one sentence at the top of Phase 3, after the section heading `## Phase 3: Write the Tests`:

```markdown
> **Auto-proceed:** Write the test file directly to disk without asking for confirmation.
```

---

### 8. Update the Output Format section

**Current:**
```markdown
## Output Format

Produce:
1. The complete test file, ready to run
2. A brief summary listing:
   - How many tests were written
   - Which buckets were covered
   - Any behaviours that were **intentionally skipped** and why
```

**Replace with:**
```markdown
## Output Format

Write the complete test file directly to disk without asking for confirmation. Then run the file:

```bash
npx vitest run <path-to-test-file>
```

Report the result:
- **Pass** → State how many tests passed.
- **Fail** → Show the failing test names and error output. Fix the failures and re-run.

If the code did not pass Phase 0, output the redirect message (see "When Phase 0 redirects" below) instead of a test file. Do not run the test runner.
```

---

### 9. Update the "When Phase 0 redirects" output

**Current:**
```
If the code did not pass the Phase 0 gate, output the following instead of a test file:

1. **Which step failed** — state clearly: "This code did not pass the Phase 0 unit test gate at Step [1/2/3]."
2. **Why** — one sentence explaining the specific signal (not a pure function / not critical business logic / [N] mocks required).
3. **Recommendation** — advise the user to use an integration test instead and briefly explain what that would cover that a unit test cannot.
```

**Replace with:**
```
If the code did not pass the Phase 0 gate, output a single brief message:

`No test file needed — [one sentence: which step failed and why, e.g. "requires 4 mocks, better suited to an integration test"].`

Do not produce a partial test file. Do not apologise.
```

---

## File to edit

**Target:** `.claude/skills/unit-test/SKILL.md`

## Order of edits

1. Update frontmatter `description` field.
2. Insert Input Phase section after the `# Unit Test Writer` heading.
3. Insert Scenario 2 header block immediately before `## Phase 0`.
4. Insert Scenario 1 section between the Input Phase and the Scenario 2 block.
5. Add "source file not found" edge case to Scenario 1 Step 5.
6. Remove confirmation prompt from end of Phase 1.
7. Add `> Auto-proceed` note to top of Phase 3.
8. Replace Output Format section.
9. Replace "When Phase 0 redirects" output description.

## What does NOT change

- Phase 0 gate logic (Steps 1–3) — unchanged.
- Phase 1 analysis questions — unchanged.
- Phase 2 test case planning buckets — unchanged.
- Phase 3 test writing rules, assertions, async patterns — unchanged.
- Mocking Rules section — unchanged.
- Test Data Factories section — unchanged.
- "What Makes a Good Unit Test" section — unchanged (used as reference in Scenario 1 Step 2).
