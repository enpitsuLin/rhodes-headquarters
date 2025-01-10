<script setup lang="ts">
import { Tabs } from '@ark-ui/vue'
import Dialog from '~/components/ui/Dialog.vue'
import MethodAccount from './MethodAccount.vue'
import MethodOAuth from './MethodOAuth.vue'
import MethodScan from './MethodScan.vue'

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Dialog v-model:open="open">
    <Tabs.Root default-value="phone" flex="~ col items-center" pt-2>
      <Tabs.List
        flex="~ items-center justify-between"
        relative box-content bg-background p-1px border="~ border rounded-full"
      >
        <Tabs.Indicator h="$height" w="$width" rounded-full bg-primary />
        <Tabs.Trigger value="phone" relative w-70px py-1 text-sm outline-none>
          账号
        </Tabs.Trigger>
        <Tabs.Trigger value="scan" relative w-70px py-1 text-sm outline-none>
          扫码
        </Tabs.Trigger>
        <Tabs.Trigger value="oauth" relative w-70px py-1 text-sm outline-none>
          OAuth
        </Tabs.Trigger>
      </Tabs.List>
      <div h-250px flex="~ col items-center justify-center">
        <Tabs.Content value="phone">
          <MethodAccount @close="open = false" />
        </Tabs.Content>
        <Tabs.Content value="scan">
          <MethodScan @close="open = false" />
        </Tabs.Content>
        <Tabs.Content value="oauth">
          <MethodOAuth @close="open = false" />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  </Dialog>
</template>
