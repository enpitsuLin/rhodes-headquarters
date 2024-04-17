import { $fetch } from 'ofetch'
import type { SklandResponseBody } from '@/types'

export async function signIn(token: string) {
  // grant authorize code using user certificate
  const {
    data: { code: oauth_grant_code },
  } = await $fetch<{ data: { code: string, uid: string } }>(
    'https://as.hypergryph.com/user/oauth2/v2/grant',
    {
      method: 'POST',
      body: {
        appCode: '4ca99fa6b56cc2ba',
        token,
        type: 0,
      },
    },
  )

  // fetch skland `token` and `cred`

  const {
    data,
  } = await $fetch<SklandResponseBody<{ cred: string, userId: string, token: string }>>(
    'https://zonai.skland.com/api/v1/user/auth/generate_cred_by_code',
    {
      method: 'POST',
      body: {
        code: oauth_grant_code,
        kind: 1,
      },
    },
  )

  return data
}

interface CheckResponse {
  // eslint-disable-next-line ts/ban-types
  message: (string & {}) | 'OK'
  code: number
  data: {
    policyList: never[]
    isNewUser: boolean
  }
}

export async function check(cred: string) {
  const res = await $fetch<CheckResponse>(
    'https://zonai.skland.com/api/v1/user/check',
    {
      method: 'GET',
      headers: {
        cred,
      },
    },
  )
  return res.code === 0
}
