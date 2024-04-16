<script setup lang="ts">
defineProps<{ title: string, subTitle: string }>()
</script>

<template>
  <section>
    <header flex="~ items-baseline gap-2" p="b-1 x-2">
      <h2 text-xl>
        {{ title }}
      </h2>
      <span>{{ subTitle }}</span>
    </header>
    <div aria-hidden="true" border="b r-4rem r-transparent" />
    <div p="t-1 x-2">
      <slot />
    </div>
  </section>
</template>
