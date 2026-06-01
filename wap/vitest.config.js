import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/utils/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/utils/__tests__/',
        'src/composables/__tests__/',
        '**/*.test.js',
        '**/*.spec.js',
        '**/mockData.js',
        'dist/',
        'build/',
        '.nuxt/',
        'coverage/'
      ],
      include: [
        'src/utils/**/*.js',
        'src/composables/**/*.js'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

// Made with Bob
