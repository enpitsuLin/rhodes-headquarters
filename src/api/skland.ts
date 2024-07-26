import { ofetch } from 'ofetch'
import { generateSignatureHeader } from '@/utils/signature'
import type { Binding, BindingInfo, Status, User } from '@/types'

const $fetch = ofetch.create({
  baseURL: 'https://zonai.skland.com/',
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
  const {
    data: { cred, token, userId },
  } = await $fetch<SklandResponse<{ cred: string, userId: string, token: string }>>(
    '/api/v1/user/auth/generate_cred_by_code',
    {
      method: 'POST',
      body: {
        code,
        kind: 1,
      },
    },
  )
  return { cred, token, userId }
}

/**
 * 检查用户访问令牌
 */
export async function checkAccessToken({ token, cred }: { token: string, cred: string }) {
  try {
    const pathname = '/api/v1/user/check'
    const headers = await generateSignatureHeader({ token, pathname, cred })

    await $fetch(
      pathname,
      {
        method: 'GET',
        headers,
      },
    )
    return true
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    return false
  }
}

export async function getUserInfo({ token, cred }: { token: string, cred: string }) {
  const pathname = '/api/v1/user/me'
  const headers = await generateSignatureHeader({ token, pathname, cred })
  const {
    data,
  } = await $fetch<SklandResponse<{ user: User, gameStatus: Status }>>(
    pathname,
    { headers },
  )

  return data
}

export async function getPlayerBinding({ token, cred }: { token: string, cred: string }) {
  const pathname = '/api/v1/game/player/binding'
  const headers = await generateSignatureHeader({ token, pathname, cred })
  const {
    data: { list },
  } = await $fetch<SklandResponse<{ list: Binding[] }>>(
    pathname,
    { headers },
  )

  return list
}

export async function getBindingInfo({ token, cred, uid }: { token: string, cred: string, uid: string }) {
  const pathname = `/api/v1/game/player/info`
  const headers = await generateSignatureHeader({ token, pathname, cred, params: `uid=${uid}` })
  const {
    data,
  } = await $fetch<SklandResponse<BindingInfo>>(
    pathname,
    { headers, query: { uid } },
  )

  return data
}
