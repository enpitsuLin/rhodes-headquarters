<script setup lang="ts">
import type { Campaign, Mission, Tower } from '~/types'

defineProps<{ campaign: Campaign;tower: Tower; routine: Mission }>()
</script>

<template>
  <div p-2 flex="~ col gap-2">
    <div flex="~ items-center justify-between">
      <div flex="~ gap-2 items-end">
        <span text-sm>剿灭作战</span>
        <span>Annihilation</span>
      </div>
      <div>
        <span c-red>{{ campaign.reward.current }}</span>/<span>{{ campaign.reward.total }}</span>
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
            {{ tower.reward.higherItem.current }}
          </span>/<span>
            {{ tower.reward.higherItem.total }}
          </span>
        </div>
        <div>
          <span c-yellow>
            {{ tower.reward.lowerItem.current }}
          </span>/<span>
            {{ tower.reward.lowerItem.total }}
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
            {{ routine.daily.current }}
          </span>/<span>
            {{ routine.daily.total }}
          </span>
        </div>
        <div>
          <span c-primary>
            {{ routine.weekly.current }}
          </span>/<span>
            {{ routine.weekly.total }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
