import { storage } from 'wxt/storage'
import type { UseAsyncStateOptions } from '@vueuse/core'
import { useAsyncState } from '@vueuse/core'

type StorageValue = null | string | number | boolean | object

export function useStorageLocal<
  T extends StorageValue,
  Shallow extends boolean = true,
>(
  key: string,
  initialValue?: T,
  opts?: UseAsyncStateOptions<Shallow, T | null>,
) {
  const { state, ...asyncState } = useAsyncState<T | null, [], Shallow>(
    () => storage.getItem(key),
    initialValue ?? null,
    opts,
  )

  // Listen for changes
  let unwatch: () => void | undefined
  onMounted(() => {
    unwatch = storage.watch(key, async (event, changedKey) => {
      if (key !== changedKey)
        return
      if (event === 'remove')
        state.value = null
      else asyncState.execute()
    })
  })
  onUnmounted(() => {
    unwatch?.()
  })

  return {
    // Use a writable computed ref to write updates to storage
    state: computed({
      get() {
        return state.value
      },
      set(newValue) {
        storage.setItem(key, newValue)
        state.value = newValue
      },
    }),
    ...asyncState,
  }
}
