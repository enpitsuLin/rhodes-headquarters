import type { BindingInfo, BindingRole, Status } from '@/types'

export interface SklandUser {
  id: string
  /** 森空岛账号用户凭证 */
  cred: string
  /** 森空岛账号用户 token */
  token: string
}

export interface ArknightRole extends BindingRole {
  accountId: SklandUser['id']
}

export const sklandUsersStorage = storage.defineItem<SklandUser[]>(
  'local:skland-users',
  {
    fallback: [],
    version: 1,
  },
)

export const arknightRolesStorage = storage.defineItem<ArknightRole[]>(
  'local:arknight-roles',
  {
    fallback: [],
    version: 1,
  },
)

export const currentUidStorage = storage.defineItem<string | null>(
  'local:current-uid',
  {
    fallback: null,
    version: 1,
  },
)

export const deviceIdStorage = storage.defineItem<string | null>(
  'local:device-id',
  {
    fallback: null,
  },
)

export const tokenStorage = storage.defineItem<string | null>(
  'local:token',
  {
    fallback: null,
  },
)

export const infoStorage = storage.defineItem<Record<string, BindingInfo>>(
  'local:arknight-bindings-info',
  {
    fallback: {},
  },
)
