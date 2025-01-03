<script setup lang="ts">
import {
  ToastCloseTrigger,
  ToastDescription,
  Toaster,
  ToastRoot,
  ToastTitle,
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
      <ToastCloseTrigger absolute right-2 top-2>
        <svg size-5 xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m8.382 17.025l-1.407-1.4L10.593 12L6.975 8.4L8.382 7L12 10.615L15.593 7L17 8.4L13.382 12L17 15.625l-1.407 1.4L12 13.41z" /></svg>
      </ToastCloseTrigger>
    </ToastRoot>
  </Toaster>
</template>
