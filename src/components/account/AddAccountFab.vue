<script setup lang="ts">
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'

const [state, send] = useMachine(dialog.machine({ id: '1' }))
const api = computed(() => dialog.connect(state.value, send, normalizeProps))
</script>

<template>
  <button
    type="button"
    v-bind="api.triggerProps"
    shadow shadow-black:50
    absolute right-24px bottom-24px
    size-50px rounded-full bg="#35373c"
  >
    <div
      absolute left-5px top-5px
      size-40px bg="#494b50" rounded-full
      flex="inline items-center justify-center"
    >
      <div c="white hover:primary" transition-color>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 0H9V9H0V11H9V20H11V11H20V9H11V0Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  </button>
  <Teleport to="body">
    <div v-if="api.isOpen" fixed inset-0>
      <div v-bind="api.backdropProps" fixed inset-0 z-100 bg-border:10 backdrop-blur-3 />
      <div v-bind="api.positionerProps" fixed inset-0 z-200 flex="~ items-center justify-center">
        <div v-bind="api.contentProps" shadow="lg" w-100 relative bg-background:60 c-foreground>
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
            </div>
          </main>
        </div>
      </div>
    </div>
  </Teleport>
</template>
