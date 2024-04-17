import { getUnixTime } from 'date-fns'
import { md5 } from 'js-md5'
import type { FetchContext } from 'ofetch'
import { ofetch } from 'ofetch'

export const basicHeader = {
  'User-Agent': 'Skland/1.5.1 (com.hypergryph.skland; build:100501001; Android 34; ) Okhttp/4.11.0',
  'Accept-Encoding': 'gzip',
  'Connection': 'close',
  'Content-Type': 'application/json',
}

const MILLISECOND_PER_SECOND = 1000

const signatureRequiredHeaders = {
  platform: '1',
  timestamp: '',
  dId: '',
  vName: '1.5.1',
}

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

const whiteList = [
  '/api/v1/user/auth/generate_cred_by_code',
] satisfies string[]

export async function onFetchRequest({ request, options }: FetchContext) {
  const { pathname, searchParams } = new URL(request instanceof Request ? request.url : request, options.baseURL)
  const headers = new Headers(options.headers)

  if (!whiteList.includes(pathname)) {
    let cred = headers.get('cred')
    let token = headers.get('token')

    if (!cred || !token) {
      if (!currentUser.value) {
        throw new Error('currentUser not found')
      }
      else {
        cred = currentUser.value.cred
        token = currentUser.value.token
        headers.append('cred', cred)
      }
    }

    const toEncodeParams = options.method?.toUpperCase() === 'POST'
      ? getParamsFromBody(options.body)
      : options.query
        ? new URLSearchParams(options.query).toString()
        : searchParams.toString()

    const timestamp = getUnixTime(Date.now() - 2 * MILLISECOND_PER_SECOND).toString()
    const header = { ...signatureRequiredHeaders, timestamp }

    const body = `${pathname}${toEncodeParams ?? ''}${timestamp}${JSON.stringify(header)}`

    const hmacSha256ed = await generateHMACSHA256(token, body)

    const sign = generateMD5Hash(hmacSha256ed)

    headers.append('sign', sign)
    Object.entries(header).forEach(([key, value]) => {
      headers.append(key, value)
    })
    options.headers = headers
  }
}

function getParamsFromBody(body: BodyInit | Record<string, any> | null | undefined) {
  if (!body)
    return {}
  if (body instanceof FormData || body instanceof URLSearchParams)
    return Object.fromEntries(body.entries())
  if (typeof body === 'string')
    return JSON.parse(body)
  return {}
}

/** 森空岛 api */
const $fetch = ofetch.create({
  baseURL: 'https://zonai.skland.com',
  onRequest: onFetchRequest,
})

export { $fetch }
