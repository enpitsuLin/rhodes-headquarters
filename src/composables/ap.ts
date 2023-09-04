import { useNow } from '@vueuse/core'
import { format } from 'date-fns'
import { padTimestamp, parseDuration } from '~/logic/time'
import type { PlayerStatusAp } from '~/types'

const TIME_PRE_AP = 6 * 60 * 1000

export function useApInfo(ap: PlayerStatusAp) {
  const completeRecoveryTime = padTimestamp(ap.completeRecoveryTime)

  const now = useNow()
  const completeRecovery = new Date(completeRecoveryTime)

  const spendTime = computed(() => parseDuration(now.value, completeRecovery, { format: ['hours', 'minutes'] }))

  const nowDate = computed(() => format(now.value, 'yyyy MM dd'))
  const completeRecoveryDate = format(completeRecovery, 'yyyy MM dd')

  const recoveryDesc = computed(() => `${nowDate.value === completeRecoveryDate ? '今日' : '明日'} ${format(completeRecovery, 'H时mm分')}`)

  const max = ap.max
  const current = computed(() => {
    const calcCurrent = Math.floor((+now.value - padTimestamp(ap.lastApAddTime)) / TIME_PRE_AP) + ap.current
    return calcCurrent > max ? max : calcCurrent
  })

  const nextApAdd = computed(() => new Date((current.value + 1 - ap.current) * TIME_PRE_AP + padTimestamp(ap.lastApAddTime)))

  const nextApAddTime = computed(() => parseDuration(now.value, nextApAdd.value) || '0 秒')

  return {
    recoveryDesc,
    spendTime,
    nextApAddTime,
    current,
    max,
  }
}
