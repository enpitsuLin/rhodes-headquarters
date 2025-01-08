import type { BindingRole } from '~/types'

export interface SklandAccount {
  id: string
  /** 森空岛账号用户登录凭证 */
  cred: string
}

/**
 * 森空岛绑定的明日方舟游戏角色
 */
export interface ArknightRole extends BindingRole {
  accountId: SklandAccount['id']
}

export function useSklandAccounts() {
  return useWxtStorageAsync<SklandAccount[]>('PRRH:SKLAND_ACCOUNTS', [])
}

export function useArknightCharacters() {
  return useWxtStorageAsync<ArknightRole[]>('PRRH:ARKNIGHT_CHARACTERS', [])
}

/** 当前明日方舟账号 uid  */
export function useCurrentArknightCharacter() {
  return useWxtStorageAsync<string | null>('PRRH:ARKNIGHT_CHARACTER_CURRENT', '')
}
