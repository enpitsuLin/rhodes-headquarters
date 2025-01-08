import type { Binding, BindingInfo, Status, User } from '~/types'
import { ofetch } from 'ofetch'
import { getDeviceId } from '~/composables/storages'
import { onSignatureRequest } from '~/utils'

const $fetch = ofetch.create({
  baseURL: 'https://zonai.skland.com/',
  onRequest: onSignatureRequest,
})

interface SklandResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 获取用户访问令牌
 * @param code 鹰角 OAuth 授权码
 */
export async function generateCredByCode(code: string) {
  const deviceId = await getDeviceId()

  const res = await $fetch<SklandResponse<{ cred: string, userId: string, token: string }>>(
    '/web/v1/user/auth/generate_cred_by_code',
    {
      method: 'POST',
      body: {
        code,
        kind: 1,
      },
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'referer': 'https://www.skland.com/',
        'origin': 'https://www.skland.com',
        'dId': deviceId,
        'platform': '3',
        'timestamp': `${Math.floor(Date.now() / 1000)}`,
        'vName': '1.0.0',
      },
    },
  )
  if (res.code !== 0)
    throw new Error(res.message)

  const {
    data: { cred, token, userId },
  } = res
  return { cred, token, userId }
}

/**
 * 检查用户访问令牌
 */
export async function checkAccessToken(cred: string) {
  try {
    const pathname = '/api/v1/user/check'

    await $fetch(
      pathname,
      {
        method: 'GET',
        headers: { cred },
      },
    )
    return true
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    return false
  }
}

export async function getUserInfo(cred: string) {
  const pathname = '/api/v1/user/me'
  const {
    data,
  } = await $fetch<SklandResponse<{ user: User, gameStatus: Status }>>(
    pathname,
    {
      headers: { cred },

    },
  )

  return data
}

export async function getPlayerBinding(cred: string) {
  const pathname = '/api/v1/game/player/binding'
  const {
    data: { list },
  } = await $fetch<SklandResponse<{ list: Binding[] }>>(
    pathname,
    {
      headers: { cred },
    },
  )

  return list
    .filter(b => b.appCode === 'arknights')
    .map(b => b.bindingList)
    .flat(2)
}

export async function getBindingInfo(cred: string, uid: string) {
  const pathname = `/api/v1/game/player/info`
  const {
    data,
  } = await $fetch<SklandResponse<BindingInfo>>(
    pathname,
    {
      headers: { cred },
      query: { uid },
    },
  )

  return data
}

export async function refresh() {
  const pathname = '/api/v1/auth/refresh'
  const { data } = await $fetch<SklandResponse<{ token: string }>>(
    pathname,
  )
  return data.token
}

declare module './skland.js' {
  const globalThis: ServiceWorkerGlobalScope
}
