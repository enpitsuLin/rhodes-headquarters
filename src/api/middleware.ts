import { defineEventHandler, getHeader, setCookie } from 'h3'
import { check, indexedDbStorage, signIn } from '@/utils/background'

export default defineEventHandler(async (event) => {
  const key = getHeader(event, 'token')
  if (key) {
    const {
      cred,
    } = (await indexedDbStorage.getItem<{ cred: string, userId: string, token: string }>(key))!

    const validate = await check(cred)
    if (!validate) {
      const data = await signIn(key)
      setCookie(event, 'token', key)
      indexedDbStorage.setItem(key, data)
    }
  }
})
