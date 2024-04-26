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
    size-38px relative
    flex="inline items-center justify-center"
    v-bind="$attrs"
  >
    <div
      absolute
      inline-block size-38px bg-transparent m-10px rotate-45
      c-primary
      border="5 primary"
    >
      <div
        inline-block bg-transparent
        absolute left="1/2" top="1/2" size-38px
        border="5 primary" animate-loading
        class="-translate-1/2"
      />
    </div>

    <slot />
  </component>
</template>
