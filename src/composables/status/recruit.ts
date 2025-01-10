import type { MaybeRefOrGetter } from '@vueuse/core'
import type { Duration } from 'date-fns'
import type { Recruit } from '~/types'
import { useNow } from '@vueuse/core'
import { fromUnixTime, getUnixTime, intervalToDuration } from 'date-fns'
import { readableDate, readableDuration } from '~/utils/time'

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

interface LockedRecruit {
  status: 'locked'
}

export type RecruitState = CompletedRecruit | StandbyRecruit | RecruitingRecruit | LockedRecruit

function recruitStatus(recruit: Recruit, timestamp: number): RecruitState['status'] {
  switch (recruit.state) {
    case 1:
      return 'standby'
    case 2:
      return timestamp - recruit.finishTs > 0 ? 'completed' : 'recruiting'
    case 3:
      return 'completed'
    case 0:
      return 'locked'
    default:
      throw new Error('Unexpected state')
  }
}

function parseRecruit(recruit: Recruit, now: Date): RecruitState {
  const recruitValue = toValue(recruit)
  const nowTimestamp = getUnixTime(now)
  const status = recruitStatus(recruitValue, nowTimestamp)

  if (status === 'locked') {
    return { status }
  }

  if (status === 'standby') {
    return {
      status,
      completedAt: null,
      readableCompletedAt: null,
      remainDuration: null,
      readableDuration: null,
    }
  }

  const completedAt = fromUnixTime(recruitValue.finishTs)
  const remainDuration = intervalToDuration({
    start: now,
    end: completedAt,
  })

  return {
    status,
    completedAt,
    readableCompletedAt: readableDate(completedAt),
    remainDuration,
    readableDuration: readableDuration(remainDuration, { format: ['hours', 'minutes'] }),
  }
}

export function useRecruits(recruits: MaybeRefOrGetter<Recruit[]>) {
  const now = useNow()
  return computed(() => toValue(recruits).map(recruit => parseRecruit(recruit, now.value)))
}
