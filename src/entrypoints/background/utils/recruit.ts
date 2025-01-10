import type { Recruit } from '~/types'
import { fromUnixTime } from 'date-fns'

export interface MergedRecruit extends Recruit {
  title: string
  date: Date
}

export function mergeRecruits(recruits: Recruit[]): MergedRecruit[] {
  return recruits
    .map((r, i) => ({ ...r, title: `公招栏位${i + 1}`, date: fromUnixTime(r.finishTs) }))
    .toSorted((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc, cur) => {
      const lastItem = acc[acc.length - 1]

      // 检查是否需要合并（时间差小于3分钟）
      if (lastItem && Math.abs(cur.date.getTime() - lastItem.date.getTime()) <= 3 * 60 * 1000) {
        // 合并项，使用较晚的时间
        const mergedItem = {
          ...cur,
          title: `${lastItem.title}, ${cur.title}`,
          date: cur.date > lastItem.date ? cur.date : lastItem.date,
        }
        return [...acc.slice(0, -1), mergedItem]
      }

      return [...acc, cur]
    }, [] as MergedRecruit[])
}
