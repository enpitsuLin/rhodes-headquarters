import { md5 } from 'js-md5'

export const command_header = {
  'User-Agent': 'Skland/1.5.1 (com.hypergryph.skland; build:100501001; Android 34; ) Okhttp/4.11.0',
  'Accept-Encoding': 'gzip',
  'Connection': 'close',
  'Content-Type': 'application/json',
}

export const sign_header = {
  platform: '1',
  timestamp: '',
  dId: '',
  vName: '1.5.1',
}

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

export async function generateSignature<T extends Record<string, string>>(token: string, uri: string | URL, data?: T) {
  const timestamp = (Date.now() - 2 * MILLISECOND_PER_SECOND).toString().slice(0, -3)
  const header = { ...sign_header }
  header.timestamp = timestamp
  const { pathname, searchParams } = new URL(uri)
  const str = `${pathname}${searchParams.toString()}${data ? JSON.stringify(data) : ''}${timestamp}${JSON.stringify(header)}`

  const hmacSha256ed = await generateHMACSHA256(token, str)

  const sign = generateMD5Hash(hmacSha256ed)

  return [sign, header as typeof sign_header] as const
}

export function getPrivacyName(name: string) {
  return name.split('')
    .map((s, i) => (i > 0 && i < name.length - 1) ? '*' : s)
    .join('')
}
