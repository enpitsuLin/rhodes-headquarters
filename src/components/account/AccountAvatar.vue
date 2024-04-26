<script setup lang="ts">
import type { User } from '@/types'

const props = defineProps<{ user: User }>()

const pendantUrl = computed(() => {
  return props.user.pendant?.iconUrl
})
</script>

<template>
  <div size="50px" relative>
    <img
      absolute inset-5px
      rounded-full size="40px"
      width="40" height="40"
      :src="user.avatar"
    >
    <img
      v-if="pendantUrl"
      absolute inset-0
      size="50px"
      width="50" height="50"
      :src="pendantUrl"
    >
  </div>
</template>
