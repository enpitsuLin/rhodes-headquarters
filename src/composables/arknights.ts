import type { MaybeRefOrGetter } from 'vue'
import { StorageSerializers } from '@vueuse/core'
import { $fetch } from './api'
import {
  STORAGE_KEY_CURRENT_ROLE_UID
  , STORAGE_KEY_ROLE_INFO,
} from '~/constsants'
import type { Player, SklandResponseBody } from '@/types'

export const bindingArknightRoles = computed(() => {
  return currentUser.value?.binding
    .filter(i => i.appCode === 'arknights')
    .map(i => i.bindingList)
    .flat() ?? []
})

export const currentUid = useStorageLocal(
  STORAGE_KEY_CURRENT_ROLE_UID,
  () => bindingArknightRoles.value?.[0]?.uid ?? '',
)

export const roleInfo = useStorageLocal<Player | null>(
  STORAGE_KEY_ROLE_INFO,
  null,
  {
    serializer: StorageSerializers.object,
  },
)

export async function refreshUidInfo(uid: string) {
  const res = await $fetch<SklandResponseBody<Player>>(
    '/api/v1/game/player/info',
    {
      query: { uid },
      retry: 3,
    },
  )
  roleInfo.value = res.data
}

export function useArknightRoleInfo(uid?: MaybeRefOrGetter<string>) {
  const resolveUid = computed(() => toValue(uid) ?? toValue(currentUid))

  if (!resolveUid)
    throw new Error('Not current role found')

  return function execute() {
    return refreshUidInfo(resolveUid.value)
  }
}
