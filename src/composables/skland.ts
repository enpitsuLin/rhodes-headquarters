import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import { useStorageLocal } from './useStorageLocal'
import type { Player, SklandBinding, SklandResponseBody, SklandUser } from '~/types'
import { STORAGE_KEY_CURRENT_USER_ID, STORAGE_KEY_USERS } from '~/constsants'

/** 森空岛用户和绑定游戏角色数据 */
type User = {
  /** 森空岛用户信息 */
  account: SklandUser['user']
} &
{
  /** 绑定游戏角色数据 */
  binding: SklandBinding[]
}
& {
  /** 用户凭据 */
  cred: string
  accountUpdateAt: number
  bindingUpdateAt: number
}

export function createUrl(path: string) {
  return new URL(path, 'https://zonai.skland.com').toString()
}

function initializeUsers(): RemovableRef<User[]> {
  const users = useStorageLocal<User[]>(STORAGE_KEY_USERS, [])
  return users
}

const users = initializeUsers()
const currentUserId = useStorageLocal(STORAGE_KEY_CURRENT_USER_ID, '')

export const currentUser = computed<User | undefined>(() => {
  if (currentUserId.value) {
    const user = users.value.find(user => user.account.id === currentUserId.value)
    if (user)
      return user
  }
  return users.value[0]
})

export function setCurrentUserId(id: string) {
  const user = users.value.find(u => u.account.id === id)
  if (user)
    currentUserId.value = id
}

export function useUsers() {
  return users
}

export async function loginTo(cred: string) {
  function getUser() {
    return users.value.find(u => u.cred === cred)
  }

  const [me, bindingList] = await Promise.all([
    fetchAccountInfo(cred),
    fetchBindingInfo(cred),
  ])

  const existingUser = getUser()

  if (existingUser) {
    existingUser.account = me.user
    existingUser.binding = bindingList
  }
  else {
    const now = Date.now()
    users.value.push({
      account: me.user,
      binding: bindingList,
      cred,
      accountUpdateAt: now,
      bindingUpdateAt: now,
    })
  }

  currentUserId.value = me.user.id
}

/** 获取森空岛用户信息 */
async function fetchAccountInfo(cred: string) {
  const url = createUrl('/api/v1/user/me')
  const r = await fetch(url, { headers: { cred } })
  const { data } = await (r.json() as Promise<SklandResponseBody<SklandUser>>)
  return data
}

/** 获取绑定游戏角色数据 */
async function fetchBindingInfo(cred: string) {
  const url = createUrl('/api/v1/game/player/binding')
  const r = await fetch(url, { headers: { cred } })
  const { data } = await (r.json() as Promise<SklandResponseBody<{ list: SklandBinding[] }>>)
  return data.list
}

export async function signOut(id?: string) {
  if (!id || !currentUser.value)
    return

  if (!id)
    id = currentUser.value.account.id

  const index = users.value.findIndex(u => u.account.id === id)

  if (index !== -1) {
    if (!users.value.some((u, i) => u.cred === currentUser.value?.cred && i !== index)) {
      currentUserId.value = ''
      users.value.splice(index, 1)
    }
  }

  currentUserId.value = users.value[0]?.account?.id
}

export async function refreshAccountInfo(id?: string) {
  if (!id || !currentUser.value)
    return

  if (!id)
    id = currentUser.value.account.id

  const user = users.value.find(u => u.account.id === id)
  if (user) {
    const account = await fetchAccountInfo(user.cred)
    user.account = account.user
    user.accountUpdateAt = Date.now()
  }
}

export async function refreshBindingInfo(id?: string) {
  if (!id || !currentUser.value)
    return

  if (!id)
    id = currentUser.value.account.id

  const user = users.value.find(u => u.account.id === id)
  if (user) {
    const binding = await fetchBindingInfo(user.cred)
    user.binding = binding
    user.bindingUpdateAt = Date.now()
  }
}

export function useUserInfo(cred: MaybeRefOrGetter<string>, uid: MaybeRefOrGetter<string>) {
  const url = computed(() => {
    const params = new URLSearchParams({ uid: toValue(uid) }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })
  return useFetch(url,
    {
      immediate: false,
      beforeFetch: (ctx) => {
        if (toValue(cred) === '')
          ctx.cancel()
        ctx.options.headers = { cred: toValue(cred) }
      },
    })
    .get()
    .json<SklandResponseBody<Player>>()
}
