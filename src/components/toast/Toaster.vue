<script setup lang="ts">
import {
  ToastCloseTrigger,
  ToastDescription,
  ToastRoot,
  ToastTitle,
  Toaster,
} from '@ark-ui/vue'

const { toaster } = useToast()
</script>

<template>
  <Toaster
    v-slot="toast"
    class="z-9999!"
    :toaster="toaster"
  >
    <ToastRoot
      p="x-4 y-2" bg="secondary-background"
      min-w-250px rounded-sm shadow-lg
      transition="all duration-400 ease-[cubic-bezier(0.21,1.02,0.73,1)] data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)]"
      class="[translate:var(--x)_var(--y)] z-$z-index h-$height scale-$scale opacity-$opacity will-change-transform"
    >
      <ToastTitle>{{ toast.title }}</ToastTitle>
      <ToastDescription>{{ toast.description }}</ToastDescription>
      <ToastCloseTrigger>Close</ToastCloseTrigger>
    </ToastRoot>
  </Toaster>
</template>
