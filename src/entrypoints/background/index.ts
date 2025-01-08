/// <reference lib="webworker"/>
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

export default defineBackground({
  type: 'module',
  main: () => {
    registerRoute(
      event => event.request.destination === 'image' && event.request.url.startsWith('https://web.hycdn.cn/arknights/'),
      new StaleWhileRevalidate(),
    )
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
