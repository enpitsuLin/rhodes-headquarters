import { setImmediate } from 'node:timers/promises'
import { beforeEach, describe, expect, it } from 'vitest'

describe('storage', () => {
  beforeEach(() => {
    fakeBrowser.reset()
  })

  it('should store and update primitive values in local storage', async () => {
    const foo = useWxtStorageAsync<string>('foo', 'bar')
    expect(foo.value).toBe('bar')

    // wait next microtask
    await setImmediate()

    expect(await fakeBrowser.storage.local.get('foo').then(res => res.foo)).toEqual('bar')

    foo.value = 'baz'
    await setImmediate()
    expect(await fakeBrowser.storage.local.get('foo').then(res => res.foo)).toEqual('baz')
  })

  it('should store objects as JSON strings in local storage', async () => {
    const object = useWxtStorageAsync('foo', { foo: 'bar' })
    expect(object.value).toEqual({ foo: 'bar' })

    await setImmediate()
    expect(await fakeBrowser.storage.local.get('foo').then(res => res.foo)).toEqual(JSON.stringify({ foo: 'bar' }))
  })

  it('should store values in session storage when scope is session', async () => {
    const foo = useWxtStorageAsync('foo', 'bar', {
      scope: 'session',
    })

    expect(foo.value).toBe('bar')

    await setImmediate()
    expect(await fakeBrowser.storage.session.get('foo').then(res => res.foo)).toEqual('bar')
  })
})
