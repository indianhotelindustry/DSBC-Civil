import { defineConfig } from 'vitest/config';

/**
 * Firestore rules-unit-test suite (NN-29 / TEST-3).
 *
 * Deliberately separate from the default vitest project: these tests require a
 * running Firestore emulator, so they must never join `npm test` (which stays
 * pure and hermetic). Run them with:
 *
 *   npm run test:rules
 *
 * which wraps this config in `firebase emulators:exec --only firestore`.
 * Requires a JDK on PATH — the Firestore emulator is a Java process.
 */
export default defineConfig({
  test: {
    include: ['tests/rules/**/*.test.ts'],
    environment: 'node',
    // The suite shares one emulator instance and calls clearFirestore()
    // between tests, so files must not run concurrently.
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
});
