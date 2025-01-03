/// <reference lib="webworker"/>
import { debouncedWatch } from '@vueuse/core'
import { fromUnixTime } from 'date-fns'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { usePreference } from '~/composables/storages'
import { registerBackgroundService, registerNotificationService } from '~/service'

export default defineBackground({
  type: 'module',
  main: () => {
    const backgroundService = registerBackgroundService()
    const notificationService = registerNotificationService()

    const preference = usePreference()

    debouncedWatch(
      backgroundService.currentArknightCharacterInfo,
      (newInfo, oldInfo) => {
        notificationService.clearAlarmNotification()

        if (!newInfo)
          return
        if (oldInfo?.currentTs === newInfo.currentTs)
          return

        newInfo.recruit.forEach((recruit, index) => {
          notificationService.createAlarmNotification(
            `RECRUITS_${(index + 1) as 1 | 2 | 3 | 4}_ALARMS_NAME`,
            fromUnixTime(recruit.finishTs),
          )
        })

        notificationService.createAlarmNotification(
          'SANITY_ALARM_NAME',
          fromUnixTime(newInfo.status.ap.completeRecoveryTime),
        )
      },
      {
        immediate: true,
        debounce: 800,
      },
    )

    watch(
      preference,
      (newPref, oldPref) => {
        if (newPref?.periodInMinutes !== oldPref?.periodInMinutes)
          backgroundService.createRefreshAlarm(newPref?.periodInMinutes)
      },
      {
        immediate: true,
        deep: true,
      },
    )

    registerRoute(
      event => event.request.destination === 'image' && event.request.url.startsWith('https://web.hycdn.cn/arknights/'),
      new StaleWhileRevalidate(),
    )
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
