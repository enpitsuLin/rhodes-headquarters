<script setup lang="ts">
import { useDialog } from '@/composables/use-dialog'
import { usePresence } from '@/composables/use-presence'

const open = defineModel<boolean>('open', { required: true })

const nodeRef = ref<HTMLDivElement | null>(null)

const api = useDialog({
  open,
  onOpenChange(to) {
    open.value = to
  },
})

const presenceApi = usePresence({
  present: computed(() => api.value.open),
  onExitComplete: () => {
    open.value = false
  },
})

watch(nodeRef, () => {
  if (nodeRef.value) {
    const node = nodeRef.value
    if (node)
      presenceApi.value.setNode(node)
  }
})
</script>

<template>
  <div v-if="presenceApi.present" absolute inset-0>
    <div
      v-bind="api.backdropProps"
      absolute inset-0 z-100 bg-border:10 backdrop-blur-3
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out"
    />
    <div v-bind="api.positionerProps" absolute top-0 bottom-0 right-0 z-200 flex="~ items-center justify-center">
      <div
        ref="nodeRef"
        v-bind="api.contentProps"
        shadow="lg" w-270px relative h-full
        flex="~ col" bg-background
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full"
      >
        <header v-bind="api.titleProps" h-50px relative flex="~ items-end" border="l-5px primary" select-none>
          <div flex="~ items-baseline" pb-1 pl-4>
            <div flex="~ items-center">
              <svg c-border width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_256_438)">
                  <path d="M6 3V0H0V17.991V18H6V15H3V3H6Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_256_438">
                    <rect width="6" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span text-base font-bold>账户列表</span>
              <svg c-border width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_256_441)">
                  <path d="M0 3V0H6V17.991V18H0V15H3V3H0Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_256_441">
                    <rect width="6" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span c-border text-base font-bold>
              ACCOUNT
            </span>
          </div>
          <div absolute bottom-1px left-16px h-1px w-249px bg-border>
            <div absolute size-3px left="-1px" bottom="-1px" bg-border />
          </div>
        </header>
        <main>
          //
        </main>
      </div>
    </div>
  </div>
</template>
