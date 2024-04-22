import { AUTHORIZE_MAPPING_KEY } from './key-definitions'

export interface Authorize {
  cred: string
  token: string
}

export const authorizeMappingStorage = storage.defineItem<Record<string, Authorize>>(
  AUTHORIZE_MAPPING_KEY,
  {
    defaultValue: {},
    version: 1,
  },
)
