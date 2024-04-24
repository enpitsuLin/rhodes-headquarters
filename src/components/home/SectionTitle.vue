<script setup lang="ts">
defineProps<{ title: string, sub: string }>()
</script>

<template>
  <h3
    w-320px h-30px class="bg-[url(bg-section-title.svg)]"
    p="l-32px y-3px"
    flex="inline items-center gap-1"
  >
    <span text-base font-bold>{{ title }}</span>
    <span op-80 text-xs>{{ sub }}</span>
  </h3>
</template>
