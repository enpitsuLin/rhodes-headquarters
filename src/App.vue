<script setup lang="ts">
import { provideToastContext } from './composables/use-toast'
import Cursor from '~/components/Cursor.vue'
import DustBackground from '~/components/DustBackground.vue'
import Toaster from '~/components/toast/Toaster.vue'

provideToastContext()
</script>

<template>
  <RouterView />
  <DustBackground />
  <Cursor />
  <Toaster />
</template>
