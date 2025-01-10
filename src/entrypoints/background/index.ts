/// <reference lib="webworker"/>

import { defineJobScheduler } from 'background/utils/job'
import { onMessage } from 'webext-bridge/background'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import * as API from './api'
import { useBackgroundJobs } from './composables/jobs'

export default defineBackground({
  type: 'module',
  main: () => {
    const jobScheduler = defineJobScheduler()

    registerRoute(
      event => event.request.destination === 'image' && event.request.url.startsWith('https://web.hycdn.cn/arknights/'),
      new StaleWhileRevalidate(),
    )

    onMessage('api:hypergrayph:gen-scan-login-url', () => API.hypergrayph.genScanLoginUrl())
    onMessage('api:hypergrayph:get-scan-status', message => API.hypergrayph.getScanStatus(message.data))
    onMessage('api:hypergrayph:get-oauth-token-by-scan-code', message => API.hypergrayph.getOAuthTokenByScanCode(message.data))

    onMessage('api:skland:grant-authorize-code', message => API.hypergrayph.grantAuthorizeCode(message.data))
    onMessage('api:skland:generate-cred-by-code', message => API.skland.generateCredByCode(message.data))
    onMessage('api:skland:get-player-binding', message => API.skland.getPlayerBinding(message.data))
    onMessage('api:skland:get-binding-info', message => API.skland.getBindingInfo(message.data))

    const { runAllJobs } = useBackgroundJobs(jobScheduler)

    browser.runtime.onInstalled.addListener(async (details) => {
      if (
        details.reason === 'update'
        && details.previousVersion !== browser.runtime.getManifest().version
      ) {
        // 更新后清理 alarms
        Logger.log('扩展已更新', `从 ${details.previousVersion} 更新到 ${browser.runtime.getManifest().version}`)
        await browser.alarms.clearAll()
        runAllJobs()
      }
    })
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
