import { ofetch } from 'ofetch'

const $fetch = ofetch.create({
  baseURL: 'https://as.hypergryph.com',
})

interface HypergrayphonResponse<Data, Message = string> {
  status: string
  type: string
  msg: Message
  data: Data
}

/**
 * 发送手机验证码
 */
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

/**
 * 生成扫码登录 scanId 和对应的 deeplink
 */
export async function genScanLoginUrl() {
  const { data } = await $fetch<HypergrayphonResponse<{ scanId: string, scanUrl: string }>>(
    '/general/v1/gen_scan/login',
    {
      method: 'POST',
      body: {
        appCode: '4ca99fa6b56cc2ba',
      },
    },
  )

  return data
}

/**
 * 轮训获取扫码状态
 */
export async function getScanStatus(scanId: string) {
  const { data, msg } = await $fetch<HypergrayphonResponse<{ scanCode: string }, '未扫码' | '已扫码待确认' | '已失效'| (string & {})>>(
    `/general/v1/scan_status`,
  {
    query: {
      scanId,
    },
  },
  )

  return { data, msg }
}

/**
 * 通过手机号和密码获取鹰角 OAuth token
 */
export async function getOAuthTokenByPhonePassword(phone: string, password: string) {
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

/**
 * 通过扫码获取鹰角 OAuth token
 */
export async function getOAuthTokenByScanCode(scanCode: string) {
  const {
    data: { token },
  } = await $fetch<HypergrayphonResponse<{ token: string }>>(
    `user/auth/v1/token_by_scan_code`,
    {
      method: 'POST',
      body: {
        scanCode,
      },
    },
  )

  return token
}

/**
 * 通过手机号和验证码获取鹰角 OAuth token
 */
export async function getOauthTokenByPhoneCode(phone: string, code: string) {
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
 * 通过鹰角 OAuth token 获取应用授权码
 */
export async function grantAuthorizeCode(oauthToken: string, appCode = '4ca99fa6b56cc2ba') {
  const {
    data: { code },
  } = await $fetch<HypergrayphonResponse<{ code: string, uid: string }>>(
    '/user/oauth2/v2/grant',
    {
      method: 'POST',
      body: {
        appCode,
        token: oauthToken,
        type: 0,
      },
    },
  )

  return code
}
