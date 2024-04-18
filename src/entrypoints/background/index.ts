/// <reference lib="webworker"/>
import { PORT_NAME } from '@/constsants'

export default defineBackground(() => {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== PORT_NAME)
      return

    port.onMessage.addListener((unknownMessage) => {
      const validateMessage = messageSchame.safeParse(unknownMessage)
      if (validateMessage.success) {
        const message = validateMessage.data

        if (message.type === 'login')
          logInOrRefreshAccount(message.data.token)
      }
    })
  })
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
