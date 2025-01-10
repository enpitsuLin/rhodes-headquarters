import type { Duration, FormatDurationOptions } from 'date-fns'
import type { ActionPoint } from '~/types'
import { useNow } from '@vueuse/core'
import { add, differenceInMinutes, fromUnixTime, intervalToDuration } from 'date-fns'
import { readableDate, readableDuration } from '~/utils/time'

const MINUTES_PER_AP = 6

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

export function useSanityInfo(ap: MaybeRefOrGetter<ActionPoint>): UseSanityInfoReturn {
  const now = useNow()
  const sanity = computed(() => toValue(ap))
  const max = computed(() => sanity.value.max)

  const lastAddDate = computed(() => fromUnixTime(sanity.value.lastApAddTime))

  const minutesElapsed = computed(() => differenceInMinutes(now.value, lastAddDate.value))

  const current = computed(() => {
    const calcCurrent = Math.floor(minutesElapsed.value / MINUTES_PER_AP) + sanity.value.current
    return Math.min(calcCurrent, max.value)
  })

  const createDateAndDurationInfo = (date: Date, durationOptions?: FormatDurationOptions): DateAndDurationInfo => {
    const duration = intervalToDuration({ start: now.value, end: date })

    return {
      date: {
        value: date,
        readable: readableDate(date),
      },
      duration: {
        value: duration,
        readable: readableDuration(duration, durationOptions),
      },
    }
  }

  const completeRecoveryDate = computed(() => fromUnixTime(sanity.value.completeRecoveryTime))
  const completeRecovery = computed<DateAndDurationInfo>(() =>
    createDateAndDurationInfo(
      completeRecoveryDate.value,
      { format: ['hours', 'minutes'] },
    ),
  )

  const nextAddDate = computed(() => add(lastAddDate.value, {
    minutes: MINUTES_PER_AP * (current.value + 1 - sanity.value.current),
  }))

  const nextAdd = computed<DateAndDurationInfo>(() => {
    const info = createDateAndDurationInfo(
      nextAddDate.value,
      { format: ['minutes', 'seconds'], zero: true },
    )
    if (!info.duration.value.seconds)
      info.duration.value.seconds = 0
    return info
  })

  return {
    max,
    current,
    completeRecovery,
    nextAdd,
  }
}
