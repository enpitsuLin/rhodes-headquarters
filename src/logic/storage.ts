import { useStorageLocal } from '~/composables/useStorageLocal'
import { ACCOUNTS_KEY, DEFAULT_ACCOUNT_ID_KEY, ROLE_UID_KEY } from '~/constsants'
import type { SklandUser } from '~/types'

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

export const storageUid = useStorageLocal(ROLE_UID_KEY, '')
