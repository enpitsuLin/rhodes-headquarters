import type { Fn } from '@vueuse/core'
import type { Runtime } from 'wxt/browser'
import type { Message, MessageLisenter } from '~/utils/message'

export const PORT_INJECT_KEY: InjectionKey<Runtime.Port> = Symbol('PORT')

export function usePort() {
  const port = inject(PORT_INJECT_KEY)
  if (!port)
    throw new Error('port not found')

  return port
}

export function usePortMessageLisenter(onMessage: MessageLisenter): Fn
export function usePortMessageLisenter(type: string, onMessage: MessageLisenter): Fn
export function usePortMessageLisenter(...params: any[]): Fn {
  const type: string | null = params.length === 2 ? params[0] : null
  const onMessage: MessageLisenter = params.length === 2 ? params[1] : params[0]

  const port = usePort()
  const listener = (message: Message, port: Runtime.Port) => {
    if ((type !== null ? message.type === type : true))
      onMessage(message, port)
  }
  onMounted(() => {
    port.onMessage.addListener(listener)
  })
  onUnmounted(() => {
    if (port.onMessage.hasListener(listener))
      port.onMessage.removeListener(listener)
  })

  return () => {
    if (port.onMessage.hasListener(listener))
      port.onMessage.removeListener(listener)
  }
}
