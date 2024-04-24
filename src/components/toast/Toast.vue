<script setup lang="ts">
import * as toast from '@zag-js/toast'
import { normalizeProps, useActor } from '@zag-js/vue'
import type { VNodeChild } from 'vue'
import { computed } from 'vue'

const props = defineProps<{ actor: toast.Service<VNodeChild> }>()
const [state, send] = useActor(props.actor)
const api = computed(() => toast.connect(state.value, send, normalizeProps))
</script>

<template>
  <div
    v-bind="api.rootProps"
    p="x-4 y-2" bg="#35373c" rounded-sm shadow-lg min-w-250px
    transition="all duration-400 ease-[cubic-bezier(0.21,1.02,0.73,1)] data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)]"
    class="will-change-transform [translate:var(--x)_var(--y)] scale-$scale z-$z-index h-$height opacity-$opacity"
  >
    <span v-bind="api.ghostBeforeProps" />
    <h3 v-bind="api.titleProps">
      [{{ api.type }}]{{ api.title }}
    </h3>
    <p v-bind="api.descriptionProps">
      {{ api.description }}
    </p>
    <button @click="api.dismiss()">
      Close
    </button>
    <span v-bind="api.ghostAfterProps" />
  </div>
</template>
