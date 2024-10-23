/// <reference lib="webworker"/>
import { registerAccountService } from '@/service'
import { preferenceStorage } from '@/store/preference'

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
