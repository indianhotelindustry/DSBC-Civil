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
    // `npm test` runs the pure, hermetic unit suite only. The emulator-backed
    // rules suite lives in tests/rules/ and runs via `npm run test:rules`
    // (vitest.rules.config.ts), because it needs a running Firestore emulator.
    include: ['src/**/*.test.ts'],
  },
});
