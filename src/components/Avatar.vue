<script setup lang="ts">
import type { Avatar } from '@/types'

defineProps<{ avatar: Avatar }>()
</script>

<template>
  <div size="50px" relative>
    <img
      absolute inset-5px
      rounded-full size="40px"
      width="40" height="40"
      :src="avatar.url"
    >
  </div>
</template>
