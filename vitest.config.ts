import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '~': resolve('src'),
      'background': resolve('src/entrypoints/background'),
    },
  },
})
