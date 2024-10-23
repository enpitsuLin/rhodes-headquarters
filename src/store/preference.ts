export interface Preference {
  /** 定时器时间 */
  periodInMinutes: number
  /** 多账户提醒 */
  charactersAlarmsEnable: boolean
}

export const preferenceStorage = storage.defineItem<Preference>(
  'local:preference',
  {
    defaultValue: {
      periodInMinutes: 10,
      charactersAlarmsEnable: false,
    },
    version: 1,
  },
)
