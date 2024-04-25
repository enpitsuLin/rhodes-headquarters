<script setup lang="ts">
import PreferenceItem from '@/components/preferences/PreferenceItem.vue'
import Switch from '@/components/ui/Switch.vue'
import { preferenceStorage } from '@/store/preference'
import OptionLayout from '~/components/layouts/options.vue'

const preferences = useWxtStorage(preferenceStorage)

function onChange(e: Event) {
  const periodInMinutes = Number((e.target as HTMLInputElement).value)

  preferences.value.periodInMinutes = periodInMinutes === 0
    ? preferenceStorage.defaultValue.periodInMinutes
    : periodInMinutes
}
</script>

<template>
  <OptionLayout
    title="系统设置"
    background-title="Preferences"
    content-class="bg-secondary-background"
  >
    <ul flex="~ col gap-10px" p-10px>
      <li>
        <PreferenceItem title="刷新时间" description="定时刷新游戏角色最新数据的时间，单位分钟，默认 10 分钟。">
          <input
            :placeholder="preferences.periodInMinutes.toString()"
            type="input" inputmode="numeric"
            bg="transparent" w-36px h-30px
            border="~ border focus:primary rounded-sm" px-2 py-2 outline-none
            @change="onChange"
          >
        </PreferenceItem>
      </li>
      <li>
        <PreferenceItem title="多账户提醒(WIP)" description="对非当前账户的其余账户信息提供可用提醒，如理智即将恢复，公招即将结束等。">
          <Switch v-model="preferences.charactersAlarmsEnable" />
        </PreferenceItem>
      </li>
    </ul>
  </OptionLayout>
</template>
