import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import type { Player, PlayerAvatar, SklandBinding, SklandResponseBody, SklandUser } from '~/types'

function createUrl(path: string) {
  return new URL(path, 'https://zonai.skland.com').toString()
}

export function useUserInfo(cred: MaybeRefOrGetter<string>, uid: MaybeRefOrGetter<string>) {
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

export function useMyInfo(cred: string) {
  return useFetch(createUrl('/api/v1/user/me'), { headers: { cred: toValue(cred) } }, { refetch: true })
    .get()
    .json<SklandResponseBody<SklandUser>>()
}

export function useUserAvatar(avatar: MaybeRefOrGetter<PlayerAvatar>) {
  return computed(() => {
    const _avatar = toValue(avatar)
    if (_avatar.type === 'ICON')
      return `https://web.hycdn.cn/arknights/game/assets/avatar/${_avatar.id}.png`
    return 'unknown'
  })
}
