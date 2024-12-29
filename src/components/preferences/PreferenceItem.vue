<script setup lang="ts">
defineProps<{ title: string, description: string }>()
</script>

<template>
  <div
    grid="~ cols-12 items-center gap-4px"
    h-70px bg-list-item p="x-8px y-4px"
  >
    <div flex="~ col gap-1" col-span-9 h-full flex-1>
      <h3 text-14px font-bold>
        {{ title }}
      </h3>
      <div flex-1 text-10px op-80>
        {{ description }}
      </div>
    </div>
    <div col-span-3 justify-self-center>
      <slot />
    </div>
  </div>
</template>
