import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { WxtVitest } from 'wxt/testing'

export default defineConfig({
  plugins: [WxtVitest()],
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
