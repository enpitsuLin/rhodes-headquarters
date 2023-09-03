import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import type { Player, SklandResponseBody } from '~/types'

export function createUrl(path: string) {
  return new URL(path, 'https://zonai.skland.com').toString()
}

const MS_PRE_MINTUES = 1000 * 60

export function useUserInfo(cred: MaybeRefOrGetter<string>, uid: MaybeRefOrGetter<string>) {
  const url = computed(() => {
    const params = new URLSearchParams({ uid: toValue(uid) }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })
  return useFetch(url, { headers: { cred: toValue(cred) } }, { immediate: false })
    .get()
    .json<SklandResponseBody<Player>>()
}
