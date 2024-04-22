import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import type { Theme } from 'unocss/preset-mini'

export default defineConfig<Theme>({
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'src/components/**/*.ts',
      ],
    },
  },
  theme: {
    colors: {
      primary: 'hsl(211 57% 58)',
      foreground: 'hsl(var(--foreground))',
      background: 'hsl(var(--background))',
      border: 'hsl(var(--border))',
    },
    fontFamily: {
      bender: 'Bender, sans-serif',
    },
  },
  shortcuts: {
    'bg-main': 'bg-background c-foreground',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
