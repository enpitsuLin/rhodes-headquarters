import { ACCOUNTS_KEY, CHARARCTER_UID_KEY, CURRENT_ACCOUNT_KEY } from './key-definitions'
import type { Binding, Status, User } from '@/types'

export interface Account {
  /** @unique */
  id: string
  /** @unique */
  token: string
  binding: Binding[]
  user: User
  /** 默认方舟角色的状态 */
  gameStatus: Status
}

export const currentChararcterUidStorage = storage.defineItem<string>(
  CHARARCTER_UID_KEY,
  {
    defaultValue: '',
    version: 1,
  },
)

export const currentAccountStorage = storage.defineItem<Account['id']>(
  CURRENT_ACCOUNT_KEY,
  {
    defaultValue: '',
    version: 1,
  },
)

export const accountsStorage = storage.defineItem<Account[]>(
  ACCOUNTS_KEY,
  {
    defaultValue: [],
    version: 1,
  },
)
