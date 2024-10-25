/// <reference lib="webworker"/>
import { registerAccountService } from '~/service'

export default defineBackground({
  type: 'module',
  main: () => {
    const accountService = registerAccountService()

    accountService.createRefreshInfoAlarm()
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
