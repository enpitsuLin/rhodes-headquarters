import * as toast from '@zag-js/toast'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

const ToastInjectKey = Symbol('ToastContext') as InjectionKey<ComputedRef<toast.GroupApi>>

export function useToast() {
  const api = inject(ToastInjectKey)!

  // @ts-expect-error: Proxy
  const proxyToast: toast.GroupApi = new Proxy(
    {},
    {
      get(_target, p) {
        if (Reflect.has(api.value, p))
          return api.value[p as keyof toast.GroupApi]
      },
    },
  )
  return proxyToast
}

let _id = 0

export function provideToastContext() {
  const [state, send] = useMachine(toast.group.machine({
    id: (++_id).toString(),
    overlap: true,
    offsets: '24px',
    placement: 'bottom-end',
    removeDelay: 200,
    max: 5,
  }))
  const toastApi = computed(() => toast.group.connect(state.value, send, normalizeProps))

  provide(ToastInjectKey, toastApi)
}
