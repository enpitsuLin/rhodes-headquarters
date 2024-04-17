import type { RemovableRef } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { ofetch } from 'ofetch'
import { useStorageLocal } from './storage'
import { $fetch } from '~/composables/api'
import { STORAGE_KEY_CURRENT_USER_ID, STORAGE_KEY_USERS } from '~/constsants'
import type { SklandBinding, SklandResponseBody, SklandUser } from '~/types'

const SKLAND_BINDING_URL = createUrl('api/v1/game/player/binding')
const SKLAND_ME_URL = createUrl('/api/v1/user/me')

/** 森空岛用户和绑定游戏角色数据 */
export interface User {
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

  const {
    data: { cred, token },
  } = await authorize(certificate)

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

  setCurrentUserId(me.user.id)
}

async function authorize(token: string) {
  const r = await ofetch<{ data: { cred: string, token: string, userId: string } }>(
    '/api/auth',
    {
      method: 'POST',
      body: {
        token,
      },
    },
  )
  return r
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
    const {
      data: { cred, token },
    } = await authorize(user.certificate)
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
