import { useStorageLocal } from '@/composables/storage'
import {
  ACCOUNTS_KEY,
  DEFAULT_ACCOUNT_ID_KEY,
  PLAYER_CACHE_KEY,
  PLAYER_UID_KEY,
} from '~/constsants'
import type { BindingInfo, SklandUser } from '~/types'

export type StorageAccount = {
  cred: string
} & SklandUser['user']

export const storageAccounts = useStorageLocal<StorageAccount[]>(ACCOUNTS_KEY, [])
export const defaultAccountId = useStorageLocal(DEFAULT_ACCOUNT_ID_KEY, '')
export const currentAccountId = ref('')

export const currentAccount = computed(() => {
  if (currentAccountId.value !== '')
    return storageAccounts.value.find(i => i.id === currentAccountId.value)
  return storageAccounts.value.find(i => i.id === defaultAccountId.value)
})

export const storageUid = useStorageLocal(PLAYER_UID_KEY, '')

export const storagePlayerInfo = useStorageLocal<Record<string, BindingInfo & { updateAt: number }>>(PLAYER_CACHE_KEY, {})

export function removeAccount(id: string) {
  if (id === currentAccountId.value)
    currentAccountId.value = ''
  if (id === defaultAccountId.value)
    defaultAccountId.value = ''

  storageAccounts.value = storageAccounts.value.filter(i => i.id !== id)
}
