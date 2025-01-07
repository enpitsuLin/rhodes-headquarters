<script setup lang="ts">
import { QrCode } from '@ark-ui/vue/qr-code'
import { useMutation, useQuery } from '@pinia/colada'
import { useIntervalFn } from '@vueuse/core'
import { genScanLoginUrl, getOAuthTokenByScanCode, getScanStatus } from '~/api'
import { useDeviceId } from '~/composables/storages'
import { getBackgroundService } from '~/service'
import { useAccountsStore } from '~/store/account'

const enabled = ref(false)
const accountService = getBackgroundService()
const accountsStore = useAccountsStore()
const toast = useToast()

const { state: deviceId, isLoading: isLoadingDeviceId } = useDeviceId()

const { data, isLoading } = useQuery({
  key: ['genScanLoginUrl'],
  async query() {
    return genScanLoginUrl()
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
} = useMutation({
  async mutation(token: string) {
    if (!token)
      throw new Error('凭证为空')

    return accountService.signIn(token, deviceId.value)
  },
  onSuccess(data) {
    data.forEach(({ info, role, account }) => {
      accountsStore.addAccount(account)
      accountsStore.addRole(role)
      accountsStore.setInfoMapping(role.uid, info)
    })

    if (accountsStore.characters.length === 1)
      accountsStore.setCurrentUid(accountsStore.characters[0].uid)

    toast.create({
      title: '新增成功',
      notification: false,
    })
  },
})

const { mutate: mutateGrantAuthorizeCode } = useMutation({
  key: () => ['grantAuthorizeCode'],
  async mutation(token: string) {
    return mutateSignIn(token)
  },
})

const { mutate: mutateGetTokenByScanCode } = useMutation({
  key: () => ['getTokenByScanCode'],
  async mutation(scanCode: string) {
    return getOAuthTokenByScanCode(scanCode)
  },
  onSuccess(data) {
    mutateGrantAuthorizeCode(data)
  },
})

const { mutate } = useMutation({
  key: () => ['getScanStatus', String(data.value?.scanId)],
  async mutation() {
    return getScanStatus(data.value!.scanId)
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
    <button :disabled="isLoadingDeviceId" @click="enabled = true">
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
