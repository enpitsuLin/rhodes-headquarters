import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'wxt/browser'
import { isFirefox, isForbiddenUrl } from '@/utils/env'

export default defineBackground(() => {
  // only on dev mode
  if (import.meta.hot) {
    // load latest content script
    // Firefox fetch files from cache instead of reloading changes from disk,
    // hmr will not work as Chromium based browser
    browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
      // Filter out non main window events.
      if (frameId !== 0)
        return

      if (isForbiddenUrl(url))
        return

      // inject the latest scripts
      browser.tabs.executeScript(tabId, {
        file: `${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`,
        runAt: 'document_end',
      }).catch(error => console.error(error))
    })
  }

  browser.runtime.onInstalled.addListener((): void => {
    // eslint-disable-next-line no-console
    console.log('Extension installed')
  })

  let previousTabId = 0

  // communication example: send previous tab title from background page
  // see shim.d.ts for type declaration
  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    if (!previousTabId) {
      previousTabId = tabId
      return
    }

    let tab: Tabs.Tab

    try {
      tab = await browser.tabs.get(previousTabId)
      previousTabId = tabId
    }
    catch {
      return
    }

    // eslint-disable-next-line no-console
    console.log('previous tab', tab)
    sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
  })

  onMessage('get-current-tab', async () => {
    try {
      const tab = await browser.tabs.get(previousTabId)
      return {
        title: tab?.title,
      }
    }
    catch {
      return {
        title: undefined,
      }
    }
  })
})
