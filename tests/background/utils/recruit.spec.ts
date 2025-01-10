import type { Recruit } from '~/types'
import { getUnixTime } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { mergeRecruits } from '~/entrypoints/background/utils/recruit'

describe('mergeRecruits', () => {
  it('应该正确合并时间相近的公招任务', () => {
    const date1 = new Date(2025, 1, 1, 11, 30, 0)
    const date2 = new Date(2025, 1, 1, 11, 31, 0)
    const date3 = new Date(2025, 1, 1, 11, 45, 0)

    const mockRecruits: Recruit[] = [
      {
        startTs: 1710000000,
        finishTs: getUnixTime(date1),
        state: 1,
      },
      {
        startTs: 1710000000,
        finishTs: getUnixTime(date2),
        state: 1,
      },
      {
        startTs: 1710000000,
        finishTs: getUnixTime(date3),
        state: 1,
      },
    ]

    const result = mergeRecruits(mockRecruits)

    // 期望结果：应该合并为2个任务
    expect(result).toHaveLength(2)

    // 检查第一个合并后的任务
    expect(result[0].title).toBe('公招栏位1, 公招栏位2')
    expect(result[0].date).toEqual(date2)

    // 检查第二个独立任务
    expect(result[1].title).toBe('公招栏位3')
    expect(result[1].date).toEqual(date3)
  })

  it('不应合并时间相差超过3分钟的任务', () => {
    const date1 = new Date(2025, 1, 1, 11, 30, 0)
    const date2 = new Date(2025, 1, 1, 11, 34, 0)

    const mockRecruits: Recruit[] = [
      {
        startTs: 1710000000,
        finishTs: getUnixTime(date1),
        state: 1,
      },
      {
        startTs: 1710000000,
        finishTs: getUnixTime(date2),
        state: 1,
      },
    ]

    const result = mergeRecruits(mockRecruits)

    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('公招栏位1')
    expect(result[1].title).toBe('公招栏位2')
  })
})
