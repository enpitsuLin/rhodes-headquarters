<script setup lang="ts">
import type { Recruit } from '~/types'
import { useRecruits } from '~/composables/status/recruit'
import RecruitItem from './Item.vue'

const props = defineProps<{ data: Recruit[] }>()

const parsedRecruits = useRecruits(props.data)
</script>

<template>
  <ul
    flex="~ col justify-between"
    relative h-full py-10px
  >
    <li
      v-for="(recruit, index) in parsedRecruits"
      :key="index"
    >
      <RecruitItem :data="recruit" :index="index" />
    </li>
    <!-- 船新创的号 森空岛api暂无数据的情况 -->
    <template v-if="parsedRecruits.length < 4">
      <li v-for="i in 4 - parsedRecruits.length" :key="i">
        <div
          h-50px flex="~ gap-10px items-center"
          bg="#2D2E30/30" px-8px
        >
          <div size-24px bg-primary text-center leading-24px>
            {{ i + parsedRecruits.length }}
          </div>
          <div text-base>
            尚未解锁公招位
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>
