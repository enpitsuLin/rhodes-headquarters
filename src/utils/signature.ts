import { getUnixTime } from 'date-fns'
import { md5 } from 'js-md5'
import type { FetchContext } from 'ofetch'
import { stringifyQuery } from 'ufo'
import { refresh } from '~/api'

const WHITELIST = ['/web/v1/user/auth/generate_cred_by_code', '/api/v1/auth/refresh']

const MILLISECOND_PER_SECOND = 1000

async function generateHMACSHA256(secret: string, body: string) {
  const enc = new TextEncoder()
  const algorithm = { name: 'HMAC', hash: 'SHA-256' }

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    algorithm,
    false,
    ['sign', 'verify'],
  )

  const signature = await crypto.subtle.sign(
    algorithm,
    key,
    enc.encode(body),
  )

  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(signature))

  // convert bytes to hex string
  const digest = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return digest
}

function generateMD5Hash(str: string) {
  const utf8HmacSha256ed = new TextEncoder().encode(str)

  return md5(utf8HmacSha256ed)
}

export function getRequestURL(request: RequestInfo, baseURL?: string) {
  const url = typeof request === 'string' ? request : request.url
  if (URL.canParse(url))
    return new URL(url)
  return new URL(url, baseURL)
}

export async function onSignatureRequest(ctx: FetchContext) {
  const { pathname } = getRequestURL(ctx.request, ctx.options.baseURL)
  if (WHITELIST.includes(pathname))
    return

  const headers = new Headers(ctx.options.headers)
  let token = headers.get('token') ?? await storage.getItem<string>('local:PRRH:token')
  if (!token) {
    token = await refresh()
    await storage.setItem('local:PRRH:token', token)
  }

  const query = ctx.options.query ? stringifyQuery(ctx.options.query) : ''
  const timestamp = getUnixTime(Date.now() - 5 * MILLISECOND_PER_SECOND).toString()
  const did = await storage.getItem<string>('local:PRRH:device-id')

  const signatureHeaders = {
    platform: '1',
    timestamp,
    dId: '',
    vName: '1.21.0',
  }

  if (did)
    signatureHeaders.dId = did

  const str = `${pathname}${query}${ctx.options.body ? JSON.stringify(ctx.options.body) : ''}${timestamp}${JSON.stringify(signatureHeaders)}`
  const hmacSha256ed = await generateHMACSHA256(token, str)
  const sign = generateMD5Hash(hmacSha256ed)

  Object.entries(signatureHeaders).forEach(([key, value]) => {
    headers.append(key, value)
  })
  headers.append('sign', sign)
  headers.delete('token')

  ctx.options.headers = headers
}
