<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import { useBinding, usePlayerInfo } from '~/composables/user'

declare const __TEST_CRED__: string

const uid = ref('')

const {
  data: bindingData,
} = useBinding(__TEST_CRED__)

const {
  data: userInfo,
  execute,
} = usePlayerInfo(__TEST_CRED__, () => bindingData.value?.data.list[0].defaultUid ?? '')

const [state, send] = useMachine(
  menu.machine({
    'id': 'menu',
    'aria-label': 'Role',
    onSelect({ value }) {
      uid.value = value
      execute()
    },
  }),
)
const api = computed(() => menu.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="w-350px px-4 py-5 bg-main">
    <button v-bind="api.triggerProps">
      选择角色 <span aria-hidden>▾</span>
    </button>
    <Teleport to="body">
      <div v-bind="api.positionerProps" bg-black c-white>
        <div v-bind="api.contentProps">
          <div
            v-for="binding in bindingData?.data.list"
            :key="binding.defaultUid"
            flex="~ col" rounded-2xl
          >
            <div flex="~ items-baselin" select-none gap-2 p-3>
              <h3>{{ binding.appName }}</h3>
              <span>查询到 {{ binding.bindingList.length }} 个角色</span>
            </div>
            <div>
              <ul>
                <li v-for="role in binding.bindingList" :key="role.uid" v-bind="api.getItemProps({ id: role.uid })">
                  {{ role.nickName }} uid:{{ role.uid }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <div v-if="userInfo">
      <BaseStatus :status="userInfo.data.status" />
      <Recruit :recruits="userInfo.data.recruit" :hire="userInfo.data.building.hire" />
    </div>
  </main>
</template>
