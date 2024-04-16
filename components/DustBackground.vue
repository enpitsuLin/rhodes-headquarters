<script setup lang="ts">
import { CanvasDust } from '@/composables/animations/animate-background'

const canvasRef = ref<HTMLCanvasElement >()

watchPostEffect(() => {
  if (!canvasRef.value)
    return
  const _ = new CanvasDust(canvasRef.value)
})
</script>

<template>
  <canvas ref="canvasRef" fixed z-0 top-0 left-0 pointer-events-none />
</template>
