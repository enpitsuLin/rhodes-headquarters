<script setup lang="ts">
import type { BindingInfo } from '@/types'

defineProps<{
  info: BindingInfo
}>()
</script>

<template>
  <section py-3px>
    <div p-1 flex="~ col gap-4px">
      <div flex="~ items-center justify-between">
        <div flex="~ gap-1 items-end">
          <span text-xs font-bold>剿灭作战</span>
          <span text-10px c-border font-bold>Annihilation</span>
        </div>
        <div text-xs>
          <span c-red>
            {{ info?.campaign.reward.current }}
          </span>/<span>
            {{ info?.campaign.reward.total }}
          </span>
        </div>
      </div>
      <div flex="~ items-center justify-between">
        <div flex="~ gap-1 items-end">
          <span text-xs font-bold>保全派驻</span>
          <span text-10px c-border font-bold>Stationary Security Service</span>
        </div>
        <div flex="inline gap-2" text-xs>
          <div>
            <span c-purple>
              {{ info?.tower.reward.higherItem.current }}
            </span>/<span>
              {{ info?.tower.reward.higherItem.total }}
            </span>
          </div>
          <div>
            <span c-yellow>
              {{ info?.tower.reward.lowerItem.current }}
            </span>/<span>
              {{ info?.tower.reward.lowerItem.total }}
            </span>
          </div>
        </div>
      </div>
      <div flex="~ items-center justify-between">
        <div flex="~ gap-1 items-end">
          <span text-xs font-bold>日常/周常</span>
          <span text-10px c-border font-bold>Routine Mission</span>
        </div>

        <div flex="inline gap-2" text-xs>
          <div>
            <span c-primary>
              {{ info?.routine.daily.current }}
            </span>/<span>
              {{ info?.routine.daily.total }}
            </span>
          </div>
          <div>
            <span c-primary>
              {{ info?.routine.weekly.current }}
            </span>/<span>
              {{ info?.routine.weekly.total }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
