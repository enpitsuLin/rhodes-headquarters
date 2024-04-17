import { indexedDbStorage } from '@/utils/background/storage'

export async function handleApiCall(event: FetchEvent) {
  const a = await indexedDbStorage.getItem('test')
  // eslint-disable-next-line no-console
  console.log({ a, event })
  return new Response(
    JSON.stringify({ data: 1 }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
