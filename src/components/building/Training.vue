<script setup lang="ts">
import Base from './Base.vue'
import ResidentCharacter from './ResidentCharacter.vue'
import type { BuildingTraining, ResidentCharacter as ResidentCharacterType } from '~/types'

const props = defineProps<{ data: BuildingTraining }>()

const chars = computed(() => {
  return [
    props.data.trainer,
    props.data.trainee,
  ] as ResidentCharacterType[]
})
</script>

<template>
  <Base title="训练室" :level="data.level" color="white">
    <template #icon>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_502_989)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M29.6943 -2.28332C28.0271 -3.23889 25.9729 -3.23889 24.3057 -2.28332L-3.3057 13.542C-4.97294 14.4976 -6 16.2635 -6 18.1747V49.8253C-6 51.7365 -4.97294 53.5024 -3.3057 54.458L24.3057 70.2833C25.9729 71.2389 28.0271 71.2389 29.6943 70.2833L57.3057 54.458C58.9729 53.5024 60 51.7365 60 49.8253V18.1747C60 16.2635 58.9729 14.4976 57.3057 13.542L29.6943 -2.28332ZM55.0378 16.4452L27.9622 0.927022C27.3668 0.585747 26.6332 0.585746 26.0378 0.927021L-1.03775 16.4452C-1.63319 16.7865 -2 17.4172 -2 18.0997V49.1361C-2 49.8186 -1.63319 50.4493 -1.03775 50.7906L26.0378 66.3088C26.6332 66.6501 27.3668 66.6501 27.9622 66.3088L55.0378 50.7906C55.6332 50.4493 56 49.8186 56 49.1361V18.0997C56 17.4172 55.6332 16.7865 55.0378 16.4452Z" fill="#44464B" />
          <path d="M21.5 47V54H24V52H26V50.5H28V47H30V45.5H28V42H26V41H24V39H21.5V45.5H7.5V38.5H5.5V40.5H3V42H1V45.5H-1V47H1V50.5H3V52H5.5V54H7.5V47H21.5Z" fill="#44464B" />
          <path d="M9 48.5H20V50H9V48.5Z" fill="#44464B" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M51.5 50L26.5 6.5L8 37.5H9V44H11.5L9.5 41L13 34.5H21L23 37.5H25V39H27V41H28L32 34H39.5L43.5 41L39.5 47.5H31.5V48.5H29.5V50.5H51.5V50ZM42.5 48L45 44L47 48H42.5ZM35.5 28L33.5 31.5H37.5L35.5 28ZM24.5 34.5H28.5L26.5 37.5L24.5 34.5ZM15 31.5L17 28L18.9902 31.4828L15 31.5ZM30 31.5H22.5L18.5 25L22.5 18H30.5L34 25L30 31.5Z" fill="#44464B" />
        </g>
        <defs>
          <clipPath id="clip0_502_989">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </template>
    <ResidentCharacter
      v-for="i in chars"
      :key="i.charId"
      :resident="i"
    />
  </Base>
</template>
