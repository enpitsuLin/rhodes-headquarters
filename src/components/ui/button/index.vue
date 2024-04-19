<script setup lang="ts">
import { buttonVariants } from './variants'
import type { ButtonProps } from './variants'

defineOptions({
  inheritAttrs: true,
})

withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
})
</script>

<template>
  <component :is="as" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')">
    <div
      v-if="variant === 'animate-outline'"
      absolute top-0 left-0
      h="20% group-hover:50%" w-full
      border="~ border b-0 group-hover:primary"
      transition="all duration-150"
    />
    <slot />
    <div
      v-if="variant === 'animate-outline'"
      absolute bottom-0 left-0
      h="20% group-hover:50%" w-full
      border="~ border t-0 group-hover:primary"
      transition="all duration-150"
    />
  </component>
</template>
