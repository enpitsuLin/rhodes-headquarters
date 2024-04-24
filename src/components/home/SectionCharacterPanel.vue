<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { useRouter } from 'vue-router/auto'
import { useDialog } from '@/composables/use-dialog'
import { usePresence } from '@/composables/use-presence'

const open = defineModel<boolean>('open', { required: true })

const nodeRef = ref<HTMLDivElement | null>(null)

const router = useRouter()
const { meta, control } = useMagicKeys()

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

function toOptions() {
  // TODO 确定一下 PC 上 control 键，可以判断环境再判断键位
  if (meta.value || control.value)
    browser.runtime.openOptionsPage()
  else router.push('/preferences')
}
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
          <div flex="~ items-center justify-between" flex-1 px-10px>
            <div flex="~ items-baseline" pb-1 pl-2>
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
            <button type="button" c="white hover:primary" @click="toOptions">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 15C17.306 15 18.418 15.835 18.83 17H20C20.2652 17 20.5196 17.1054 20.7071 17.2929C20.8946 17.4804 21 17.7348 21 18C21 18.2652 20.8946 18.5196 20.7071 18.7071C20.5196 18.8946 20.2652 19 20 19H18.83C18.6234 19.5855 18.2403 20.0926 17.7334 20.4512C17.2265 20.8099 16.6209 21.0025 16 21.0025C15.3791 21.0025 14.7735 20.8099 14.2666 20.4512C13.7597 20.0926 13.3766 19.5855 13.17 19H4C3.73478 19 3.48043 18.8946 3.29289 18.7071C3.10536 18.5196 3 18.2652 3 18C3 17.7348 3.10536 17.4804 3.29289 17.2929C3.48043 17.1054 3.73478 17 4 17H13.17C13.377 16.4149 13.7603 15.9084 14.2671 15.5502C14.774 15.1921 15.3794 14.9998 16 15ZM16 17C15.7348 17 15.4804 17.1054 15.2929 17.2929C15.1054 17.4804 15 17.7348 15 18C15 18.2652 15.1054 18.5196 15.2929 18.7071C15.4804 18.8946 15.7348 19 16 19C16.2652 19 16.5196 18.8946 16.7071 18.7071C16.8946 18.5196 17 18.2652 17 18C17 17.7348 16.8946 17.4804 16.7071 17.2929C16.5196 17.1054 16.2652 17 16 17ZM8 9C8.58899 8.99992 9.16497 9.17322 9.65613 9.49829C10.1473 9.82336 10.5319 10.2858 10.762 10.828L10.829 11H20C20.2549 11.0003 20.5 11.0979 20.6854 11.2728C20.8707 11.4478 20.9822 11.687 20.9972 11.9414C21.0121 12.1958 20.9293 12.4464 20.7657 12.6418C20.6021 12.8373 20.3701 12.9629 20.117 12.993L20 13H10.83C10.6284 13.5703 10.2592 14.0663 9.77073 14.4231C9.28229 14.7799 8.69744 14.9808 8.09285 14.9994C7.48827 15.018 6.89217 14.8534 6.38273 14.5273C5.87328 14.2012 5.47427 13.7288 5.238 13.172L5.17 13H4C3.74512 12.9997 3.49997 12.9021 3.31463 12.7272C3.1293 12.5522 3.01777 12.313 3.00283 12.0586C2.98789 11.8042 3.07067 11.5536 3.23426 11.3582C3.39786 11.1627 3.6299 11.0371 3.883 11.007L4 11H5.17C5.37701 10.4149 5.76032 9.90842 6.26715 9.55024C6.77397 9.19206 7.37938 8.99982 8 9ZM8 11C7.73478 11 7.48043 11.1054 7.29289 11.2929C7.10536 11.4804 7 11.7348 7 12C7 12.2652 7.10536 12.5196 7.29289 12.7071C7.48043 12.8946 7.73478 13 8 13C8.26522 13 8.51957 12.8946 8.70711 12.7071C8.89464 12.5196 9 12.2652 9 12C9 11.7348 8.89464 11.4804 8.70711 11.2929C8.51957 11.1054 8.26522 11 8 11ZM16 3C17.306 3 18.418 3.835 18.83 5H20C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H18.83C18.6234 7.58553 18.2403 8.09257 17.7334 8.45121C17.2265 8.80986 16.6209 9.00245 16 9.00245C15.3791 9.00245 14.7735 8.80986 14.2666 8.45121C13.7597 8.09257 13.3766 7.58553 13.17 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H13.17C13.377 4.41493 13.7603 3.90842 14.2671 3.55024C14.774 3.19206 15.3794 2.99982 16 3ZM16 5C15.7348 5 15.4804 5.10536 15.2929 5.29289C15.1054 5.48043 15 5.73478 15 6C15 6.26522 15.1054 6.51957 15.2929 6.70711C15.4804 6.89464 15.7348 7 16 7C16.2652 7 16.5196 6.89464 16.7071 6.70711C16.8946 6.51957 17 6.26522 17 6C17 5.73478 16.8946 5.48043 16.7071 5.29289C16.5196 5.10536 16.2652 5 16 5Z" fill="currentColor" />
              </svg>
            </button>
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
