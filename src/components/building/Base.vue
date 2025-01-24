<script setup lang="ts">
import type { ResidentCharacter } from '~/types'
import { BUILDING_TYPE_NAME_MAPPING, type BuildingState, BuildingStateProvider } from '~/composables/buildings'

const props = defineProps<{
  level: number
  color: string
  type: BuildingState['type']
  characters: ResidentCharacter[]
}>()

const state: BuildingState = {
  type: props.type,
  level: props.level,
  characters: toRaw(props.characters),
}

const title = computed(() => BUILDING_TYPE_NAME_MAPPING[props.type])
</script>

<template>
  <BuildingStateProvider :state="state">
    <div flex="~ col gap-4px" w-full>
      <div flex="~ items-center gap-10px" border="l-3" pl-6px :style="{ borderColor: color }">
        <span>{{ title }}</span>
        <div flex="inline items-center gap-1px">
          <svg
            v-for="i in level" :key="i" :style="{ color }" width="6" height="16" viewBox="0 0 6 16" fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3V13L3 16L6 13V3L3 0L0 3Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div border="~ border" relative h-62px w-full bg-background p="x-8px y-4px">
        <div v-if="$slots.icon" absolute left-0 top-0 z-0>
          <slot name="icon" />
        </div>
        <div flex="~ items-center" relative size-full>
          <div v-if="$slots.info || $slots.extra" h-full w-72px flex="~ col justify-end gap-4px">
            <slot name="info" />
          </div>
          <div v-if="$slots.extra" h-full flex-1>
            <slot name="extra" />
          </div>
          <div flex="~ items-center gap-4px" ml-auto>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </BuildingStateProvider>
</template>
