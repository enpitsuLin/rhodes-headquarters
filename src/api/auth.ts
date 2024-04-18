import { createError, defineEventHandler, readValidatedBody } from 'h3'
import * as z from 'zod'
import { indexedDbStorage, signIn } from '@/utils/background'

const signInSchema = z.object({
  token: z.string(),
})

/**
 * Combine both hypergryph OAuth grant and skland signIn api and cache the `cred` and `token`
 */
export default defineEventHandler(async (event) => {
  const validatedBody = await readValidatedBody(
    event,
    signInSchema.safeParse,
  )
  if (!validatedBody.success)
    return createError({ status: 500, statusText: 'body validate error' })

  const { token } = validatedBody.data
  try {
    const data = await signIn(token)
    indexedDbStorage.setItem(token, data)
    return { message: 'OK', data }
  }
  catch (error) {
    return createError({ status: 500, statusText: `error on fetch api:\n ${error}` })
  }
})
