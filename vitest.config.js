import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setupTests.vitest.ts'],
        include: ['**/__tests__/**/(*.)+(spec|test).[jt]s?(x)'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        globals: true, // Enable global test APIs like describe, it, expect
        testTimeout: 10000, // Increase timeout for complex tests
        hookTimeout: 10000, // Increase hook timeout
    },
    esbuild: {
        target: 'node14',
    },
});
