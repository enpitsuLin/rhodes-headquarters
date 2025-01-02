<script setup lang="ts">
import type { Character } from '~/types'

const props = defineProps<{
  character: Character
}>()

const src = computed(() => {
  return `https://web.hycdn.cn/arknights/game/assets/char_skin/avatar/${encodeURIComponent(props.character.skinId)}.png`
})
</script>

<template>
  <div>
    <img :src="src">
  </div>
</template>
