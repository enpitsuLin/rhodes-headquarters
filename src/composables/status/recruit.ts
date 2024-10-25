import type { MaybeRefOrGetter } from '@vueuse/core'
import { useNow } from '@vueuse/core'
import type { Duration } from 'date-fns'
import { fromUnixTime, getUnixTime, intervalToDuration } from 'date-fns'
import { readableDate, readableDuration } from '~/utils/time'
import type { Recruit } from '~/types'

interface CompletedRecruit {
  status: 'completed'
  completedAt: Date
  readableCompletedAt: string
  remainDuration: Duration
  readableDuration: string
}

interface StandbyRecruit {
  status: 'standby'
  completedAt: null
  readableCompletedAt: null
  remainDuration: null
  readableDuration: null
}

interface RecruitingRecruit {
  status: 'recruiting'
  completedAt: Date
  readableCompletedAt: string
  remainDuration: Duration
  readableDuration: string
}

type RecruitState = CompletedRecruit | StandbyRecruit | RecruitingRecruit

function recruitStatus(recruit: Recruit, timestamp: number): RecruitState['status'] {
  if (recruit.state === 1) {
    return 'standby'
  }
  else if (recruit.state === 2) {
    if (timestamp - recruit.finishTs > 0)
      return 'completed'
    return 'recruiting'
  }
  else if (recruit.state === 3) {
    return 'completed'
  }

  throw new Error('Unexpected state')
}

function parseRecruit(recruit: Recruit, now: Date): RecruitState {
  const nowTimestamp = getUnixTime(now)

  const status = recruitStatus(toValue(recruit), nowTimestamp)

  const completedAt = status === 'standby'
    ? null
    : fromUnixTime(toValue(recruit).finishTs)

  const readableCompletedAt = completedAt
    ? readableDate(completedAt)
    : null

  const remainDuration = status === 'standby'
    ? null
    : intervalToDuration({
      start: now,
      end: fromUnixTime(toValue(recruit).finishTs),
    })

  const duration = remainDuration ? readableDuration(remainDuration, { format: ['hours', 'minutes'] }) : null

  return {
    status,
    completedAt,
    readableCompletedAt,
    remainDuration,
    readableDuration: duration,
  } as RecruitState
}

export function useRecruits(recruits: MaybeRefOrGetter<Recruit[]>) {
  const now = useNow()
  return computed(() => {
    return toValue(recruits).map(
      recruit =>
        parseRecruit(toValue(recruit), now.value),
    )
  })
}
