import { CHARARCTER_INFO_KEY } from './key-definitions'
import type { BindingInfo } from '@/types'

export const chararcterStorage = storage.defineItem<BindingInfo | null>(
  CHARARCTER_INFO_KEY,
  {
    defaultValue: null,
    version: 1,
  },
)
