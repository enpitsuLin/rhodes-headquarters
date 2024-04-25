import type { Duration } from 'date-fns'
import { format, formatDuration, intervalToDuration, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function parseDuration(start: Date, end: Date, options?: Parameters<typeof formatDuration>[1]) {
  const duration = intervalToDuration({ start, end })
  return formatDuration(duration, { locale: zhCN, ...options })
}

export function humanReadableDate(date: Date) {
  return format(date, `${isToday(date) ? '\'今天\'' : '\'明天\''} HH 时 mm 分`)
}

export function humanReadableDuration(duration: Duration, options?: Parameters<typeof formatDuration>[1]) {
  return formatDuration(duration, { locale: zhCN, ...options })
}
