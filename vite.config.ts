import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // `npm test` runs the pure, hermetic suites only. The emulator-backed
    // rules suite lives in tests/rules/ and runs via `npm run test:rules`
    // (vitest.rules.config.ts), because it needs a running Firestore emulator.
    //
    // tests/config/ holds hermetic checks over committed configuration
    // (e.g. that firestore.indexes.json still covers the queries that need it).
    // They read files only — no emulator, no network — so they belong here.
    include: ['src/**/*.test.ts', 'tests/config/**/*.test.ts'],
  },
});
