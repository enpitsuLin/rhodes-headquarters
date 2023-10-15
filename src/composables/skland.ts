import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/core'
import { toValue, useFetch } from '@vueuse/core'
import { useStorageLocal } from './useStorageLocal'
import type { Player, SklandBinding, SklandResponseBody, SklandUser } from '~/types'
import { STORAGE_KEY_CURRENT_USER_ID, STORAGE_KEY_USERS } from '~/constsants'

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

  const { cred } = await signIn(grant_code)

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
      grant_code,
      accountUpdateAt: now,
      bindingUpdateAt: now,
    })
  }

  currentUserId.value = me.user.id
}

const command_header = {
  'User-Agent': 'Skland/1.0.1 (com.hypergryph.skland; build:100001014; Android 31; ) Okhttp/4.11.0',
  'Accept-Encoding': 'gzip',
  'Connection': 'close',
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
  return data.data as { code: string; uid: string }
}

async function signIn(token: string) {
  const { code } = await auth(token)

  const r = await fetch(SKLAND_CRED_CODE_URL, {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
    }, command_header),
    body: JSON.stringify({
      code,
      kind: 1,
    }),
  })
  const { data } = await r.json() as SklandResponseBody<{ cred: string; userId: string; token: string }>
  return data
}

/** 获取森空岛用户信息 */
async function fetchAccountInfo(cred: string) {
  const r = await fetch(SKLAND_ME_URL, { headers: { cred, platform: '1' } })
  const { data } = await (r.json() as Promise<SklandResponseBody<SklandUser>>)
  return data
}

/** 获取绑定游戏角色数据 */
async function fetchBindingInfo(cred: string) {
  const r = await fetch(SKLAND_BINDING_URL, { headers: { cred, platform: '1' } })
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
    const { cred } = await signIn(user.grant_code)
    const account = await fetchAccountInfo(cred)
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
    const { cred } = await signIn(user.grant_code)
    const binding = await fetchBindingInfo(cred)
    user.binding = binding
    user.bindingUpdateAt = Date.now()
  }
}

export function useUserInfo(grant_code: MaybeRefOrGetter<string>, uid: MaybeRefOrGetter<string>) {
  const url = computed(() => {
    const params = new URLSearchParams({ uid: toValue(uid) }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })
  return useFetch(url, {
    immediate: false,
    beforeFetch: async (ctx) => {
      const { cred } = await signIn(toValue(grant_code))
      if (!cred)
        ctx.cancel()
      ctx.options.headers = { cred, platform: '1' }
    },
  })
    .get()
    .json<SklandResponseBody<Player>>()
}
