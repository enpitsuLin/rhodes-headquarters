import { getUnixTime } from 'date-fns'
import type { FetchContext } from 'ofetch'
import { stringifyQuery } from 'ufo'
import { DEVICE_ID_KEY } from '~/composables/storages'
import { refresh } from '~/api'

const WHITELIST = ['/web/v1/user/auth/generate_cred_by_code', '/api/v1/auth/refresh']

const MILLISECOND_PER_SECOND = 1000

export function getRequestURL(request: RequestInfo, baseURL?: string) {
  const url = typeof request === 'string' ? request : request.url
  if (URL.canParse(url))
    return new URL(url)
  return new URL(url, baseURL)
}

const lastRefreshTime = useWxtStorageAsync<number>('PRRH:LAST_REFRESH_TIME', 0)

export async function onSignatureRequest(ctx: FetchContext) {
  const { pathname } = getRequestURL(ctx.request, ctx.options.baseURL)
  if (WHITELIST.includes(pathname))
    return

  const headers = new Headers(ctx.options.headers)
  let token = headers.get('token') ?? await storage.getItem<string>('local:PRRH:TOKEN')
  if (!token || Date.now() - lastRefreshTime.value > 20 * 60 * MILLISECOND_PER_SECOND) {
    token = await refresh()
    await storage.setItem('local:PRRH:TOKEN', token)
    lastRefreshTime.value = Date.now()
  }

  const query = ctx.options.query ? stringifyQuery(ctx.options.query) : ''
  const timestamp = getUnixTime(Date.now() - 5 * MILLISECOND_PER_SECOND).toString()
  const did = await storage.getItem<string>(DEVICE_ID_KEY)

  const signatureHeaders = {
    platform: '1',
    timestamp,
    dId: '',
    vName: '1.21.0',
  }

  if (did)
    signatureHeaders.dId = did

  const str = `${pathname}${query}${ctx.options.body ? JSON.stringify(ctx.options.body) : ''}${timestamp}${JSON.stringify(signatureHeaders)}`
  const hmacSha256ed = await hmacSha256(token, str)
  const sign = await md5(hmacSha256ed)

  Object.entries(signatureHeaders).forEach(([key, value]) => {
    headers.append(key, value)
  })
  headers.append('sign', sign)
  headers.delete('token')

  ctx.options.headers = headers
}
