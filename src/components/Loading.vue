<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{ as?: string | Component }>(),
  {
    as: 'div',
  },
)
</script>

<template>
  <component
    :is="as"
    relative size-38px
    flex="inline items-center justify-center"
    v-bind="$attrs"
  >
    <div

      absolute m-10px inline-block size-38px rotate-45 bg-transparent c-primary
      border="5 primary"
    >
      <div

        left="1/2" top="1/2"
        border="5 primary" absolute inline-block size-38px bg-transparent animate-loading
        class="-translate-1/2"
      />
    </div>

    <slot />
  </component>
</template>
