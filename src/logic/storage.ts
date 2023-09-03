import { useStorageLocal } from '~/composables/useStorageLocal'
import { ACCOUNTS_KEY, CURRENT_ACCOUNTS_KEY } from '~/constsants'
import type { SklandUser } from '~/types'

type Account = {
  cred: string
} & SklandUser['user']

export const storageAccounts = useStorageLocal<Account[]>(ACCOUNTS_KEY, [])

export const currentAccountId = useStorageLocal<string | null>(CURRENT_ACCOUNTS_KEY, null)

export const currentAccount = computed(() => {
  return storageAccounts.value.find(i => i.id === currentAccountId.value)
})
