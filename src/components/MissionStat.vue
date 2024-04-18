<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import type { Account } from '@/store/account'
import { chararcterStorage } from '@/store/info'
import * as API from '~/api'

const props = defineProps<{ account: Account, uid: string }>()
const authorizeData = useAuthorize(props.account)
const characterInfo = useWxtStorage(chararcterStorage)

useIntervalFn(
  async () => {
    const data = await API.skland.getBindingInfo({
      uid: props.uid,
      cred: authorizeData.value.cred,
      token: authorizeData.value.token,
    })
    characterInfo.value = data
  },
  1000 * 60 * 10,
)
</script>

<template>
  <div p-2 flex="~ col gap-2">
    <div flex="~ items-center justify-between">
      <div flex="~ gap-2 items-end">
        <span text-sm>剿灭作战</span>
        <span>Annihilation</span>
      </div>
      <div>
        <span c-red>
          {{ characterInfo?.campaign.reward.current }}
        </span>/<span>
          {{ characterInfo?.campaign.reward.total }}
        </span>
      </div>
    </div>
    <div flex="~ items-center justify-between">
      <div flex="~ gap-2 items-end">
        <span text-sm>保全派驻</span>
        <span>Stationary Security Service</span>
      </div>
      <div flex="inline gap-2">
        <div>
          <span c-purple>
            {{ characterInfo?.tower.reward.higherItem.current }}
          </span>/<span>
            {{ characterInfo?.tower.reward.higherItem.total }}
          </span>
        </div>
        <div>
          <span c-yellow>
            {{ characterInfo?.tower.reward.lowerItem.current }}
          </span>/<span>
            {{ characterInfo?.tower.reward.lowerItem.total }}
          </span>
        </div>
      </div>
    </div>
    <div flex="~ items-center justify-between">
      <div flex="~ gap-2 items-end">
        <span text-sm>日常/周常</span>
        <span>Routine Mission</span>
      </div>

      <div flex="inline gap-2">
        <div>
          <span c-primary>
            {{ characterInfo?.routine.daily.current }}
          </span>/<span>
            {{ characterInfo?.routine.daily.total }}
          </span>
        </div>
        <div>
          <span c-primary>
            {{ characterInfo?.routine.weekly.current }}
          </span>/<span>
            {{ characterInfo?.routine.weekly.total }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
