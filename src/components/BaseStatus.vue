<script setup lang="ts">
import { useApInfo } from '~/composables/ap'
import type { PlayerStatus } from '~/types'

const props = defineProps<{ status: PlayerStatus }>()

const {
  spendTime,
  recoveryDesc,
  current,
  max,
  nextApAddTime,
} = useApInfo(props.status.ap)
</script>

<template>
  <PopupSection title="当前理智" sub-title="Sanity">
    <div flex="~ items-baseline justify-between">
      <span text-3xl font-semibold font-bender>
        {{ current }}/{{ max }}
      </span>
      <span v-if="current === max">理智已完全恢复!</span>
      <span v-else>下次恢复: {{ nextApAddTime }}</span>
    </div>
    <div flex="~ items-center justify-between">
      <div>全部恢复需要</div>
      <div>
        <span v-if="current === max">-</span>
        <span v-else>{{ spendTime }}</span>
      </div>
    </div>
    <div flex="~ items-center justify-between">
      <div>预计恢复时间</div>
      <div>
        <span v-if="current === max">-</span>
        <span v-else>{{ recoveryDesc }}</span>
      </div>
    </div>
  </PopupSection>
</template>
