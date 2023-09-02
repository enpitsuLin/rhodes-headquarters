<script setup lang="ts">
import * as avatar from '@zag-js/avatar'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import type { PlayerAvatar } from '~/types'

const props = defineProps<{ avatar?: PlayerAvatar ; name?: string }>()

const avatarSrc = computed(() => {
  if (props.avatar?.type === 'ICON')
    return `https://web.hycdn.cn/arknights/game/assets/avatar/${props.avatar.id}.png`
  return undefined
})

const [state, send] = useMachine(avatar.machine({ id: '1' }))

const api = computed(() => avatar.connect(state.value, send, normalizeProps))
</script>

<template>
  <div v-bind="api.rootProps" w-15 h-15>
    <span v-bind="api.fallbackProps" w-15 h-15>{{ name }}</span>
    <img :alt="name" :src="avatarSrc" v-bind="api.imageProps" w-15 h-15 rounded-full>
  </div>
</template>
