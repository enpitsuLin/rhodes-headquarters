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
interface User {
  /** 森空岛用户信息 */
  account: SklandUser['user']
  /** 绑定游戏角色数据 */
  binding: SklandBinding[]
  updatedAt: number
  /** 用户提交的凭据 */
  certificate: string
  /** `generate_cred_by_code` 得到的 cred */
  cred: string
  /** `generate_cred_by_code` 得到的 code */
  token: string
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

export async function loginTo(certificate: string) {
  function getUser() {
    return users.value.find(u => u.certificate === certificate)
  }

  const { code: grant_code } = await auth(certificate)
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
      certificate,
      cred,
      token,
      updatedAt: now,
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
async function auth(certificate: string) {
  const r = await fetch('https://as.hypergryph.com/user/oauth2/v2/grant', {
    method: 'POST',
    headers: command_header,
    body: JSON.stringify({
      appCode: '4ca99fa6b56cc2ba',
      token: certificate,
      type: 0,
    }),
  })
  const data = await r.json()
  return data.data as { code: string, uid: string }
}

async function signIn(grant_code: string) {
  const res = await $fetch<SklandResponseBody<{ cred: string, userId: string, token: string }>>(SKLAND_CRED_CODE_URL, {
    method: 'POST',
    body: JSON.stringify({
      code: grant_code,
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
    if (!users.value.some((u, i) => u.certificate === currentUser.value?.certificate && i !== index)) {
      currentUserId.value = ''
      users.value.splice(index, 1)
    }
  }

  currentUserId.value = users.value[0]?.account?.id
}

export async function refreshCredAndToken(id?: string) {
  const user = id
    ? users.value.find(u => u.account.id === id)
    : toValue(currentUser)
  if (user) {
    const { code: grant_code } = await auth(user.certificate)
    const { cred, token } = await signIn(grant_code)
    user.cred = cred
    user.token = token
    user.updatedAt = Date.now()
  }
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
    user.updatedAt = Date.now()
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
    user.updatedAt = Date.now()
  }
}

export function useUserInfo(uid: MaybeRefOrGetter<string>) {
  const url = computed(() => {
    const params = new URLSearchParams({ uid: toValue(uid) }).toString()
    return createUrl(`/api/v1/game/player/info?${params}`)
  })
  const ret = useFetch(url, {
    immediate: false,
    beforeFetch(ctx) {
      const request = ctx.url
      const options = ctx.options
      return onFetchRequest({ request, options })
    },
    async onFetchError({ data }) {
      if (data.code === 10000) {
        await refreshCredAndToken()
        ret.execute()
      }
      return {}
    },
  })
    .get()
    .json<SklandResponseBody<Player>>()

  return ret
}
