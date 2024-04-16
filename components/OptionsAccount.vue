<script setup lang="ts">
import { toValue, useToggle } from '@vueuse/core'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import OptionsSection from './OptionsSection.vue'
import { currentUser, loginTo, setCurrentUserId, signOut, useUsers } from '~/composables/skland'

const [state, send] = useMachine(dialog.machine({ id: '1' }))
const api = computed(() => dialog.connect(state.value, send, normalizeProps))

const cred = ref('')
const [loading, toggleLoading] = useToggle(false)

async function onCredChange() {
  if (toValue(cred).length === 0)
    return
  toggleLoading(true)
  await loginTo(toValue(cred))
  toggleLoading(false)
  api.value.close()
}
const users = useUsers()
</script>

<template>
  <OptionsSection title="账号管理" sub-title="Account Manage">
    <template #title-extra>
      <button
        v-bind="api.triggerProps"
        border="~ white hover:primary"
        transition="all ease-in duration-300"
        bg="transparent hover:primary" c="hover:black" p="x10 y3"
      >
        <span text-base>新增账号</span>
      </button>
    </template>
    <div v-if="users.length === 0">
      <span text-xl>暂无账号</span>
      <p>No Account</p>
    </div>
    <div
      v-for="user in users" :key="user.account.id"
      flex="~ items-center gap-2"
    >
      <div relative w-10 h-10 rounded-lg of-hidden bg-white>
        <img :src="user.account.avatar">
      </div>
      <div text-lg flex-1>
        {{ user.account.nickname }}
        <div
          v-if="currentUser?.account.id === user.account.id"
          inline-block
          text-xs border="~ white rounded" p-1
          scale="80"
        >
          默认
        </div>
      </div>
      <button
        v-if="currentUser?.account.id !== user.account.id"
        border="~ white hover:primary"
        transition="all ease-in duration-300"
        bg="transparent hover:primary" c="hover:black" p="x2 y1"
        @click="setCurrentUserId(user.account.id)"
      >
        设为默认
      </button>
      <div
        i-ri:close-fill h-4 w-4 cursor-pointer
        transition="colors ease-in duration-300"
        bg="hover:primary"
        @click="signOut(user.account.id)"
      />
    </div>
  </OptionsSection>

  <Teleport to="body">
    <div v-if="api.isOpen" fixed inset-0>
      <div v-bind="api.backdropProps" fixed inset-0 bg-black:30 filter-blur-lg />
      <div v-bind="api.positionerProps" fixed inset-0 flex="~ items-center justify-center">
        <div
          v-bind="api.contentProps"
          shadow="lg"
          w-100 rounded-md relative
          bg-background c-white
        >
          <h2
            v-bind="api.titleProps"
            text-2xl font-semibold border="b white/20" p-5
          >
            添加账号
          </h2>
          <button
            v-bind="api.closeTriggerProps"
            absolute top-5 right-5 p-1
            border="rounded"
            bg="hover:neutral/20"
          >
            <div i-ri:close-fill w-4 h-4 />
          </button>

          <div p-5>
            <h3 text-lg>
              如何获得凭据
            </h3>
            <div space-y-2 py-4>
              <p>1. 打开森空岛网页版并登录</p>
              <p>2. 登录森空岛网页版后，打开 <a href="https://web-api.skland.com/account/info/hg" target="_blank">https://web-api.skland.com/account/info/hg</a> 记下 content 字段的值</p>
              <p>3. 在下面输入获取到的值</p>
            </div>
            <div w-full flex="~ col gap-4">
              <input
                v-model="cred"
                border="~ focus:primary"
                outline-none
                w-full bg-transparent placeholder="输入账号凭据"
                p-3
              >
              <button
                w-full
                border="~ white hover:primary"
                transition="all ease-in duration-300"
                bg="transparent hover:primary" c="hover:black" p="x10 y3"
                @click="onCredChange()"
              >
                {{ loading ? 'loading...' : '保存' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
