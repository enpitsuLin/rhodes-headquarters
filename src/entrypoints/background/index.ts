/// <reference lib="webworker"/>
import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'wxt/browser'
import { handleApiCall } from '~/api'

export default defineBackground(() => {
  globalThis.addEventListener('fetch', async (event) => {
    const { pathname } = new URL(event.request.url)
    if (pathname.startsWith('/api'))
      event.respondWith(handleApiCall(event))
  })

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

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
