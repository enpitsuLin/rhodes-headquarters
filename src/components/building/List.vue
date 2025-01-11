<script setup lang="ts">
import type { BindingInfo } from '~/types'

import { useScroll, useVirtualList } from '@vueuse/core'
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

const itemsList = computed(() => {
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
})

const { list, containerProps, wrapperProps } = useVirtualList(
  itemsList,
  {
    itemHeight: 84,
  },
)

const { arrivedState } = useScroll(containerProps.ref)
</script>

<template>
  <div
    h-270px w-full flex-1 of-x-hidden of-y-scroll pt-4px
    v-bind="containerProps"
  >
    <div flex="~ col items-center gap-4px" v-bind="wrapperProps">
      <template v-for="item in list" :key="item.index">
        <component
          :is="nameComponentMap[item.data.type]"
          :data="item.data.data"
        />
      </template>
    </div>
    <div v-show="!arrivedState.bottom" absolute inset-x-0 bottom-0 h-30px class="from-background to-transparent bg-gradient-to-t" />
  </div>
</template>
