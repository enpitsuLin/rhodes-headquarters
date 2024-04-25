/// <reference lib="webworker"/>
import { preferenceStorage } from '@/store/preference'
import { registerAccountService } from '@/utils/proxy-service'

export default defineBackground({
  type: 'module',
  main: () => {
    const accountService = registerAccountService()

    accountService.createRefreshInfoAlarm()

    preferenceStorage.watch((value, oldValue) => {
      if (oldValue.periodInMinutes !== value.periodInMinutes)
        accountService.createRefreshInfoAlarm()
    })
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
