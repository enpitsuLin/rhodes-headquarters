import type { WxtStorageItem } from 'wxt/storage'

export function useWxtStorage<
  Value extends (string | number | boolean | object | null),
  // eslint-disable-next-line ts/no-empty-object-type
  MetaData extends Record<string, unknown> = {},
>(item: WxtStorageItem<Value, MetaData>, shallow?: boolean) {
  const rawInit: Value = item.fallback

  const data = (shallow ? shallowRef : ref)(item.defaultValue) as Ref<Value>

  async function read(newValue?: Value) {
    try {
      newValue = newValue ?? await item.getValue()
      if (!newValue)
        data.value = rawInit
      else
        data.value = newValue
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      // TODO: onError options
    }
  }

  read()

  item.watch((newValue, oldValue) => {
    if (newValue === oldValue)
      return
    read(newValue)
  })

  watch(
    data,
    async () => {
      try {
        if (data.value == null)
          await item.removeValue()
        else
          await item.setValue(toRaw(data.value))
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (e) {
        // TODO: onError options
      }
    },
    {
      deep: true,
      flush: 'pre',
    },
  )

  return data
}
