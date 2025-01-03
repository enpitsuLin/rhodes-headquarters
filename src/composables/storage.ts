import type { Awaitable, ConfigurableWindow, RemovableRef, StorageLikeAsync } from '@vueuse/core'
import type { StorageArea } from 'wxt/storage'
import { pausableWatch, tryOnMounted, useBroadcastChannel, useEventListener } from '@vueuse/core'

export interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

export interface SerializerAsync<T> {
  read: (raw: string) => Awaitable<T>
  write: (value: T) => Awaitable<string>
}

function guessSerializerType<T extends (string | number | boolean | object | null)>(rawInit: T) {
  return rawInit == null
    ? 'any'
    : rawInit instanceof Set
      ? 'set'
      : rawInit instanceof Map
        ? 'map'
        : rawInit instanceof Date
          ? 'date'
          : typeof rawInit === 'boolean'
            ? 'boolean'
            : typeof rawInit === 'string'
              ? 'string'
              : typeof rawInit === 'object'
                ? 'object'
                : !Number.isNaN(rawInit)
                    ? 'number'
                    : 'any'
}

export const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date', Serializer<any>> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
}

export const customStorageEventName = 'PRRH:STORAGE'

export interface StorageEventLike {
  storageArea: StorageLikeAsync | null
  key: StorageEvent['key']
  oldValue: StorageEvent['oldValue']
  newValue: StorageEvent['newValue']
}

export interface UseStorageOptions<T> extends ConfigurableWindow {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean

  /**
   * Listen to storage changes, useful for multiple tabs application
   *
   * @default true
   */
  listenToStorageChanges?: boolean

  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean

  /**
   * Merge the default value with the value read from the storage.
   *
   * When setting it to true, it will perform a **shallow merge** for objects.
   * You can pass a function to perform custom merge (e.g. deep merge), for example:
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void

  /**
   * Use shallow ref as reference
   *
   * @default false
   */
  shallow?: boolean

  /**
   * The storage area to use
   *
   * @default 'local'
   */
  scope?: StorageArea
}

export interface MessagePayload {
  key: string
  oldValue: string | null
  newValue: string | null
}

export function useWxtStorageAsync<T extends (string | number | boolean | object | null)>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  const {
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window = globalThis,
    onError = (e) => {
      console.error(e)
    },
    scope = 'local',
  } = options

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

  const data = (shallow ? shallowRef : ref)(typeof defaults === 'function' ? defaults() : defaults) as RemovableRef<T>

  const rawInit: T = toValue(defaults)
  const type = guessSerializerType<T>(rawInit)
  const serializer = StorageSerializers[type]

  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(
    data,
    () => write(data.value),
    { flush: 'pre', deep },
  )
  const { channel, post } = useBroadcastChannel<MessagePayload, MessagePayload>({
    name: `storage-${key}`,
    window: window as Window,
  })

  if (window && listenToStorageChanges) {
    tryOnMounted(() => {
      useEventListener(channel, 'message', updateFromCustomEvent)
    })
  }

  update()

  function dispatchWriteEvent(oldValue: string | null, newValue: string | null) {
    const payload: MessagePayload = {
      key,
      oldValue,
      newValue,
    }
    post(payload)
  }

  async function write(v: unknown) {
    try {
      const oldValue = await asyncStorage!.getItem(key)

      if (v == null) {
        dispatchWriteEvent(oldValue, null)
        asyncStorage!.removeItem(key)
      }
      else {
        const serialized = serializer.write(v as any)
        if (oldValue !== serialized) {
          asyncStorage!.setItem(key, serialized)
          dispatchWriteEvent(oldValue, serialized)
        }
      }
    }
    catch (e) {
      onError(e)
    }
  }

  async function read(event?: StorageEventLike) {
    const rawValue = event
      ? event.newValue
      : await asyncStorage!.getItem(key)

    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        asyncStorage!.setItem(key, serializer.write(rawInit))
      return rawInit
    }
    else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue)
      if (typeof mergeDefaults === 'function')
        return mergeDefaults(value, rawInit)
      else if (type === 'object' && !Array.isArray(value))
        return { ...rawInit as any, ...value }
      return value
    }
    else if (typeof rawValue !== 'string') {
      return rawValue
    }
    else {
      return serializer.read(rawValue)
    }
  }

  async function update(event?: StorageEventLike) {
    if (event && event.storageArea !== storage)
      return

    if (event && event.key == null) {
      data.value = rawInit
      return
    }

    if (event && event.key !== key)
      return

    pauseWatch()
    try {
      if (event?.newValue !== serializer.write(data.value)) {
        const nv = await read(event)
        data.value = nv
      }
    }
    catch (e) {
      onError(e)
    }
    finally {
      // use nextTick to avoid infinite loop
      if (event)
        nextTick(resumeWatch)
      else
        resumeWatch()
    }
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail)
  }

  return data
}
