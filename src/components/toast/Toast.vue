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
    v-bind="api.getRootProps()"
    p="x-4 y-2" bg="secondary-background" min-w-250px rounded-sm shadow-lg
    transition="all duration-400 ease-[cubic-bezier(0.21,1.02,0.73,1)] data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)]"
    class="[translate:var(--x)_var(--y)] z-$z-index h-$height scale-$scale opacity-$opacity will-change-transform"
  >
    <span v-bind="api.getGhostBeforeProps()" />
    <h3 v-bind="api.getTitleProps()">
      [{{ api.type }}]{{ api.title }}
    </h3>
    <p v-bind="api.getDescriptionProps()">
      {{ api.description }}
    </p>
    <button @click="api.dismiss()">
      Close
    </button>
    <span v-bind="api.getGhostAfterProps()" />
  </div>
</template>
