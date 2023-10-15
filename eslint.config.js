const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
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
