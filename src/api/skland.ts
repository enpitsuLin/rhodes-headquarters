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
  const abortSignal = AbortSignal.timeout(30 * 1000)

  const createDeviceId = () => new Promise<string>((resolve, reject) => {
    globalThis.addEventListener('message', (event) => {
      if (event.data.type === 'DEVICE_ID_RESULT') {
        resolve(event.data.deviceId)
      }
      else if (event.data.type === 'DEVICE_ID_ERROR') {
        reject(new Error(event.data.error))
      }
    })

    globalThis.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({ type: 'GET_DEVICE_ID' })
      }
      else {
        reject(new Error('没有可用的客户端来处理请求'))
      }
    })

    abortSignal.addEventListener('abort', () => {
      reject(new Error('获取设备 ID 超时'))
    })
  })

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
        'dId': await createDeviceId(),
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

declare module './skland.js' {
  const globalThis: ServiceWorkerGlobalScope
}
