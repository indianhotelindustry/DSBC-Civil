# tests/ — Integration, Rules, and E2E Tests

This directory is for **cross-cutting and higher-level tests**. Unit tests for pure logic remain **co-located** with their source as `src/lib/*.test.ts` (Vitest) — do not move them; that co-location is the established, working pattern (199 tests today).

## What belongs here (as the test pyramid fills out — Constitution §19)

| Level | Location | Status |
|---|---|---|
| **Unit (pure)** | `src/lib/*.test.ts` (co-located) | ✅ 199 tests |
| **Service** | `tests/service/` (Firestore emulator) | ⏳ Phase 2 |
| **Function** | `tests/functions/` (emulator) | ⏳ Phase 2 (with Cloud Functions) |
| **Rules** | `tests/rules/` (`@firebase/rules-unit-testing`) | ⏳ Phase 2 — **mandatory for every rules change (NN-29, TEST-3)** |
| **E2E** | `tests/e2e/` (Playwright) | ⏳ later (critical approval/payment journeys) |

## Non-negotiable test rules (Constitution §19)

- Every new pure function ships with a co-located test (NN-16, TEST-2).
- Every `firestore.rules` change ships rules-unit-tests proving **allow AND deny** (TEST-3) — these live in `tests/rules/`.
- Every financial invariant tests the **failure** case, not just the happy path (TEST-4).
- Company-scoped changes include a **cross-company isolation test** (NN-29).
- Tests are hermetic and use an injected fixed clock (TEST-5).

## Running

```bash
npm test          # vitest run (all unit tests today)
```

Emulator-based suites will add scripts as the pyramid fills (Phase 2). CI runs the full suite on every PR ([`../.github/workflows/ci.yml`](../.github/workflows/ci.yml)).
