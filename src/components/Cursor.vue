<script setup lang="ts">
import { useAnimateCursor } from '@/composables/animations/animate-cursor'

const {
  container,
  outer,
  effecter,
} = useAnimateCursor()
</script>

<template>
  <div ref="container">
    <div
      id="cursor-outer"
      ref="outer"
      z-10000
      fixed pointer-events-none
      h-28px w-28px
      border="1px solid foreground rounded-full"
      class="[transform:translate3d(-50%,-50%,0px)] [transition:background-color_0.3s,width_0.3s,height_0.3s]"
    />
    <div
      id="cursor-effect"
      ref="effecter"
      z-9999
      fixed pointer-events-none
      h-60px w-60px
      border="4px solid foreground rounded-full"
      op-0
      class="[transform:translate3d(-50%,-50%,0px)scale(0)]"
    />
  </div>
</template>
