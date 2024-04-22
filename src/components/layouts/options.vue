<script setup lang="ts">
interface Props {
  title: string
  backgroundTitle: string
  contentClass?: string
}

defineProps<Props>()
</script>

<template>
  <div bg="#222325" h-full w-full relative>
    <header
      h-160px w-full
      relative of-hidden
      class="from-#0C4D78:0 to-#0C4D78:80 bg-gradient-linear"
    >
      <div
        absolute left-0 top-71px h-70px
        border="l-4px primary"
        z-10 p="l-11px t-9px" relative
      >
        <div flex items-center>
          <svg text-primary width="10" height="32" viewBox="0 0 10 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0H0V32H10V26.5H4.7619V5H10V0Z" fill="currentColor" />
          </svg>
          <span text-35px font-bold>{{ title }}</span>
          <svg text-primary width="10" height="32" viewBox="0 0 10 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32H10L10 0H0V5.5H5.2381L5.2381 27H0V32Z" fill="currentColor" />
          </svg>
        </div>
        <div absolute left-15px bottom-1px text-primary>
          <svg width="319" height="5" viewBox="0 0 319 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.6">
              <rect width="5" height="5" fill="currentColor" />
              <line x1="5" y1="2.5" x2="319" y2="2.5" stroke="currentColor" />
            </g>
          </svg>
        </div>
      </div>

      <div absolute left="-20px" bottom="-20px">
        <span
          text-nowrap font-bold text-65px
          tracking="-11%" c="#222325"
        >
          {{ backgroundTitle }}
        </span>
      </div>
    </header>
    <main
      absolute
      left-15px right-15px top-145px
      :class="contentClass"
    >
      <slot />
    </main>
  </div>
</template>
