import { formatDate, useNow } from '@vueuse/core'
import type { PlayerStatusAp } from '~/types'

function convertDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000)

  const hours = Math.floor(totalSeconds / 3600)

  const secondsLeft = totalSeconds % 3600

  const minutes = Math.floor(secondsLeft / 60)

  return `${hours}时${minutes}分`
}

export function useApInfo(ap: PlayerStatusAp) {
  const completeRecoveryTime = Number((ap.completeRecoveryTime).toString().padEnd(13, '0'))

  const now = useNow()
  const completeRecovery = new Date(completeRecoveryTime)

  const spendTime = computed(() => convertDuration(+completeRecovery - +now.value))

  const nowDate = computed(() => formatDate(now.value, 'YYYY MM DD'))
  const completeRecoveryDate = formatDate(completeRecovery, 'YYYY MM DD')

  const recoveryDesc = computed(() => `${nowDate.value === completeRecoveryDate ? '今日' : '明日'} ${formatDate(completeRecovery, 'H[时]mm[分]')}`)
  return { recoveryDesc, spendTime }
}
