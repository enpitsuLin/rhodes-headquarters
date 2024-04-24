<script setup lang="ts">
import Toast from './Toast.vue'
import { useToast } from '@/composables/use-toast'

const api = useToast()
</script>

<template>
  <div v-for="placement in api.getPlacements()" :key="placement" v-bind="api.getGroupProps({ placement })">
    <Toast
      v-for="t in api.getToastsByPlacement(placement)"
      :key="t.id"
      :actor="t"
    />
  </div>
</template>
