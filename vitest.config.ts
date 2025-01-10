import { resolve } from 'node:path'
import { WxtVitest } from 'wxt/testing'
import { defineConfig } from 'vitest/config'

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
