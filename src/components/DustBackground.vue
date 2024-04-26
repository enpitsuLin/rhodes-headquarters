<script setup lang="ts">
import { useCanvasDust } from '@/composables/animations/animate-background'

const canvasRef = ref<HTMLCanvasElement | null>(null)

useCanvasDust(canvasRef)
</script>

<template>
  <canvas ref="canvasRef" pointer-events-none fixed left-0 top-0 z-0 />
</template>
