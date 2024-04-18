import { formatDuration, intervalToDuration } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function padTimestamp(time: number) {
  return Number((time).toString().padEnd(13, '0'))
}

export function parseDuration(start: Date, end: Date, options?: Parameters<typeof formatDuration>[1]) {
  const duration = intervalToDuration({ start, end })
  return formatDuration(duration, { locale: zhCN, ...options })
}
