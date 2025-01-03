import { format } from 'date-fns'

/* eslint-disable no-console */
export const Logger = {
  log(...args: any[]) {
    if (__DEV__) {
      console.log(
        `%c罗德岛远程指挥部 P.R.R.H%c${format(Date.now(), 'HH:mm:ss')}%c`,
        'background:#6591cc; padding: 4px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#222325; padding: 4px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent',
        ...args,
      )
    }
  },
}
