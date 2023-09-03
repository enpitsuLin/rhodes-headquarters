<script setup lang="ts">
import * as tabs from '@zag-js/tabs'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

const data = [{ id: 'account', label: '账号' }, { id: 'settings', label: '设置' }]

const [state, send] = useMachine(tabs.machine({ id: '1', value: 'account' }))
const api = computed(() => tabs.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="bg-main" h-screen flex="~ items-start justify-center">
    <nav absolute top-8 right-20>
      <div v-bind="api.tablistProps" flex="~ col" w-16>
        <button
          v-for="item in data"
          v-bind="api.getTriggerProps({ value: item.id })"
          :key="item.id"
          transition="transform ease-in duration-150"
          class="hover:translate-x--4"
          py-5 :c="api.value === item.id ? 'primary' : ''"
        >
          <div relative transition="colors ease-in duration-150">
            {{ item.label }}
            <div
              v-if="api.value === item.id"
              absolute top-0 right-0
              h-full border="l-4 primary"
            />
          </div>
        </button>
      </div>
    </nav>
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease"
      leave-active-class="transition-all duration-300 ease"
      enter-from-class="op-0 -translate-y-full"
      leave-to-class="op-0 -translate-y-full"
    >
      <div v-for="item in data" v-show="api.value === item.id" :key="item.id" v-bind="api.getContentProps({ value: item.id })">
        <OptionsAccount v-if="item.id === 'account'" />
        <OptionsSettings v-if="item.id === 'settings'" />
      </div>
    </TransitionGroup>
  </main>
</template>
