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
        'components/**/*.ts',
      ],
    },
  },
  theme: {
    colors: {
      primary: '#22bbff',
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
