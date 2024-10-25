import type { StorageLikeAsync, UseStorageAsyncOptions } from '@vueuse/core'
import { useStorageAsync } from '@vueuse/core'
import type { StorageArea } from 'wxt/storage'

export function useWxtStorageAsync<T>(
  key: string,
  initialValue: T,
  options?: UseStorageAsyncOptions<T>,
  scope: StorageArea = 'local',
) {
  const asyncStorage: StorageLikeAsync = {
    getItem(key) {
      return storage.getItem(`${scope}:${key}`)
    },
    setItem(key, value) {
      storage.setItem(`local:${key}`, value)
    },
    removeItem(key) {
      storage.removeItem(`local:${key}`)
    },
  }

  return useStorageAsync(
    key,
    initialValue,
    asyncStorage,
    options,
  )
}
