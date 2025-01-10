/// <reference lib="webworker"/>

import type { Preference } from '~/types'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { onMessage } from 'webext-bridge/background'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import * as API from './api'

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

    const preference = useWxtStorageAsync<Preference>(
      'PRRH:PREFERENCE',
      {
        periodInMinutes: 10,
        charactersAlarmsEnable: false,
      },
    )

    function refreshInfo() {
      // TODO 刷新角色信息
    }

    watch(
      () => preference.value.periodInMinutes,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          const duration = newValue * 60 * 1000
          jobScheduler.scheduleJob({
            id: 'refreshInfoJob',
            type: 'interval',
            duration,
            immediate: true,
            execute: refreshInfo,
          })
        }
      },
      { deep: true, immediate: true },
    )
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
