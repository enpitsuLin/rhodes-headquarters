import { useNow } from '@vueuse/core'
import type { Duration } from 'date-fns'
import { add, differenceInMinutes, fromUnixTime, intervalToDuration } from 'date-fns'
import type { ActionPoint } from '~/types'
import { readableDate, readableDuration } from '~/utils/time'

const MINUTES_PRE_AP = 6

interface DateAndDurationInfo {
  date: {
    value: Date
    readable: string
  }
  duration: {
    value: Duration
    readable: string
  }
}

interface UseSanityInfoReturn {
  max: ComputedRef<number>
  current: ComputedRef<number>
  completeRecovery: ComputedRef<DateAndDurationInfo>
  nextAdd: ComputedRef<DateAndDurationInfo>
}

export function useSanityInfo(sanity: ActionPoint): UseSanityInfoReturn {
  const now = useNow()

  const max = computed(() => sanity.max)
  const lastAddDate = fromUnixTime(sanity.lastApAddTime)

  const lasAddDateMinutesGoes = computed(() => differenceInMinutes(now.value, lastAddDate))

  const current = computed(() => {
    const calcCurrent = Math.floor(lasAddDateMinutesGoes.value / MINUTES_PRE_AP) + sanity.current
    return calcCurrent > max.value ? max.value : calcCurrent
  })

  const completeRecovery = computed<DateAndDurationInfo>(() => {
    const completeRecoveryDate = fromUnixTime(sanity.completeRecoveryTime)
    const completeRecoveryDuration = intervalToDuration({
      start: now.value,
      end: completeRecoveryDate,
    })
    return {
      date: {
        value: completeRecoveryDate,
        readable: readableDate(completeRecoveryDate),
      },
      duration: {
        value: completeRecoveryDuration,
        readable: readableDuration(completeRecoveryDuration, { format: ['hours', 'minutes'] }),
      },
    }
  })

  const nextAdd = computed<DateAndDurationInfo>(() => {
    const nextAddDate = add(lastAddDate, { minutes: MINUTES_PRE_AP * (current.value + 1 - sanity.current) })
    const nextAddDuration = intervalToDuration({
      start: now.value,
      end: nextAddDate,
    })
    if (!nextAddDuration.seconds)
      nextAddDuration.seconds = 0
    return {
      date: {
        value: nextAddDate,
        readable: readableDate(nextAddDate),
      },
      duration: {
        value: nextAddDuration,
        readable: readableDuration(nextAddDuration, { format: ['minutes', 'seconds'], zero: true }),
      },
    }
  })

  return {
    max,
    current,
    completeRecovery,
    nextAdd,
  }
}
