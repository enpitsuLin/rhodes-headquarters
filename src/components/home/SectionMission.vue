<script setup lang="ts">
import { chararcterStorage } from '@/store/info'

const characterInfo = useWxtStorage(chararcterStorage)
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
            {{ characterInfo?.campaign.reward.current }}
          </span>/<span>
            {{ characterInfo?.campaign.reward.total }}
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
        <div flex="~ gap-1 items-end">
          <span text-xs font-bold>日常/周常</span>
          <span text-10px c-border font-bold>Routine Mission</span>
        </div>

        <div flex="inline gap-2" text-xs>
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
  </section>
</template>
