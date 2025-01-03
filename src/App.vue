<script setup lang="ts">
import Cursor from '~/components/Cursor.vue'
import DustBackground from '~/components/DustBackground.vue'
import Toaster from '~/components/toast/Toaster.vue'
import { provideToastContext } from '~/composables/use-toast'

provideToastContext()
</script>

<template>
  <RouterView />
  <DustBackground />
  <Cursor />
  <Toaster />
</template>
