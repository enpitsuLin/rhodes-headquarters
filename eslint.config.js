import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  ignores: [
    'dist',
    'node_modules',
    'public',
    '*.woff',
    '*.svg',
    '*.png',
    '*.jpg',
  ],
})
