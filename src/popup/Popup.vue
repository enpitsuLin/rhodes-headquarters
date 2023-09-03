<script setup lang="ts">
import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import { useAllBinding, usePlayerInfo } from '~/composables/user'
import { storageUid } from '~/logic'
import type { SklandBinding } from '~/types'

const { data } = useAllBinding()

const {
  data: userInfo,
} = usePlayerInfo()

const [state, send] = useMachine(
  menu.machine({
    'id': 'menu',
    'aria-label': 'Role',
    onSelect({ value }) {
      storageUid.value = value
    },
  }),
)

const api = computed(() => menu.connect(state.value, send, normalizeProps))

function getRoleList(list: SklandBinding[]) {
  return list.filter(i => i.appCode === 'arknights').map(i => i.bindingList).flat()
}
</script>

<template>
  <main class="w-350px min-h-350px px-4 py-5 bg-main">
    <button v-bind="api.triggerProps">
      选择角色 <span aria-hidden>▾</span>
    </button>
    <Teleport to="body">
      <div v-bind="api.positionerProps" bg-black c-white>
        <div v-bind="api.contentProps">
          <div v-for="item in data" :key="item.account.id" p-4>
            <div>账号:{{ item.account.nickname }}</div>
            <div pl-4>
              <ul>
                <li
                  v-for="role in getRoleList(item.list)"
                  :key="role.uid"
                  v-bind="api.getItemProps({ id: role.uid })"
                >
                  {{ role.nickName }} uid:{{ role.uid }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <div v-if="userInfo">
      <BaseStatus :status="userInfo.status" />
      <Recruit :recruits="userInfo.recruit" :hire="userInfo.building.hire" />
    </div>
  </main>
</template>
