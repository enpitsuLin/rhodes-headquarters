<script setup lang="ts">
import type { BindingInfo, Building } from '~/types'

import Manufacture from '~/components/building/Manufacture.vue'
import Trading from '~/components/building/Trading.vue'
import Power from '~/components/building/Power.vue'
import Dormitory from '~/components/building/Dormitory.vue'
import Control from '~/components/building/Control.vue'
import Hire from '~/components/building/Hire.vue'
import Training from '~/components/building/Training.vue'
import Meeting from '~/components/building/Meeting.vue'

const props = defineProps<{ info: BindingInfo }>()

const buildingsType = ['control', 'powers', 'manufactures', 'tradings', 'dormitories', 'hire', 'training', 'meeting']

const nameComponentMap = {
  control: Control,
  powers: Power,
  manufactures: Manufacture,
  tradings: Trading,
  dormitories: Dormitory,
  hire: Hire,
  training: Training,
  meeting: Meeting,
} as const

const list = computed(() => {
  return Object.entries(props.info.building)
    .filter(([type]) => buildingsType.includes(type))
    .map(([type, value]) => {
      const items = Array.isArray(value) ? value : [value]
      return items.map(item => ({ type, data: item })) as { type: keyof typeof nameComponentMap, data: any }[]
    })
    .flat()
    .map(({ type, data }) => {
      const Component = nameComponentMap[type]
      // @ts-expect-error: ignore
      return h(Component, { data })
    })
})
</script>

<template>
  <template v-for="item in list" :key="item.type">
    <component :is="item" />
  </template>
</template>
