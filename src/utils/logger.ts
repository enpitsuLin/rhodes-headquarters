import { format } from 'date-fns'

/* eslint-disable no-console */
export const Logger = {
  log(...args: any[]) {
    if (import.meta.env.DEV) {
      console.log(
    `[罗德岛远程指挥部] ${format(Date.now(), 'HH:mm:ss')}`,
    ...args,
      )
    }
  },
}
