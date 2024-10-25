import type { BindingInfo } from '~/types'

export function useArknightAccountsInfo() {
  return useWxtStorageAsync<Record<string, BindingInfo>>('PRRH:ARKNIGHT_ACCOUNTS_INFO', {})
}
