<script setup lang="ts">
import { useStyleTag } from '@vueuse/core'
import Cursor from '~/components/Cursor.vue'
import DustBackground from '~/components/DustBackground.vue'
import Toaster from '~/components/toast/Toaster.vue'
import { provideToastContext } from '~/composables/use-toast'

provideToastContext()

if (import.meta.env.DEV) {
  useStyleTag(`.vue-devtools__panel { pointer-events: auto; }`)
}
</script>

<template>
  <RouterView />
  <DustBackground />
  <Cursor />
  <Toaster />
</template>
