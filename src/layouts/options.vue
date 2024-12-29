<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router/auto'

const query = useUrlSearchParams<{ to?: string }>()

const router = useRouter()

const route = useRoute()

if (query.to === 'preferences') {
  router
    .replace({
      name: '/preferences',
    })
    .then(() => {
      delete query.to
    })
}

const showBack = location.pathname !== '/options.html'

onBeforeRouteLeave((_to, _from, next) => {
  if (document.startViewTransition) {
    document.startViewTransition(next)
    return
  }

  next()
})
</script>

<template>
  <div bg="background" relative h-full w-full>
    <header relative h-160px w-full select-none of-hidden class="from-#0C4D78:0 to-#0C4D78:80 bg-gradient-linear">
      <div v-if="showBack" pt-3>
        <button @click="$router.go(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z" />
          </svg>
        </button>
      </div>
      <div absolute left="-20px" bottom="-20px">
        <span text-nowrap text-65px font-bold tracking="-11%" c="background">
          {{ route.meta.backgroundTitle }}
        </span>
      </div>

      <div absolute left-0 top-71px h-70px border="l-4px primary" p="l-11px t-9px">
        <div :key="route.path" flex items-center view-transition-navbar-title>
          <svg text-primary width="10" height="32" viewBox="0 0 10 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0H0V32H10V26.5H4.7619V5H10V0Z" fill="currentColor" />
          </svg>
          <span text-35px font-bold>{{ route.meta.title }}</span>
          <svg text-primary width="10" height="32" viewBox="0 0 10 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32H10L10 0H0V5.5H5.2381L5.2381 27H0V32Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div absolute bottom-18px left-15px text-primary>
        <svg width="319" height="5" viewBox="0 0 319 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.6">
            <rect width="5" height="5" fill="currentColor" />
            <line x1="5" y1="2.5" x2="319" y2="2.5" stroke="currentColor" />
          </g>
        </svg>
      </div>
    </header>
    <main absolute left-15px right-15px top-145px :class="route.meta.contentClass">
      <RouterView />
    </main>
    <RouterView name="fab" />
  </div>

  <nav v-if="!showBack" absolute left-0 right-0 flex="~" border="t-1 border/30">
    <RouterLink
      to="/options" role="button" w="1/2"
      relative block bg-background:60 py-3 text-center font-bold
      active-class="active after:(content-empty absolute bottom-0 inset-x-0 h-3px bg-primary view-transition-navbar-active)"
    >
      账号管理
    </RouterLink>
    <RouterLink
      to="/preferences" role="button" w="1/2"
      relative block bg-background:60 py-3 text-center font-bold
      active-class="active after:(content-empty absolute bottom-0 inset-x-0 h-3px bg-primary view-transition-navbar-active)"
    >
      系统设置
    </RouterLink>
  </nav>
</template>

<style>
::view-transition-group(navbar-title) {
  --at-apply: animate-duration-300;
}

::view-transition-old(navbar-title)  {
  --at-apply: animate-out slide-out-to-left fade-out op-0;
}

::view-transition-new(navbar-title) {
  --at-apply: animate-in slide-in-from-left fade-in;
}
</style>
