<script setup lang="ts">
import { useRecruits } from '~/composables/recruit'
import type { InfrastructureHire, Recruit } from '~/types'

const props = defineProps<{ recruits: Recruit[]; hire: InfrastructureHire }>()

const parsedRecruits = useRecruits(props.recruits)
</script>

<template>
  <section>
    <header flex="~ items-baseline justify-between">
      <span text-xl>公开招募</span>
      <span>联络次数 {{ hire.refreshCount }}/3</span>
    </header>
    <div grid="~ rows-4 gap-2">
      <div v-for="recruit in parsedRecruits" :key="+recruit.finishAt">
        <div>
          预计完成时间: {{ recruit.format }}
        </div>
        <div>
          剩余时间: {{ recruit.restTime }}
        </div>
      </div>
    </div>
  </section>
</template>
