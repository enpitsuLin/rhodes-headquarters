/* eslint-disable no-console */
export const Logger = {
  log(...args: any[]) {
    console.log(
      `%c罗德岛远程指挥部%cP.R.R.H v${__VERSION__}%c`,
      'background:#6591cc; padding: 4px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#444444; padding: 4px; border-radius: 0 3px 3px 0;  color: #fff',
      'background:transparent',
      ...args,
    )
  },
  debug(...args: any[]) {
    console.log(
      `%c罗德岛远程指挥部%cP.R.R.H v${__VERSION__}%c`,
      'background:#6591cc; padding: 4px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#4060ff; padding: 4px; border-radius: 0 3px 3px 0;  color: #fff',
      'background:transparent',
      ...args,
    )
  },
}
