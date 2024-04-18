/// <reference lib="webworker"/>
import { Buffer } from 'buffer/'
import { createApp as createH3App, createRouter, toWebHandler, useBase } from 'h3'
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
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
