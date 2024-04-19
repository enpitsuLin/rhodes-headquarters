import { CHARARCTER_INFO } from './key-definitions'
import type { BindingInfo } from '@/types'

export const chararcterStorage = storage.defineItem<BindingInfo | null>(
  CHARARCTER_INFO,
  {
    defaultValue: null,
    version: 1,
  },
)
