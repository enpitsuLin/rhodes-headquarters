<script setup lang="ts">
import { DialogBackdrop, DialogContent, DialogPositioner, DialogRoot, DialogTitle } from '@ark-ui/vue'
import { useAsyncState } from '@vueuse/core'
import { getBackgroundService } from '~/service'
import { useAccountsStore } from '~/store/account'
import { useDeviceId } from '~/composables/storages'

const open = defineModel<boolean>('open', { required: true })

const accountService = getBackgroundService()
const accountsStore = useAccountsStore()

const toast = useToast()

const token = ref('')
const errorMessage = ref('')

const { state: deviceId, isLoading: isLoadingDeviceId } = useDeviceId()

const { isLoading, execute } = useAsyncState(
  async () => {
    if (token.value) {
      const binding = await accountService.signIn(token.value, deviceId.value)
      binding.forEach(({ info, role, account }) => {
        accountsStore.addAccount(account)
        accountsStore.addRole(role)
        accountsStore.setInfoMapping(role.uid, info)
      })

      if (accountsStore.characters.length === 1)
        accountsStore.setCurrentUid(accountsStore.characters[0].uid)

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
  <DialogRoot v-model:open="open">
    <Teleport to="body">
      <DialogBackdrop
        fixed inset-0 z-100 bg-border:10 backdrop-blur-3
        class="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:fade-out"
      />
      <DialogPositioner fixed inset-0 z-200 flex="~ items-center justify-center">
        <DialogContent
          shadow="lg" relative w-320px bg-background
          class="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:fade-in-90 data-[state=closed]:fade-out data-[state=open]:slide-in-from-bottom-10"
        >
          <DialogTitle flex="~ items-end" border="l-5px primary" relative h-50px select-none>
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
              <span text-base c-border font-bold>
                ACCOUNT
              </span>
            </div>
            <div absolute bottom-1px left-16px h-1px w-300px bg-border>
              <div absolute size-3px left="-1px" bottom="-1px" bg-border />
            </div>
          </DialogTitle>
          <main>
            <div p-4 space-y-2>
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
                  v-model="token" type="text" border="~ border [&.warning]:red focus:primary" p="x-3 y2" flex-1
                  bg-background outline-none :class="!!errorMessage && 'warning animate-shake'"
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
              v-if="isLoadingDeviceId" h-32px w-250px p-10px bg="[url(~/assets/btn-bg.svg)]"
              flex="inline justify-center items-center"
            >
              初始化中
            </button>
            <button
              v-else :disabled="isLoading || isLoadingDeviceId" h-32px w-250px p-10px
              bg="[url(~/assets/btn-bg.svg)]" flex="inline justify-center items-center" @click="execute()"
            >
              {{ isLoading || isLoadingDeviceId ? 'Loading...' : '新增账户' }}
            </button>
          </footer>
        </DialogContent>
      </DialogPositioner>
    </Teleport>
  </DialogRoot>
</template>
