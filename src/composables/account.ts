import type { MaybeRefOrGetter } from '@vueuse/core'
import type { Account } from '@/store/account'
import { accountsStorage, currentAccountStorage, currentChararcterUidStorage } from '@/store/account'
import { authorizeMappingStorage } from '@/store/authorize'

export function useAccounts() {
  return useWxtStorage(accountsStorage)
}

export function useCurrentAccount() {
  const accounts = useAccounts()
  const currentAccountId = useWxtStorage(currentAccountStorage)

  return computed(() => {
    if (accounts.value.length === 0)
      return null
    const specifcAccount = accounts.value
      .find(account => account.id === currentAccountId.value)

    return specifcAccount ?? accounts.value[0]
  })
}

export function useSetCurrentAccount() {
  const currentAccountId = useWxtStorage(currentAccountStorage)
  return (id: string) => {
    currentAccountId.value = id
  }
}

export function useAuthorizeMapping() {
  return useWxtStorage(authorizeMappingStorage)
}

export function useAuthorize(account: MaybeRefOrGetter<Account>) {
  const authorizeMapping = useAuthorizeMapping()

  return computed(() => {
    const id = toValue(account).id
    return authorizeMapping.value[id] ?? null
  })
}

export function useBindings(account: MaybeRefOrGetter<Account | null>) {
  return computed(() => {
    return toValue(account)
      ?.binding
      .map(b => b.bindingList).flat() ?? []
  })
}

export function useCurrentCharacter() {
  const allAccount = useAccounts()

  const currentUid = useWxtStorage(currentChararcterUidStorage)
  return computed(() => {
    const allCharacters = allAccount.value.map((account) => {
      return account.binding.map(b => b.bindingList).flat()
    }).flat()

    return allCharacters.find(c => c.uid === currentUid.value) ?? null
  })
}
