/// <reference lib="webworker"/>

import type { BindingInfo, Preference } from '~/types'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { fromUnixTime } from 'date-fns'
import { onMessage } from 'webext-bridge/background'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import * as API from './api'
import { mergeRecruits } from './utils/recruit'

export default defineBackground({
  type: 'module',
  main: () => {
    const jobScheduler = defineJobScheduler()

    registerRoute(
      event => event.request.destination === 'image' && event.request.url.startsWith('https://web.hycdn.cn/arknights/'),
      new StaleWhileRevalidate(),
    )

    const currentUid = useWxtStorageAsync<string | null>('PRRH:ARKNIGHT_CHARACTER_CURRENT', '')
    const infoMapping = useWxtStorageAsync<Record<string, BindingInfo>>('PRRH:ARKNIGHT_ACCOUNTS_INFO', {})

    const currentAccount = computed(() => {
      if (!currentUid.value)
        return null

      return infoMapping.value[currentUid.value]
    })

    watch(currentAccount, (account) => {
      if (!account)
        return

      const completeRecoveryTime = account.status.ap.completeRecoveryTime
      if (!completeRecoveryTime)
        return

      jobScheduler.scheduleJob({
        id: 'sanity-restore',
        type: 'once',
        date: fromUnixTime(completeRecoveryTime),
        execute: () => {
          // TODO 理智完全恢复的通知
          Logger.log('理智完全恢复')
        },
      })

      const recruits = mergeRecruits(account.recruit)
      recruits.forEach((recruit) => {
        jobScheduler.scheduleJob({
          id: `recruit-${recruit.startTs}`,
          type: 'once',
          date: recruit.date,
          execute: () => {
            // TODO 公招结束的通知
            Logger.log('公招结束', recruit.title)
          },
        })
      })
    })

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
