import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'

export const indexedDbStorage = createStorage({
  driver: indexedDbDriver({ base: 'app:' }),
})
