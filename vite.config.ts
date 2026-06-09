import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Suppress Sass deprecation warnings
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        // Alternative: quietDeps can suppress warnings from node_modules
        quietDeps: true
      }
    }
  }
});
