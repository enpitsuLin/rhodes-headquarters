<script setup lang="ts">
import type { RecruitState } from '~/composables/status/recruit'

defineProps<{ data: RecruitState, index: number }>()
</script>

<template>
  <div
    h-50px flex="~ gap-10px items-center"
    bg="#2D2E30/30" px-8px
  >
    <div size-24px bg-primary text-center leading-24px>
      {{ index + 1 }}
    </div>
    <template v-if="data.status === 'completed'">
      <div text-base>
        已成功招募到候选人
      </div>
    </template>

    <template v-else-if="data.status === 'recruiting'">
      <div flex-1 animate-pulse>
        招募中...
      </div>
      <div flex="~ col" text-10px>
        <div>剩余时间: {{ data.readableDuration }}</div>
        <div>预计完成于 {{ data.readableCompletedAt }}</div>
      </div>
    </template>
    <template v-else-if="data.status === 'locked'">
      <div text-base>
        尚未解锁公招位
      </div>
    </template>
    <template v-else>
      <div text-base>
        没有进行中的招募
      </div>
    </template>
  </div>
</template>
