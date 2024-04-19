import type { Runtime } from 'wxt/browser'
import { z } from 'zod'

export type MessageLisenter = (message: Message, port: Runtime.Port) => void

export interface Message<T = unknown> {
  type: string
  data?: T
}

export const messageSchame = z.object({
  type: z.string(),
  data: z.any().optional(),
  returnMessage: z.string().optional(),
})

export function createMessage<T = unknown>(type: string, data?: T) {
  return {
    type,
    data,
  }
}

export function sendMessage<Data, Return = void>(
  port: Runtime.Port,
  message: Message<Data>,
) {
  const returnMessage = `${message.type}:resolved`
  const extendsMessage = Object.assign(message, { returnMessage })

  return new Promise<Return>((resolve) => {
    const onMessage = (message: Message<Return>) => {
      if (message.type === returnMessage)
        resolve(message.data!)

      port.onMessage.hasListener(onMessage) && port.onMessage.removeListener(onMessage)
    }
    port.onMessage.addListener(onMessage)
    port.postMessage(extendsMessage)
  })
}
