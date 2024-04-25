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
          notificationServie.createPeriod(
          `RECRUITS_${index as 1 | 2 | 3 | 4}_ALARMS_NAME`,
          fromUnixTime(recruit.finishTs),
          )
        })

        notificationServie.createPeriod(
          'SANITY_ALARM_NAME',
          fromUnixTime(value.status.ap.completeRecoveryTime),
        )
      }
      else {
        notificationServie.clearPeriod()
      }
    })
  },
})

declare module '.' {
  const globalThis: ServiceWorkerGlobalScope
}
