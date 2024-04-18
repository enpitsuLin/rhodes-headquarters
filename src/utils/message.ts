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
})

export function createMessage<T = unknown>(type: string, data?: T) {
  return {
    type,
    data,
  }
}
