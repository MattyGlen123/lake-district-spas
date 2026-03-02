---
name: tdd
description: Enforce strict Test-Driven Development using vertical slices (Red-Green-Refactor). Use when the user wants to build a feature, fix a bug, or add logic using TDD discipline. Constrains Claude to ONE test → ONE implementation cycles to prevent imagined behavior, fake test passes, and over-engineering.
---

# TDD - Test-Driven Development

Implement features using strict Red-Green-Refactor vertical slices. Each cycle is: write ONE failing test → write minimal code to pass it → repeat. No bulk test writing. No speculative implementation.

## Phase 1: Plan Before Any Code

Answer these questions before writing a single line:

**1. What interface changes are needed?**
List every function, method, or API being added or modified. Be specific about signatures, parameters, and return types.

**2. Which behaviors matter most?**
Rank the behaviors to test in order of importance. Start with the critical path, then edge cases. You cannot test everything — prioritize.

**3. Can we design for deep modules?**
A deep module has a small interface but handles complex logic internally. Aim for this. It makes testing simpler and the API cleaner.

**4. Can we design for testability?**
- Functions should accept dependencies rather than create them (dependency injection)
- Functions should return results instead of producing side effects where possible
- Avoid reaching into global state or external services directly

Present the plan to the user. Get alignment before proceeding.

---

## Phase 2: Red-Green Cycles (Vertical Slices)

Work through behaviors ONE AT A TIME.

### The Cycle

**RED** → Write ONE test that currently fails.
- Test one specific, observable behavior
- Use the public interface (not internals)
- Run the test and confirm it fails

**GREEN** → Write the minimal code to pass that test only.
- No extra logic "for later"
- No speculative implementation
- Run the test and confirm it passes

**REPEAT** → Move to the next behavior.

### Rules

1. **Never write more than one test before implementing.** If you have 5 behaviors to test, write test 1 → implement → test 2 → implement → and so on.

2. **If a test passes immediately without implementation**, that is valid — it means the system already handles this case. Note it, move on.

3. **Never rewrite a test to make it pass.** If implementation is hard, the design may be wrong. Step back and reconsider the interface.

4. **Never mock internal collaborators.** Only mock at system boundaries (external APIs, databases, file system, clock, randomness).

---

## Phase 3: Refactor (After All Tests Pass)

Only refactor once all tests in the current scope are green.

- Remove duplication in the implementation
- Simplify complex logic
- Improve naming
- Do NOT change behavior (tests must still pass after refactoring)

---

## What Makes a Good Test

Good tests exercise real code paths through **public interfaces**, not implementation details. They describe WHAT the system does, not HOW it does it.

```typescript
// GOOD: Tests observable behavior through the interface
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

A good test reads like a specification. It survives complete internal refactors because it does not care about internal structure.

### Warning Signs of a Bad Test

- Your test breaks when you refactor, but the behavior has not changed
- The test mocks an internal function (not a boundary)
- The test queries a database or external service directly to verify behavior
- The test calls a private method or accesses internal state
- The test verifies a call count on a collaborator

```typescript
// BAD: Tests implementation detail (mocking internals)
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});

// BAD: Bypasses interface to verify (queries DB directly)
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});
```

| Good Tests | Bad Tests |
|---|---|
| Exercise real code through public interfaces | Mock internal collaborators |
| Describe WHAT the system does | Test HOW it is implemented |
| Survive internal refactors unchanged | Break on refactoring without behavior change |
| Read like specifications | Verify call counts or data shapes |
| Focus on user-facing behavior | Query external systems to verify |

---

## Communication Pattern

After each RED phase, state:
> **RED**: `[test name]` — currently failing because [reason].

After each GREEN phase, state:
> **GREEN**: `[test name]` passes. Next behavior: [next behavior or "done"].

After REFACTOR:
> **REFACTOR complete**: [what changed]. All [N] tests still passing.

If a test passes immediately:
> **Already green**: `[test name]` passed without implementation — the system already handles this case.

---

## Constraints to Enforce

These constraints exist to prevent common LLM failure modes:

- **No bulk test writing** — Writing all tests first means testing imagined behavior, not observed behavior
- **No speculative implementation** — Code not driven by a failing test is likely wrong or unnecessary
- **No implementation-coupled tests** — Tests that verify internals are liabilities, not assets
- **No faking test passes** — If a test is hard to pass, fix the design, not the test
- **No over-engineering** — Implement the minimum to pass the current test, nothing more

