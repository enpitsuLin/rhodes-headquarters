<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useDialog } from '@/composables/use-dialog'
import { usePresence } from '@/composables/use-presence'

const open = defineModel<boolean>('open', { required: true })

const nodeRef = ref<HTMLDivElement | null>(null)

const accountService = getAccountService()

const toast = useToast()

const token = ref('')
const errorMessage = ref('')

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
    errorMessage.value = ''
    token.value = ''
  },
})

watch(nodeRef, () => {
  if (nodeRef.value) {
    const node = nodeRef.value
    if (node)
      presenceApi.value.setNode(node)
  }
})

const { isLoading, execute } = useAsyncState(
  async () => {
    if (token.value) {
      await accountService.logInOrRefreshAccount(token.value)
      return true
    }
    throw new Error('凭证为空')
  },
  false,
  {
    immediate: false,
    onSuccess() {
      toast.create({
        title: '新增成功',
        notification: false,
      })
      token.value = ''
      open.value = false
    },
    onError(e) {
      if ((e as Error).toString().includes('FetchError'))
        errorMessage.value = '验证出错'
      else
        errorMessage.value = (e as Error).message
    },
  },
)
</script>

<template>
  <slot />
  <Teleport to="body">
    <div v-if="presenceApi.present" fixed inset-0>
      <div
        v-bind="api.backdropProps" fixed inset-0 z-100 bg-border:10 backdrop-blur-3
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out"
      />
      <div v-bind="api.positionerProps" fixed inset-0 z-200 flex="~ items-center justify-center">
        <div
          ref="nodeRef"
          v-bind="api.contentProps" shadow="lg" w-320px relative
          flex="~ col" bg-background
          class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:fade-out"
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
                <span text-base font-bold>新增账户</span>
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
            <div absolute bottom-1px left-16px h-1px w-300px bg-border>
              <div absolute size-3px left="-1px" bottom="-1px" bg-border />
            </div>
          </header>
          <main>
            <div space-y-2 p-4>
              <p>1. 打开森空岛网页版并登录</p>
              <p>
                2. 登录森空岛网页版后，打开 <a
                  href="https://web-api.skland.com/account/info/hg"
                  target="_blank"
                >https://web-api.skland.com/account/info/hg</a> 记下 content 字段的值
              </p>
              <p>3. 在下面输入获取到的值</p>
              <div flex="~" relative>
                <input
                  v-model="token"
                  type="text"
                  bg-background border="~ border [&.warning]:red focus:primary"
                  flex-1 p="x-3 y2" outline-none
                  :class="!!errorMessage && 'warning animate-shake'"
                  @focus="errorMessage = ''"
                >
                <p absolute text-xs c-red bottom="-4.5">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </main>
          <footer p="t-5px b-13px" flex="~ justify-center">
            <button
              :disabled="isLoading"
              w-250px h-32px p-10px
              bg="[url(./btn-bg.svg)]"
              flex="inline justify-center items-center"
              @click="execute()"
            >
              {{ isLoading ? 'Loading...' : '新增账户' }}
            </button>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>
