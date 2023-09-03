import { formatDate, useNow } from '@vueuse/core'
import { formatDuration, intervalToDuration } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PlayerStatusAp } from '~/types'

const TIME_PRE_AP = 6 * 60 * 1000

function padTimestamp(time: number) {
  return Number((time).toString().padEnd(13, '0'))
}

function parseDuration(start: Date, end: Date, format?: string[]) {
  const duration = intervalToDuration({ start, end })
  return formatDuration(duration, { locale: zhCN, format, zero: true })
}

export function useApInfo(ap: PlayerStatusAp) {
  const completeRecoveryTime = padTimestamp(ap.completeRecoveryTime)

  const now = useNow()
  const completeRecovery = new Date(completeRecoveryTime)

  const spendTime = computed(() => parseDuration(now.value, completeRecovery, ['hours', 'minutes']))

  const nowDate = computed(() => formatDate(now.value, 'YYYY MM DD'))
  const completeRecoveryDate = formatDate(completeRecovery, 'YYYY MM DD')

  const recoveryDesc = computed(() => `${nowDate.value === completeRecoveryDate ? '今日' : '明日'} ${formatDate(completeRecovery, 'H[时]mm[分]')}`)

  const max = ap.max
  const current = computed(() => {
    return Math.floor((+now.value - padTimestamp(ap.lastApAddTime)) / TIME_PRE_AP) + ap.current
  })

  const nextApAdd = new Date((current.value + 1 - ap.current) * TIME_PRE_AP + padTimestamp(ap.lastApAddTime))

  const nextApAddTime = computed(() => parseDuration(now.value, nextApAdd))

  return {
    recoveryDesc,
    spendTime,
    nextApAddTime,
    current,
    max,
  }
}
