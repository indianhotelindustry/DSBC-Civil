# tests/ — Integration, Rules, and E2E Tests

This directory is for **cross-cutting and higher-level tests**. Unit tests for pure logic remain **co-located** with their source as `src/lib/*.test.ts` (Vitest) — do not move them; that co-location is the established, working pattern (199 tests today).

## What belongs here (as the test pyramid fills out — Constitution §19)

| Level | Location | Status |
|---|---|---|
| **Unit (pure)** | `src/lib/*.test.ts` (co-located) | ✅ 199 tests |
| **Service** | `tests/service/` (Firestore emulator) | ⏳ Phase 2 |
| **Function** | `tests/functions/` (emulator) | ⏳ Phase 2 (with Cloud Functions) |
| **Rules** | `tests/rules/` (`@firebase/rules-unit-testing`) | ✅ **161 tests** — **mandatory for every rules change (NN-29, TEST-3)** |
| **E2E** | `tests/e2e/` (Playwright) | ⏳ later (critical approval/payment journeys) |

## Non-negotiable test rules (Constitution §19)

- Every new pure function ships with a co-located test (NN-16, TEST-2).
- Every `firestore.rules` change ships rules-unit-tests proving **allow AND deny** (TEST-3) — these live in `tests/rules/`.
- Every financial invariant tests the **failure** case, not just the happy path (TEST-4).
- Company-scoped changes include a **cross-company isolation test** (NN-29).
- Tests are hermetic and use an injected fixed clock (TEST-5).

## Running

```bash
npm test          # vitest run — the 199 pure unit tests (hermetic, no emulator)
npm run test:rules # firebase emulators:exec --only firestore → the 161 rules tests
npm run test:all  # both
```

`npm test` is scoped to `src/**/*.test.ts` (see `vite.config.ts` → `test.include`) so the
unit suite stays hermetic and fast. The rules suite is a **separate vitest project**
([`../vitest.rules.config.ts`](../vitest.rules.config.ts)) because it needs a running
Firestore emulator — it must never gate the pure tests.

**Prerequisite for `test:rules`:** a **JDK on `PATH`** — the Firestore emulator is a Java
process. Locally, install any JDK 17+ (e.g. Temurin 21). CI installs it via
`actions/setup-java`. The emulator runs on **port 8085**
([`../firebase.json`](../firebase.json) → `emulators.firestore`); `emulators:exec` injects
`FIRESTORE_EMULATOR_HOST`, which the harness reads.

### Writing rules tests

[`rules/helpers.ts`](./rules/helpers.ts) provides the shared harness: 10 role personas, a
fixed clock (TEST-5), rules-bypassing fixture seeding, and minimal domain fixtures.
Remember that `firestore.rules` resolves roles by `get()`-ing `users/{uid}` — so every
persona needs a seeded profile (`resetWithUsers` does this in `beforeEach`). The
`outsider` persona is deliberately left unseeded to cover the profile-less case.

Assert **both** directions (TEST-3): a deny-only suite would pass against
`allow read, write: if false` and prove nothing.

Where a rule's real behaviour differs from its documented intent, add a
**CHARACTERIZATION** test that pins the actual behaviour, name the finding in the title,
and explain the fix in a comment — do not silently change `firestore.rules`, which is an
ADR-mandatory surface (AMENDMENT-001 Article VII #7). See the R-1/R-2/H-3 examples in
`rules/workOrders.rules.test.ts`, `rules/bills.rules.test.ts` and
`rules/auditAndServerOnly.rules.test.ts`, reported in
[`../RULES_TEST_REPORT.md`](../RULES_TEST_REPORT.md).

CI runs the unit suite, the rules suite, the production build, and the Cloud Functions
bundle on every PR ([`../.github/workflows/ci.yml`](../.github/workflows/ci.yml)).
