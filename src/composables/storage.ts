import type { WxtStorageItem } from 'wxt/storage'

export function useWxtStorage<
  Value extends (string | number | boolean | object | null),
  // eslint-disable-next-line ts/ban-types
  MetaData extends Record<string, unknown> = {},
>(item: WxtStorageItem<Value, MetaData>, shallow?: boolean) {
  const rawInit: Value = item.defaultValue

  const data = (shallow ? shallowRef : ref)(item.defaultValue) as Ref<Value>

  async function read(newValue?: Value) {
    try {
      newValue = newValue ?? await item.getValue()
      if (!newValue)
        data.value = rawInit
      else
        data.value = newValue
    }
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
