<script setup lang="ts">
import type { BuildingControl } from '~/types'
import Base from './Base.vue'
import ResidentCharacter from './ResidentCharacter.vue'

defineProps<{ data: BuildingControl }>()
</script>

<template>
  <Base
    color="white"
    type="control"
    :level="data.level"
  >
    <template #icon>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_502_1357)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M31 65H40.4151C35.1074 48.1807 33.388 25.41 69 43.7893L58.4781 35.4585L65.2516 30.1572C59.9833 32.6816 48.5435 36.2158 44.9309 30.1572C45.9344 25.8656 51.4034 16.8281 65.2516 15.0105L69 16.36L66.72 13.32L69 10.28C68.24 11.04 66.0073 12.3372 56.2202 13.4958C57.2237 9.70912 58.6286 1.83284 56.2202 0.621105C58.4781 13.2044 38.9099 33.1865 31.3837 13.4958C30.4746 9.98842 36.8291 3.81054 40.12 1.16002L27.2 10.2799C24.4404 2.45413 17.32 -10.24 6.68 -11C10.1922 -9.48533 14.7242 -6.13174 13.52 -4.92L8.80505 -2.40823L17.32 -1.88008C20.6035 2.44817 24.92 15.6 20.847 23.3411C12.76 20.9199 2.12 18.6399 0.6 25.4799C4.61398 22.9555 12.76 22.4399 20.847 30.9145L15.04 38.3999C12.4124 41.3114 6.65482 44.2764 2.12 46.76H-5.48C-4.72 48.28 -2.44 49.8 0.526213 49.0905L-7 55.12L-1.68 52.84L-1.73165 56.6639C1.02796 51.1101 10.3118 42.2 24.16 42.2C27.2 42.96 29.48 45.24 30.24 47.52L31 65ZM35.1468 30.9145C36.351 33.9438 34.645 38.7403 33.6416 40.7598C31.8353 40.154 29.3767 36.9732 28.3732 35.4585C27.7711 33.035 28.6241 25.3607 29.1258 21.8265C32.1363 22.4323 34.3942 28.1376 35.1468 30.9145Z" fill="#44464B" />
        </g>
        <defs>
          <clipPath id="clip0_502_1357">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </template>
    <ResidentCharacter
      v-for="i in data.chars"
      :key="i.charId"
      :resident="i"
    />
  </Base>
</template>
