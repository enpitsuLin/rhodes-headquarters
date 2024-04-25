import { useNow } from '@vueuse/core'
import type { Duration } from 'date-fns'
import { add, differenceInMinutes, format, fromUnixTime, intervalToDuration } from 'date-fns'
import type { ActionPoint } from '~/types'
import { humanReadableDate, humanReadableDuration, parseDuration } from '~/utils/time'

const TIME_PRE_AP = 6 * 60 * 1000

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
        readable: humanReadableDate(completeRecoveryDate),
      },
      duration: {
        value: completeRecoveryDuration,
        readable: humanReadableDuration(completeRecoveryDuration, { format: ['hours', 'minutes'] }),
      },
    }
  })

  const nextAdd = computed<DateAndDurationInfo>(() => {
    const nextAddDate = add(lastAddDate, { minutes: MINUTES_PRE_AP * (current.value + 1 - sanity.current) })
    const nextAddDuration = intervalToDuration({
      start: now.value,
      end: nextAddDate,
    })
    return {
      date: {
        value: nextAddDate,
        readable: humanReadableDate(nextAddDate),
      },
      duration: {
        value: nextAddDuration,
        readable: humanReadableDuration(nextAddDuration),
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

export function useApInfo(ap: ActionPoint) {
  const completeRecoveryTime = fromUnixTime(ap.completeRecoveryTime)

  const now = useNow()
  const completeRecovery = new Date(completeRecoveryTime)

  const spendTime = computed(() => parseDuration(now.value, completeRecovery, { format: ['hours', 'minutes'] }))

  const nowDate = computed(() => format(now.value, 'yyyy MM dd'))
  const completeRecoveryDate = format(completeRecovery, 'yyyy MM dd')

  const recoveryDesc = computed(() => `${nowDate.value === completeRecoveryDate ? '今日' : '明日'} ${format(completeRecovery, 'H时mm分')}`)

  const max = ap.max
  const current = computed(() => {
    const calcCurrent = Math.floor((+now.value - +fromUnixTime(ap.lastApAddTime)) / TIME_PRE_AP) + ap.current
    return calcCurrent > max ? max : calcCurrent
  })

  const nextApAdd = computed(() => new Date((current.value + 1 - ap.current) * TIME_PRE_AP + +fromUnixTime(ap.lastApAddTime)))

  const nextApAddTime = computed(() => parseDuration(now.value, nextApAdd.value) || '0 秒')

  return {
    recoveryDesc,
    spendTime,
    nextApAddTime,
    current,
    max,
  }
}
