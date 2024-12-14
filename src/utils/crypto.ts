import CryptoJS from 'crypto-js'
import forge from 'node-forge'

export async function md5(string: string) {
  return CryptoJS.MD5(string).toString()
}

export async function hmacSha256(key: string, data: string) {
  return CryptoJS.HmacSHA256(data, key).toString()
}

/**
 * AES CBC 加密
 */
export async function encryptAES(message: string, key: string) {
  const iv = new TextEncoder().encode('0102030405060708')

  const data = new TextEncoder().encode(message)

  // 导入密钥
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'AES-CBC' },
    false,
    ['encrypt'],
  )

  // 加密
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    cryptoKey,
    data,
  )

  // 转换为十六进制字符串
  return Array.from(new Uint8Array(encrypted))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function padData(data: string): string {
  const blockSize = 8
  const padLength = blockSize - (data.length % blockSize)
  return data + '\0'.repeat(padLength)
}

/**
 * DES ECB 加密
 */
export async function encryptDES(message: string | number, key: string) {
  // 将输入转换为字符串
  const inputStr = padData(String(message))

  // 创建 key
  const keyWordArray = CryptoJS.enc.Utf8.parse(key!)

  // 创建输入数据
  const dataWordArray = CryptoJS.enc.Utf8.parse(inputStr)

  // 使用 TripleDES 加密 (ECB 模式)
  const encrypted = CryptoJS.TripleDES.encrypt(dataWordArray, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding,
  })

  // 转换为 base64
  return encrypted.toString()
}

export interface DESRule {
  cipher?: string
  is_encrypt: number
  key?: string
  obfuscated_name: string
}

export async function encryptObjectByDESRules(object: Record<string, string | number>, rules: Record<string, DESRule>) {
  const result: Record<string, string | number> = {}

  for (const i in object) {
    if (i in rules) {
      const rule = rules[i]
      if (rule.is_encrypt === 1)
        result[rule.obfuscated_name] = await encryptDES(object[i], rule.key!)
      else
        result[rule.obfuscated_name] = object[i]
    }
    else {
      result[i] = object[i]
    }
  }

  return result
}

export async function encryptRSA(message: string, publicKey: string) {
  const formatPublickey = publicKey.match(/.{1,64}/g)?.join('\n') || ''
  const pk = `-----BEGIN PUBLIC KEY-----\n${formatPublickey}\n-----END PUBLIC KEY-----`

  const publicKeyForge = forge.pki.publicKeyFromPem(pk)
  const encrypted = publicKeyForge.encrypt(message, 'RSAES-PKCS1-V1_5')

  return forge.util.encode64(encrypted)
}
