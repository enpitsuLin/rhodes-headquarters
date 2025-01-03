import type { Theme } from 'unocss/preset-mini'
import { presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { defineConfig } from 'unocss/vite'

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
      'primary': 'hsl(211 57% 58)',
      'foreground': 'hsl(var(--foreground))',
      'background': 'hsl(var(--background))',
      'secondary-background': 'hsl(var(--secondary-background))',
      'border': 'hsl(var(--border))',
      'list-item': 'hsl(var(--list-item))',
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
    presetAnimations(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
