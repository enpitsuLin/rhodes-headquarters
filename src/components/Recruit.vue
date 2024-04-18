<script setup lang="ts">
import { useRecruits } from '@/composables/status/recruit'
import type { InfrastructureHire, Recruit } from '~/types'

const props = defineProps<{ recruits: Recruit[], hire: InfrastructureHire }>()

const parsedRecruits = useRecruits(props.recruits)
</script>

<template>
  <div mb-2>
    联络次数 {{ hire.refreshCount }}/3
  </div>
  <div grid="~ rows-4 gap-2">
    <div
      v-for="(recruit, index) in parsedRecruits"
      :key="+recruit.finishAt"
      relative pl-10 h-10
      flex="~ col justify-center" select-none
      class="recruit-bg group"
    >
      <div
        absolute w-8 h-6 flex="~ items-center justify-center"
        left="-4px" top="1/2"
        font-bender
        text-base p="x2 y1" backdrop-blur-12px
        bg="white/08 group-hover:primary [&.finished]:primary"
        transition="colors duration-300"
        class="-translate-y-1/2"
        :class="[recruit.isFinished && 'finished']"
      >
        <div v-if="recruit.isFinished" i-ri:check-double-fill />
        <div v-else>
          {{ (index + 1).toString().padStart(2, '0') }}
        </div>
      </div>
      <div v-if="recruit.isFinished" text-base>
        已成功招募到候选人
      </div>
      <div v-else grid="~ rows-2 cols-6 items-center">
        <div row-span-2 col-span-2 text-base animate-pulse>
          招募中...
        </div>
        <div col-span-4>
          剩余时间: {{ recruit.restTime }}
        </div>
        <div col-span-4>
          预计完成时间: {{ recruit.format }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.recruit-bg {
  background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 5px);
  background-size: rgba(17, 17, 17, 0.3);
}
</style>
