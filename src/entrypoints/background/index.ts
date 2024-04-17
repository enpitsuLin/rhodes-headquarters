/// <reference lib="webworker"/>
import { createApp as createH3App, createRouter, toWebHandler, useBase } from 'h3'
import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'wxt/browser'
import { Buffer } from 'buffer/'
import authHandler from '~/api/auth'
import meHandler from '~/api/me'
import middleware from '~/api/middleware'

// @ts-expect-error: shim buffer
// eslint-disable-next-line node/prefer-global/buffer
globalThis.Buffer = Buffer

export default defineBackground(() => {
  const app = createH3App({
    debug: true,
  })

  const router = createRouter()
  const apiRouter = createRouter()

  apiRouter.use('/auth', authHandler)
  apiRouter.use('/me', meHandler)

  router.use('/api/**', useBase('/api', apiRouter.handler))

  app.use(middleware)
  app.use(router.handler)

  const handler = toWebHandler(app)

  globalThis.addEventListener('fetch', async (event) => {
    const { pathname, protocol } = new URL(event.request.url)
    if (
      pathname.startsWith('/api')
      && protocol === 'chrome-extension:'
    )
      event.respondWith(handler(event.request))
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
