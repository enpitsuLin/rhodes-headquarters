<script setup lang="ts">
defineProps<{ title: string;subTitle: string }>()
</script>

<template>
  <section p-4>
    <div border="l t-3.75rem b-3.75rem t-transparent b-transparent" w-400px flex="~ col" min-h-400px>
      <div p-4 flex="~ items-center justify-between" h-100px>
        <header>
          <h2 text-xl>
            {{ title }}
          </h2>
          <p>{{ subTitle }}</p>
        </header>
        <slot name="title-extra" />
      </div>
      <div aria-hidden="true" border="b r-4rem r-transparent" />
      <div p-4 flex-1>
        <slot />
      </div>
    </div>
  </section>
</template>
