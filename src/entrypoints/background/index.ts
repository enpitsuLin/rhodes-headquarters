/// <reference lib="webworker"/>
import { registerAccountService } from '@/utils/proxy-service'

export default defineBackground(() => {
  registerAccountService()
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
