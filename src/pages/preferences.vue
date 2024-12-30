<script setup lang="ts">
import type { NumberInputValueChangeDetails } from '@ark-ui/vue/number-input'
import { NumberInput } from '@ark-ui/vue/number-input'
import { useDebounceFn } from '@vueuse/core'
import PreferenceItem from '~/components/preferences/PreferenceItem.vue'
import Switch from '~/components/ui/Switch.vue'
import { usePreference } from '~/composables/storages'

definePage({
  meta: {
    layout: 'options',
    title: '系统设置',
    backgroundTitle: 'Preferences',
    contentClass: 'bg-secondary-background',
  },
})

const preferences = usePreference()

const debounceOnChange = useDebounceFn((e: NumberInputValueChangeDetails) => {
  const periodInMinutes = Number(e.value)

  if (periodInMinutes !== 0)
    preferences.value.periodInMinutes = periodInMinutes
  else
    preferences.value.periodInMinutes = 10
}, 1000)
</script>

<template>
  <ul flex="~ col gap-10px" p-10px>
    <li>
      <PreferenceItem title="刷新时间" description="定时刷新游戏角色最新数据的时间，单位分钟，默认 10 分钟。">
        <NumberInput.Root
          :model-value="preferences.periodInMinutes.toString()"
          allow-mouse-wheel
          relative border="~ border focus-within:primary rounded-sm" pr-4
          class="group"
          @value-change="debounceOnChange"
        >
          <NumberInput.Label sr-only>
            Label
          </NumberInput.Label>
          <NumberInput.Input
            bg="transparent"
            h-30px w-36px px-2 py-2 outline-none
          />
          <NumberInput.Control
            flex="~ col items-center justify-center"
            border="l border group-focus-within:primary rounded-sm"
            absolute inset-y-0 right-0 w-4
          >
            <NumberInput.IncrementTrigger class="i-carbon:chevron-up group-focus-within:c-primary" bg="hover:white/50" mb-1px />
            <div h-1px w-full bg="border group-focus-within:primary" />
            <NumberInput.DecrementTrigger class="i-carbon:chevron-down group-focus-within:c-primary" bg="hover:white/50" mt-1px />
          </NumberInput.Control>
        </NumberInput.Root>
      </PreferenceItem>
    </li>
    <li>
      <PreferenceItem title="多账户提醒(WIP)" description="对非当前账户的其余账户信息提供可用提醒，如理智即将恢复，公招即将结束等。">
        <Switch v-model="preferences.charactersAlarmsEnable" />
      </PreferenceItem>
    </li>
  </ul>
</template>
