<script setup lang="ts">
defineProps<{ title: string, description: string }>()
</script>

<template>
  <div
    flex="~ items-center gap-4px" h-60px
    bg-list-item p="x-8px y-4px"
  >
    <div flex="~ col" h-full flex-1>
      <h3 font-bold>
        {{ title }}
      </h3>
      <div flex-1 text-10px op-80>
        {{ description }}
      </div>
    </div>
    <div p-10px>
      <slot />
    </div>
  </div>
</template>
