import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import type { Player, SklandBinding, SklandResponseBody, SklandUser } from '~/types'

export function createUrl(path: string) {
  return new URL(path, 'https://zonai.skland.com').toString()
}

export function usePlayerInfo(cred: MaybeRefOrGetter<string>, uid: MaybeRefOrGetter<string>) {
  const url = computed(() => {
    const params = new URLSearchParams({ uid: toValue(uid) }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })
  return useFetch(url, { headers: { cred: toValue(cred) } }, { immediate: false })
    .get()
    .json<SklandResponseBody<Player>>()
}

export function useBinding(cred: MaybeRefOrGetter<string>) {
  return useFetch(createUrl('/api/v1/game/player/binding'), { headers: { cred: toValue(cred) } }, { refetch: true })
    .get()
    .json<SklandResponseBody<{ list: SklandBinding[] }>>()
}

export function useUserInfo(cred: MaybeRefOrGetter<string>) {
  return useFetch(createUrl('/api/v1/user/me'), { headers: { cred: toValue(cred) } }, { immediate: false })
    .get()
    .json<SklandResponseBody<SklandUser>>()
}
