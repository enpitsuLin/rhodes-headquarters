import { useAsyncState } from '@vueuse/core'
import type { Unwatch, WxtStorageItem } from 'wxt/storage'

export function useWxtStorage<
  Value,
  MetaData extends Record<string, unknown>,
  Shallow extends boolean = false,
>(
  item: WxtStorageItem<Value, MetaData>,
  shallow?: Shallow,
) {
  const { state } = useAsyncState<Value, [], Shallow>(
    item.getValue(),
    item.fallback,
    {
      immediate: true,
      shallow,
    },
  )

  // Listen for changes
  let unwatch: Unwatch | undefined
  onMounted(() => {
    unwatch = item.watch(async (newValue) => {
      state.value = newValue ?? item.fallback
    })
  })
  onUnmounted(() => {
    unwatch?.()
  })

  return computed({
    get() {
      return state.value as Value
    },
    set(newValue) {
      if (newValue === null)
        item.removeValue()
      else item.setValue(newValue)
      state.value = newValue ?? item.fallback
    },
  })
}
