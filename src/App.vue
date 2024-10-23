<script setup lang="ts">
import { useDeviceId } from '~/composables/device-id'
import { provideToastContext } from '~/composables/use-toast'
import Cursor from '~/components/Cursor.vue'
import DustBackground from '~/components/DustBackground.vue'
import Toaster from '~/components/toast/Toaster.vue'

provideToastContext()

useDeviceId()
</script>

<template>
  <RouterView />
  <DustBackground />
  <Cursor />
  <Toaster />
</template>
