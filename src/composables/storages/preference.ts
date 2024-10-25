export interface Preference {
  /** 定时器时间 */
  periodInMinutes: number
  /** 多账户提醒 */
  charactersAlarmsEnable: boolean
}

export function usePreference() {
  return useWxtStorageAsync<Preference>(
    'PRRH:PREFERENCE',
    {
      periodInMinutes: 10,
      charactersAlarmsEnable: false,
    },
  )
}
