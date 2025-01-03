<script setup lang="ts">
import type { ResidentCharacter } from '~/types/building'
import { storeToRefs } from 'pinia'
import ApHalf from '~/assets/icons/ap-half.svg'
import ApHigh from '~/assets/icons/ap-high.svg'
import ApLow from '~/assets/icons/ap-low.svg'
import StatusWorking from '~/assets/icons/status-working.svg'
import CharacterAvatar from '~/components/CharacterAvatar.vue'
import { useAccountsStore } from '~/store/account'

const props = defineProps<{
  resident: ResidentCharacter
}>()

const { info } = storeToRefs(useAccountsStore())

const character = computed(() => {
  return info.value!.chars.find(i => i.charId === props.resident.charId)
})

const showWorking = computed(() => {
  return !('targetSkill' in props.resident)
})

const ap = computed(() => {
  return props.resident.ap <= 0 && props.resident.index !== -1
    ? 100
    : props.resident.ap / 86400
})

const ApStatus = computed(() => {
  if (ap.value < 25) {
    return ApLow
  }
  if (ap.value < 75) {
    return ApHalf
  }
  return ApHigh
})
</script>

<template>
  <div relative select-none>
    <div absolute left-0 top-0 size-40px bg-background:30>
      <div v-if="showWorking" w-full flex="inline items-center justify-center gap-2px">
        <img size-10px :src="StatusWorking">
        <span text-8px>工作中</span>
      </div>
    </div>
    <CharacterAvatar
      v-if="character"
      border="~ border" size-40px
      :character="character"
    />
    <div relative h-2px w-full bg-white>
      <div absolute left-0 top="-5px" size-12px>
        <img :src="ApStatus">
      </div>

      <div h-full bg-primary :style="{ width: `${ap}%` }" />
    </div>
  </div>
</template>
