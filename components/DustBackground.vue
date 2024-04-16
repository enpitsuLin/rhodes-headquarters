<script setup lang="ts">
import { CanvasDust } from '@/composables/animations/animate-background'
</script>

<template>
  <canvas
    :ref="(el) => {
      new CanvasDust(el as Element as HTMLCanvasElement)
    }"
    fixed z-0 top-0 left-0 pointer-events-none
  />
</template>
