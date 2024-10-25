import type { Duration } from 'date-fns'
import { format, formatDuration, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function readableDate(date: Date) {
  return format(date, `${isToday(date) ? '\'今日\'' : '\'明日\''} HH 时 mm 分`)
}

export function readableDuration(duration: Duration, options?: Parameters<typeof formatDuration>[1]) {
  return formatDuration(duration, { locale: zhCN, zero: true, ...options })
}
