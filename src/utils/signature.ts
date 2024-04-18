import { getUnixTime } from 'date-fns'
import { md5 } from 'js-md5'

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

export async function generateSignatureHeader({ token, cred, params, pathname }: {
  token: string
  cred: string
  pathname: string
  params?: string
}) {
  const timestamp = getUnixTime(Date.now() - 3 * MILLISECOND_PER_SECOND).toString()

  const headers = { ...signatureRequiredHeaders, timestamp }

  const body = `${pathname}${params ?? ''}${timestamp}${JSON.stringify(headers)}`

  const sign = generateMD5Hash(await generateHMACSHA256(token, body))

  return new Headers({ ...headers, sign, cred })
}
