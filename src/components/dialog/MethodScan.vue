<script setup lang="ts">
import { QrCode } from '@ark-ui/vue/qr-code'
import { useMutation, useQuery } from '@pinia/colada'
import { useIntervalFn } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/popup'
import { useSkalandSignIn } from '~/composables/mutations/skland'

const emit = defineEmits<{ close: [] }>()

const enabled = ref(false)
const toast = useToast()

const { data, isLoading } = useQuery({
  key: ['genScanLoginUrl'],
  async query() {
    return sendMessage('api:hypergrayph:gen-scan-login-url', undefined)
  },
  enabled,
  refetchOnWindowFocus: false,
})

const { pause, resume } = useIntervalFn(
  intervalMutate,
  3000,
  {
    immediate: false,
  },
)

const {
  mutate: mutateSignIn,
} = useSkalandSignIn({
  onSuccess() {
    toast.create({
      title: '新增成功',
      notification: false,
    })
    emit('close')
  },
})

const { mutate: mutateGetTokenByScanCode } = useMutation({
  key: () => ['getTokenByScanCode'],
  async mutation(scanCode: string) {
    return sendMessage('api:hypergrayph:get-oauth-token-by-scan-code', scanCode)
  },
  onSuccess(data) {
    mutateSignIn(data)
  },
})

const { mutate } = useMutation({
  key: () => ['getScanStatus', String(data.value?.scanId)],
  async mutation() {
    return sendMessage('api:hypergrayph:get-scan-status', data.value!.scanId)
  },
  onSuccess(data) {
    if (data.msg === '已扫码待确认') {
      return
    }
    if (data.msg === '未扫码') {
      return
    }
    if (data.data.scanCode) {
      pause()
      mutateGetTokenByScanCode(data.data.scanCode)
    }
  },
})

function intervalMutate() {
  mutate()
}

watch(data, () => {
  if (data.value?.scanId) {
    resume()
  }
})
</script>

<template>
  <main>
    <button @click="enabled = true">
      激活
    </button>
    <div v-if="isLoading" size-100px>
      loading..
    </div>
    <template v-else-if="data?.scanUrl">
      <QrCode.Root :value="data.scanUrl" size-100px>
        <QrCode.Frame size-100px>
          <QrCode.Pattern fill-white />
        </QrCode.Frame>
      </QrCode.Root>
    </template>
  </main>
</template>
