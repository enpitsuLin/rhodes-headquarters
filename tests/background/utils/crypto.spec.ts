import { describe, expect, it } from 'vitest'
import { encryptDES, encryptRSA, hmacSha256, md5 } from '~/entrypoints/background/utils/crypto'

describe('crypto', () => {
  it('1', async () => {
    const encrypted = await md5('hello world')
    expect(encrypted).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3')
  })

  it('2', async () => {
    const encrypted = await hmacSha256('longlongkey', 'foobar')
    const expected = '96e8c7f6a1f2476c17763559f09e85facd046cb7072651ad809a786dfafe7df9'
    expect(encrypted).toBe(expected)
  })

  it('3', async () => {
    const encrypted = await encryptDES('hello world', '12345678')
    const expected = 'KNugLrX23UdgQtrr+lloeg=='
    expect(encrypted).toBe(expected)
  })

  it('4', async () => {
    const encrypted = await encryptRSA('hello world', 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmxMNr7n8ZeT0tE1R9j/mPixoinPkeM+k4VGIn/s0k7N5rJAfnZ0eMER+QhwFvshzo0LNmeUkpR8uIlU/GEVr8mN28sKmwd2gpygqj0ePnBmOW4v0ZVwbSYK+izkhVFk2V/doLoMbWy6b+UnA8mkjvg0iYWRByfRsK2gdl7llqCwIDAQAB')
    const expected = 'U8FreVPHQqBEnKj0f86FTt5gS5NoBOxWQcxa1wkpdQIT64u3FJk4CSFsH6fY4BxnhXEWW3a5BKj4iSPvEyAq5ZoBvKucIneFrLMebRtqv64d6cFRUIDCSZin4lUXbl7t1UrSIhCfNJhBhnZBzhBR+0qAFP8sOLWrl7lzutZshFQ='
    expect(encrypted.length).toBe(expected.length)
  })
})
