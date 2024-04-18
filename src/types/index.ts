export * from './info'
export * from './character'
export * from './building'

export interface SklandResponseBody<T> {
  code: number
  data: T
  message: string
}

export interface SklandUser {
  user: {
    avatar: string
    id: string
    nickname: string
  }
}

export interface SklandBinding {
  appCode: string
  appName: string
  bindingList: SklandBindRole[]
  defaultUid: string
}

export interface SklandBindRole {
  uid: string
  isOfficial: boolean
  isDefault: boolean
  channelMasterId: number
  channelName: string
  nickName: string
  isDelete: boolean
}
