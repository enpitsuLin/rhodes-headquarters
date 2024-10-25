import type { BindingRole } from '~/types'

export interface SklandAccount {
  id: string
  /** 森空岛账号用户登录凭证 */
  cred: string
}

export interface ArknightRole extends BindingRole {
  accountId: SklandAccount['id']
}

export function useSklandAccounts() {
  return useWxtStorageAsync<SklandAccount[]>('PRRH:SKLAND_ACCOUNTS', [])
}

export function useArknightAccounts() {
  return useWxtStorageAsync<ArknightRole[]>('PRRH:ARKNIGHT_ACCOUNTS', [])
}

/** 当前明日方舟账号 uid  */
export function useCurrentArknightAccount() {
  return useWxtStorageAsync<string | null>('PRRH:ARKNIGHT_ACCOUNT_CURRENT', null)
}
