/* eslint-disable no-console */

export default defineContentScript({
  main() {
    console.info('[skland-webext] init')
  },
  matches: ['<all_urls>'],
})
