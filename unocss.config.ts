import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import type { Theme } from 'unocss/preset-mini'

export default defineConfig<Theme>({
  theme: {
    colors: {
      'primary': '#22bbff',
      'foreground': '#fefefe',
      'foreground-secondary': '#9a9a9a',
      'background': '#121212',
    },
    fontFamily: {
      bender: 'Bender, sans-serif',
    },
  },
  shortcuts: {
    'bg-main': 'bg-#121212 c-foreground',
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
