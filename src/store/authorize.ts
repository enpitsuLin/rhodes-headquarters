import { AUTHORIZE_KEY_MAPPING } from './key-definitions'

export interface Authorize {
  cred: string
  token: string
}

export const authorizeMappingStorage = storage.defineItem<Record<string, Authorize>>(
  AUTHORIZE_KEY_MAPPING,
  {
    defaultValue: {},
    version: 1,
  },
)
