<script setup lang="ts">
import { toValue, useToggle } from '@vueuse/core'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import { usePort } from '@/composables/port'
import { useSetCurrentAccount } from '@/composables/account'
import Button from '~/components/ui/button/index.vue'
import OptionsAccount from '@/components/OptionsAccount.vue'

const [state, send] = useMachine(dialog.machine({ id: '1' }))
const api = computed(() => dialog.connect(state.value, send, normalizeProps))

const token = ref('')
const [loading, toggleLoading] = useToggle(false)

const accounts = useAccounts()
const setCurrentAccountId = useSetCurrentAccount()

const port = usePort()

function onLogOut(pendingDelAccountId: string) {
  accounts.value = accounts.value.filter(a => a.id !== pendingDelAccountId)
}

async function onLogIn() {
  if (toValue(token).length === 0)
    return
  toggleLoading(true)
  await sendMessage(
    port,
    createMessage(
      'login',
      { token: token.value },
    ),
  )
  toggleLoading(false)
  api.value.close()
}
</script>

<template>
  <header px-4 pt-6 flex="~ items-center justify-between">
    <div flex-1>
      <h2 text-xl>
        账号管理
      </h2>
      <p>Account</p>
    </div>
    <Button v-bind="api.triggerProps">
      <span>新增账号</span>
    </Button>
  </header>
  <main p-4>
    <ul>
      <li v-for="account in accounts" :key="account.id">
        <OptionsAccount :account="account" @log-out="onLogOut" @set-current="setCurrentAccountId" />
      </li>
    </ul>
  </main>
  <Teleport to="body">
    <div v-if="api.isOpen" fixed inset-0>
      <div v-bind="api.backdropProps" fixed inset-0 bg-border:10 backdrop-blur-3 />
      <div v-bind="api.positionerProps" fixed inset-0 flex="~ items-center justify-center">
        <div
          v-bind="api.contentProps"
          shadow="lg" w-100 relative
          bg-background:60 c-foreground
        >
          <button
            flex="~ items-center justify-center" size-7 rounded-full
            class="absolute -top-3.5 -right-3.5 dark:bg-#595959" v-bind="api.closeTriggerProps"
          >
            <div i-ic:round-close w-4 h-4 />
          </button>
          <header v-bind="api.titleProps" text-2xl font-semibold bg="background" p-5>
            添加账号
          </header>
          <main bg="#dedddd dark:#323333">
            <div p-5>
              <h3 text-lg>
                如何获得凭据
              </h3>
              <div space-y-2 py-4>
                <p>1. 打开森空岛网页版并登录</p>
                <p>
                  2. 登录森空岛网页版后，打开 <a
                    href="https://web-api.skland.com/account/info/hg"
                    target="_blank"
                  >https://web-api.skland.com/account/info/hg</a> 记下 content 字段的值
                </p>
                <p>3. 在下面输入获取到的值</p>
              </div>
              <input
                v-model="token"
                outline="~ border focus:primary"
                w-full bg-transparent placeholder="输入账号凭据"
                p-3
              >
            </div>

            <button
              type="button"
              w-full bg-background
              py-4 c="foreground active:op-80"
              @click="onLogIn()"
            >
              {{ loading ? 'loading...' : '保存' }}
            </button>
          </main>
        </div>
      </div>
    </div>
  </Teleport>
</template>
