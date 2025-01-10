export * from './building'
export * from './character'
export * from './info'

export interface SklandResponseBody<T> {
  code: number
  data: T
  message: string
}

export interface BindingRole {
  uid: string
  isOfficial: boolean
  isDefault: boolean
  channelMasterId: number
  channelName: string
  nickName: string
  isDelete: boolean
}

export interface Binding {
  appCode: string
  appName: string
  bindingList: BindingRole[]
}

/**
 * 森空岛用户信息
 * `https://zonai.skland.com/api/v1/user/me` 返回值中的 data.user 部分有用的
 */
export interface User {
  id: string
  nickname: string
  avatar: string
  pendant?: {
    iconUrl: string
    id: number
  }
}

export interface Preference {
  /** 定时器时间 */
  periodInMinutes: number
  /** 多账户提醒 */
  charactersAlarmsEnable: boolean
}
