import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import type { StorageAccount } from '~/logic'
import { currentAccount, storageAccounts, storagePlayerInfo, storageUid } from '~/logic'
import type { Player, SklandBinding, SklandResponseBody, SklandUser } from '~/types'

export function createUrl(path: string) {
  return new URL(path, 'https://zonai.skland.com').toString()
}

const MS_PRE_MINTUES = 1000 * 60

export function usePlayerInfo() {
  const uid = toValue(storageUid)
  const cred = computed(() => currentAccount.value?.cred ?? '')
  const data = computed({
    get() {
      if (uid !== '')
        return storagePlayerInfo.value[uid]
    },
    set(val) {
      if (uid !== '' && val)
        storagePlayerInfo.value[uid] = val
    },
  })

  const url = computed(() => {
    const params = new URLSearchParams({ uid }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })

  async function fetchPlayerInfo() {
    const res = await fetch(url.value, { headers: { cred: toValue(cred) } })
    const json = await res.json() as SklandResponseBody<Player>
    data.value = { ...json.data, updateAt: Date.now() }
  }
  watchPostEffect(() => {
    if (cred.value && cred.value !== '') {
      if (!data.value || Date.now() - data.value.updateAt > MS_PRE_MINTUES * 15)
        fetchPlayerInfo()
    }
  })
  return { data }
}

export function useUserInfo(cred: MaybeRefOrGetter<string>) {
  return useFetch(createUrl('/api/v1/user/me'), { headers: { cred: toValue(cred) } }, { immediate: false })
    .get()
    .json<SklandResponseBody<SklandUser>>()
}

export function useAllBinding() {
  const url = createUrl('/api/v1/game/player/binding')
  const data = shallowRef<{ list: SklandBinding[]; account: StorageAccount }[]>([])

  async function fetchAllBinding() {
    data.value = await Promise.all(
      storageAccounts.value
        .map(a => fetch(url, { headers: { cred: a.cred } })
          .then(async (r) => {
            const data = (await r.json()) as SklandResponseBody<{ list: SklandBinding[] }>
            return { list: data.data.list, account: a }
          }),
        ),
    )
  }

  watch(storageAccounts, () => {
    fetchAllBinding()
  }, { immediate: true })

  return { data }
}
