import type { InjectionKey } from 'vue'
import { createToaster } from '@ark-ui/vue'
import { inject } from 'vue'

const ToastInjectKey = Symbol('ToastContext') as InjectionKey<ReturnType<typeof createToaster>>

interface Options extends Omit<Parameters<ReturnType<typeof createToaster>['create']>[0], 'title' | 'description'> {
  title: string
  description?: string
}

interface Toast {
  toaster: ReturnType<typeof createToaster>
  create: (options: Options) => Promise<string | undefined>
}

export function useToast() {
  const api = inject(ToastInjectKey)!

  const toast: Toast = {
    async create(options) {
      return api.create(options)
    },
    toaster: api,
  }

  return toast
}

let _id = 0

export function provideToastContext() {
  const toaster = createToaster({
    id: (++_id).toString(),
    overlap: true,
    offsets: '24px',
    placement: 'bottom-end',
    removeDelay: 200,
    max: 5,
  })

  provide(ToastInjectKey, toaster)
}
