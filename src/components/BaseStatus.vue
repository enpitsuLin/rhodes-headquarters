<script setup lang="ts">
import { useApInfo } from '~/composables/ap'
import type { PlayerStatus } from '~/types'

const props = defineProps<{ status: PlayerStatus }>()

const { spendTime, recoveryDesc } = useApInfo(props.status.ap)
</script>

<template>
  <div>
    <section flex="~ gap-2 items-center" p-2 rounded-md>
      <Avatar :avatar="status.avatar" :name="status.name" />
      <div flex-1 flex="~ col justify-between">
        <h3 text-lg>
          {{ status.name }}
        </h3>
        <div flex="~ gap-2">
          <div>
            Lv.{{ status.level }}
          </div>
          <div>
            UID:{{ status.uid }}
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2>当前理智</h2>
      <div text-3xl font-semibold>
        {{ status.ap.current }}/{{ status.ap.max }}
      </div>
      <div flex="~ items-center justify-between">
        <div>全部恢复需要</div>
        <div>{{ spendTime }}</div>
      </div>
      <div flex="~ items-center justify-between">
        <div>预计恢复时间</div>
        <div>{{ recoveryDesc }}</div>
      </div>
    </section>
  </div>
</template>
