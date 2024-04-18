/// <reference lib="webworker"/>
import { PORT_NAME } from '@/constsants'

export default defineBackground(() => {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== PORT_NAME)
      return

    port.onMessage.addListener(async (unknownMessage) => {
      const validateMessage = messageSchame.safeParse(unknownMessage)
      if (validateMessage.success) {
        const message = validateMessage.data

        const maybeResolvedValue = await Promise.resolve<any | void>(
          new Promise<any | void>((resolve) => {
            if (message.type === 'login') {
              logInOrRefreshAccount(message.data.token).then(() => {
                // @ts-expect-error: void already added
                resolve()
              })
            }
          }),
        )
        if (message.returnMessage) {
          port.postMessage(
            createMessage(message.returnMessage as string, maybeResolvedValue),
          )
        }
      }
    })
  })
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
