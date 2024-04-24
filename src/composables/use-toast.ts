import * as toast from '@zag-js/toast'
import type { Options } from '@zag-js/toast'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

const ToastInjectKey = Symbol('ToastContext') as InjectionKey<ComputedRef<toast.GroupApi>>

interface Toast {
  api: ComputedRef<toast.GroupApi>
  create: (options: Options<string>) => Promise<string | undefined>
}

async function isPopUp() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  const views = browser.extension.getViews()

  return (views.filter(view => view !== window).length > 0)
    || tabs.at(0)?.url !== location.href
}

export function useToast() {
  const api = inject(ToastInjectKey)!

  const toast: Toast = {
    async create(options: Options<string>) {
      if (await isPopUp()) {
        return await browser.notifications.create({
          type: 'basic',
          title: options.title ?? '',
          message: options.description ?? '',
          iconUrl: browser.runtime.getURL('/icon.svg'),
        })
      }
      return api.value.create(options)
    },
    api,
  }

  return toast
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
