import * as toast from '@zag-js/toast'
import type { Options } from '@zag-js/toast'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import type { Alarms } from 'wxt/browser'
import { getNotificationService } from '@/utils/proxy-service'

const ToastInjectKey = Symbol('ToastContext') as InjectionKey<ComputedRef<toast.GroupApi>>

interface Toast {
  api: ComputedRef<toast.GroupApi>
  create: (options: Options<string> & {
    /**
     * enable notification
     * @default true
     */
    notification?: boolean
    alarmOptions?: Alarms.CreateAlarmInfoType
  }) => Promise<string | undefined>
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
    async create({ notification = true, alarmOptions, ...options }) {
      if (notification) {
        if (await isPopUp()) {
          return getNotificationService().create(
            options.title ?? '',
            options.description ?? '',
            alarmOptions,
          )
        }
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
