import { ofetch } from 'ofetch'

const $fetch = ofetch.create({
  baseURL: 'https://as.hypergryph.com',
})

interface HypergrayphonResponse<T> {
  status: string
  type: string
  msg: string
  data: T
}

export async function getTokenByPhonePassword(phone: string, password: string) {
  const {
    data: { token },
  } = await $fetch<HypergrayphonResponse<{ token: string }>>(
    '/user/auth/v1/token_by_phone_password',
    {
      method: 'POST',
      body: {
        phone,
        password,
      },
    },
  )

  return token
}

export async function sendPhoneCode(phone: string) {
  await $fetch<HypergrayphonResponse<{ token: string }>>(
    '/general/v1/send_phone_code',
    {
      method: 'POST',
      body: {
        phone,
        type: 2,
      },
    },
  )
}

export async function getTokenByPhoneCode(phone: string, code: string) {
  const {
    data: { token },
  } = await $fetch<HypergrayphonResponse<{ token: string }>>(
    '/user/auth/v2/token_by_phone_code',
    {
      method: 'POST',
      body: {
        phone,
        code,
      },
    },
  )

  return token
}

/**
 * 通过 token 获取授权码
 */
export async function grantAuthorizeCode(token: string) {
  // grant authorize code using user certificate
  const {
    data: { code },
  } = await $fetch<HypergrayphonResponse<{ code: string, uid: string }>>(
    '/user/oauth2/v2/grant',
    {
      method: 'POST',
      body: {
        appCode: '4ca99fa6b56cc2ba',
        token,
        type: 0,
      },
    },
  )

  return code
}
