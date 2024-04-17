import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import { useStorageLocal } from './storage'
import { $fetch, onFetchRequest } from '~/composables/api'
import { STORAGE_KEY_CURRENT_USER_ID, STORAGE_KEY_USERS } from '~/constsants'
import type { Player, SklandBinding, SklandResponseBody, SklandUser } from '~/types'

const SKLAND_CRED_CODE_URL = createUrl('/api/v1/user/auth/generate_cred_by_code')
const SKLAND_BINDING_URL = createUrl('api/v1/game/player/binding')
const SKLAND_ME_URL = createUrl('/api/v1/user/me')
/** 签到 URL */
/* eslint-disable unused-imports/no-unused-vars */
const SKLAND_ATTENDANCE_URL = createUrl('/api/v1/game/attendance')

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
  grant_code: string
  cred: string
  token: string
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

export async function loginTo(grant_code: string) {
  function getUser() {
    return users.value.find(u => u.grant_code === grant_code)
  }

  const { cred, token } = await signIn(grant_code)

  const [me, bindingList] = await Promise.all([
    fetchAccountInfo({ cred, token }),
    fetchBindingInfo({ cred, token }),
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
      grant_code,
      cred,
      token,
      accountUpdateAt: now,
      bindingUpdateAt: now,
    })
  }

  currentUserId.value = me.user.id
}

const command_header = {
  'User-Agent': 'Skland/1.5.1 (com.hypergryph.skland; build:100501001; Android 34; ) Okhttp/4.11.0',
  'Accept-Encoding': 'gzip',
  'Connection': 'close',
  'Content-Type': 'application/json',
}
async function auth(token: string) {
  const r = await fetch('https://as.hypergryph.com/user/oauth2/v2/grant', {
    method: 'POST',
    headers: command_header,
    body: JSON.stringify({
      appCode: '4ca99fa6b56cc2ba',
      token,
      type: 0,
    }),
  })
  const data = await r.json()
  return data.data as { code: string, uid: string }
}

async function signIn(token: string) {
  const { code } = await auth(token)

  const res = await $fetch<SklandResponseBody<{ cred: string, userId: string, token: string }>>(SKLAND_CRED_CODE_URL, {
    method: 'POST',
    body: JSON.stringify({
      code,
      kind: 1,
    }),
  })
  return res.data
}

/** 获取森空岛用户信息 */
async function fetchAccountInfo(headers?: HeadersInit) {
  const res = await $fetch<SklandResponseBody<SklandUser>>(SKLAND_ME_URL, { headers })
  return res.data
}

/** 获取绑定游戏角色数据 */
async function fetchBindingInfo(headers?: HeadersInit) {
  const r = await $fetch<SklandResponseBody<{ list: SklandBinding[] }>>(SKLAND_BINDING_URL, { headers })
  return r.data.list
}

export async function signOut(id?: string) {
  if (!id || !currentUser.value)
    return

  if (!id)
    id = currentUser.value.account.id

  const index = users.value.findIndex(u => u.account.id === id)

  if (index !== -1) {
    if (!users.value.some((u, i) => u.grant_code === currentUser.value?.grant_code && i !== index)) {
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
    const account = await fetchAccountInfo()
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
    const binding = await fetchBindingInfo()
    user.binding = binding
    user.bindingUpdateAt = Date.now()
  }
}

export function useUserInfo(uid: MaybeRefOrGetter<string>) {
  const url = computed(() => {
    const params = new URLSearchParams({ uid: toValue(uid) }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })
  return useFetch(url, {
    immediate: false,
    beforeFetch(ctx) {
      const request = ctx.url
      const options = ctx.options
      return onFetchRequest({ request, options })
    },
  })
    .get()
    .json<SklandResponseBody<Player>>()
}
