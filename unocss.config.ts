import { h } from '@unocss/preset-mini/utils'
import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import type { Theme } from 'unocss/preset-mini'

function handleMatchNumber(v: string, defaultVal = '0') {
  return h.number(v || defaultVal)
}

function handleMatchRem(v: string, defaultVal = 'full') {
  return h.rem(v || defaultVal)
}

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
  rules: [
    [
      'animate-in',
      {
        'animation-name': 'animate-enter',
        'animation-duration': 'var(--un-animate-duration)',
        '--un-animate-duration': '150ms',
        '--un-enter-opacity': 'initial',
        '--un-enter-scale': 'initial',
        '--un-enter-rotate': 'initial',
        '--un-enter-translate-x': 'initial',
        '--un-enter-translate-y': 'initial',
      },
    ],
    [
      'animate-out',
      {
        'animation-name': 'animate-exit',
        'animation-duration': 'var(--un-animate-duration)',
        '--un-animate-duration': '150ms',
        '--un-exit-opacity': 'initial',
        '--un-exit-scale': 'initial',
        '--un-exit-rotate': 'initial',
        '--un-exit-translate-x': 'initial',
        '--un-exit-translate-y': 'initial',
      },
    ],
    [
      'animate-shake',
      {
        'animation-name': 'animate-shaking',
        'animation-duration': 'var(--un-animate-duration)',
        'animation-iteration-count': 'var(--un-animate-iteration-count, 2)',
        '--un-animate-duration': '150ms',
        '--un-from-translate-x': 'initial',
        '--un-to-translate-x': 'initial',
      },
    ],
    [
      'animate-loading',
      {
        'animation-name': 'loading',
        'animation-duration': 'var(--un-animate-duration)',
        'animation-iteration-count': 'infinite',
        'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
        '--un-animate-duration': '700ms',
      },
    ],
    [/^fade-in-?(.+)?$/, ([, d]) => ({ '--un-enter-opacity': `${Number(handleMatchNumber(d) || 0) / 100}` })],
    [/^fade-out-?(.+)?$/, ([, d]) => ({ '--un-exit-opacity': `${Number(handleMatchNumber(d) || 0) / 100}` })],
    [/^zoom-in-?(.+)?$/, ([, d]) => ({ '--un-enter-scale': `${Number(handleMatchNumber(d) || 0) / 100}` })],
    [/^zoom-out-?(.+)?$/, ([, d]) => ({ '--un-exit-scale': `${Number(handleMatchNumber(d) || 0) / 100}` })],
    [/^spin-in-?(.+)?$/, ([, d]) => ({ '--un-enter-rotate': `${Number(handleMatchNumber(d) || 0)}deg` })],
    [/^spin-out-?(.+)?$/, ([, d]) => ({ '--un-exit-rotate': `${Number(handleMatchNumber(d) || 0)}deg` })],
    [/^slide-in-from-top-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-y': `-${handleMatchRem(d)}` })],
    [/^slide-in-from-bottom-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-y': handleMatchRem(d) })],
    [/^slide-in-from-left-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-x': `-${handleMatchRem(d)}` })],
    [/^slide-in-from-right-?(.+)?$/, ([, d]) => ({ '--un-enter-translate-x': handleMatchRem(d) })],
    [/^slide-out-to-top-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-y': `-${handleMatchRem(d)}` })],
    [/^slide-out-to-bottom-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-y': handleMatchRem(d) })],
    [/^slide-out-to-left-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-x': `-${handleMatchRem(d)}` })],
    [/^slide-out-to-right-?(.+)?$/, ([, d]) => ({ '--un-exit-translate-x': handleMatchRem(d) })],
  ],
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
