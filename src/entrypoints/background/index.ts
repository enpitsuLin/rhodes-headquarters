/// <reference lib="webworker"/>
import { fromUnixTime } from 'date-fns'
import { chararcterStorage } from '@/store/info'
import { preferenceStorage } from '@/store/preference'
import { registerAccountService } from '@/utils/proxy-service'

export default defineBackground({
  type: 'module',
  main: () => {
    const accountService = registerAccountService()

    const notificationServie = registerNotificationService()

    accountService.createRefreshInfoAlarm()

    preferenceStorage.watch((value, oldValue) => {
      if (oldValue.periodInMinutes !== value.periodInMinutes)
        accountService.createRefreshInfoAlarm()
    })

    chararcterStorage.watch((value) => {
      if (value) {
        value.recruit.forEach((recruit, index) => {
          notificationServie.createAlarmNotification(
          `RECRUITS_${(index + 1) as 1 | 2 | 3 | 4}_ALARMS_NAME`,
          fromUnixTime(recruit.finishTs),
          )
        })

        notificationServie.createAlarmNotification(
          'SANITY_ALARM_NAME',
          fromUnixTime(value.status.ap.completeRecoveryTime),
        )
      }
      else {
        notificationServie.clearAlarmNotification()
      }
    })
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
