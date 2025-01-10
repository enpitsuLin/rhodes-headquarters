<script setup lang="ts">
import type { BindingInfo } from '~/types'

import Control from '~/components/building/Control.vue'
import Dormitory from '~/components/building/Dormitory.vue'
import Hire from '~/components/building/Hire.vue'
import Manufacture from '~/components/building/Manufacture.vue'
import Meeting from '~/components/building/Meeting.vue'
import Power from '~/components/building/Power.vue'
import Trading from '~/components/building/Trading.vue'
import Training from '~/components/building/Training.vue'

const props = defineProps<{ info: BindingInfo }>()

const buildingsType = ['manufactures', 'tradings', 'meeting', 'dormitories', 'hire', 'training', 'powers', 'control']

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
    .filter(([type, value]) => buildingsType.includes(type) && value !== null)
    .map(([type, value]) => {
      const items = Array.isArray(value) ? value : [value]
      return items.map(item => ({ type, data: item })) as { type: keyof typeof nameComponentMap, data: any }[]
    })
    .flat()
    .sort((a, b) => {
      const aType = a.type
      const bType = b.type
      return buildingsType.indexOf(aType) - buildingsType.indexOf(bType)
    })
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
