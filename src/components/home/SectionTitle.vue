<script setup lang="ts">
defineProps<{ title: string, sub: string }>()
</script>

<template>
  <h3
    h-30px w-320px class="bg-[url(~/assets/bg-section-title.svg)]"
    p="l-32px y-3px"
    flex="inline items-center gap-1"
  >
    <span text-base font-bold>{{ title }}</span>
    <span text-xs op-80>{{ sub }}</span>
  </h3>
</template>
