import { PREFERENCE_KEY } from './key-definitions'

export interface Preference {
  /** 定时器时间 */
  periodInMinutes: number
  /** 多账户提醒 */
  charactersAlarmsEnable: boolean
}

export const preferenceStorage = storage.defineItem<Preference>(
  PREFERENCE_KEY,
  {
    defaultValue: {
      periodInMinutes: 10,
      charactersAlarmsEnable: false,
    },
    version: 1,
  },
)
