<script setup lang="ts">
import { toValue, useToggle } from '@vueuse/core'
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import { createUrl } from '~/composables/user'
import { storageAccounts } from '~/logic'
import type { SklandResponseBody, SklandUser } from '~/types'

const apiEndpoint = createUrl('/api/v1/user/me')

const [state, send] = useMachine(dialog.machine({ id: '1' }))
const api = computed(() => dialog.connect(state.value, send, normalizeProps))

const cred = ref('')
const [loading, toggleLoading] = useToggle(false)

async function onCredChange() {
  if (toValue(cred).length === 0)
    return
  toggleLoading(true)
  try {
    const response = await fetch(apiEndpoint, { headers: { cred: toValue(cred) } })
    const data = await response.json() as SklandResponseBody<SklandUser>
    const accountExisted = storageAccounts.value.find(i => i.id === data.data.user.id)
    if (accountExisted) {
      if (toValue(cred) !== accountExisted.cred)
        accountExisted.cred = cred.value
    }
    else {
      storageAccounts.value.push({ ...data.data.user, cred: toValue(cred) })
    }
  }
  catch (error) {

  }
  finally {
    toggleLoading(false)
    api.value.close()
  }
}
function onRemoveClick(id: string) {
  storageAccounts.value = storageAccounts.value.filter(i => i.id !== id)
}
</script>

<template>
  <OptionsSection title="账号管理" sub-title="Account Manage">
    <template #title-extra>
      <button
        ref="ref" v-bind="api.triggerProps"
        border="~ white hover:primary"
        transition="all ease-in duration-300"
        bg="transparent hover:primary" c="hover:black" p="x10 y3"
      >
        <span text-base>新增账号</span>
      </button>
    </template>
    <div v-if="storageAccounts.length === 0">
      <span text-xl>暂无账号</span>
      <p>No Account</p>
    </div>
    <div
      v-for="account in storageAccounts" :key="account.id"
      flex="~ items-center gap-2"
    >
      <div relative w-10 h-10 rounded-lg of-hidden bg-white>
        <img :src="account.avatar">
      </div>
      <div text-lg flex-1>
        {{ account.nickname }}
      </div>
      <div
        i-ri:close-fill h-4 w-4 cursor-pointer
        transition="colors ease-in duration-300"
        bg="hover:primary"
        @click="onRemoveClick(account.id)"
      />
    </div>
  </OptionsSection>

  <Teleport to="body">
    <div v-if="api.isOpen" fixed inset-0>
      <div v-bind="api.backdropProps" fixed inset-0 bg-black:20 />
      <div v-bind="api.containerProps" fixed inset-0 flex="~ items-center justify-center">
        <div v-bind="api.contentProps" min-w-80 bg-white rounded-md p-5 relative>
          <h2 v-bind="api.titleProps" text-lg mb-2 font-semibold>
            添加账号
          </h2>
          <p v-bind="api.descriptionProps" mb-3>
            如何获取凭据可以参考
          </p>
          <button
            v-bind="api.closeTriggerProps"
            absolute top-5 right-5 p-1
            border="rounded"
            bg="hover:neutral/20"
          >
            <div i-ri:close-fill w-4 h-4 />
          </button>
          <div>
            <input v-model="cred" placeholder="输入账号凭据">
            <button bg="hover:primary" px-3 py-2 rounded @click="onCredChange()">
              {{ loading ? 'loading...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
