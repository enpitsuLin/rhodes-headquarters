<script setup lang="ts">
import { DialogBackdrop, DialogContent, DialogPositioner, DialogRoot, DialogTitle, Tabs } from '@ark-ui/vue'
import MethodOAuth from './MethodOAuth.vue'
import MethodScan from './MethodScan.vue'

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <DialogRoot v-model:open="open">
    <Teleport to="body">
      <DialogBackdrop
        fixed inset-0 z-100 bg-border:10 backdrop-blur-3
        class="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:fade-out"
      />
      <DialogPositioner fixed inset-0 z-200 flex="~ items-center justify-center">
        <DialogContent
          shadow="lg" relative w-320px bg-background
          class="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:fade-in-90 data-[state=closed]:fade-out data-[state=open]:slide-in-from-bottom-10"
        >
          <DialogTitle flex="~ items-end" border="l-5px primary" relative h-50px select-none>
            <div flex="~ items-baseline" pb-1 pl-4>
              <div flex="~ items-center">
                <svg c-border width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_256_438)">
                    <path d="M6 3V0H0V17.991V18H6V15H3V3H6Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_256_438">
                      <rect width="6" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span text-base font-bold>新增账户</span>
                <svg c-border width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_256_441)">
                    <path d="M0 3V0H6V17.991V18H0V15H3V3H0Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_256_441">
                      <rect width="6" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span text-base c-border font-bold>
                ACCOUNT
              </span>
            </div>
            <div absolute bottom-1px left-16px h-1px w-300px bg-border>
              <div absolute size-3px left="-1px" bottom="-1px" bg-border />
            </div>
          </DialogTitle>
          <Tabs.Root default-value="oauth" flex="~ col items-center" pt-2>
            <Tabs.List
              flex="~ items-center justify-between"
              relative box-content bg-background p-1px border="~ border rounded-full"
            >
              <Tabs.Indicator h="$height" w="$width" rounded-full bg-primary />
              <Tabs.Trigger value="phone" relative w-60px>
                账号
              </Tabs.Trigger>
              <Tabs.Trigger value="oauth" relative w-60px>
                OAuth
              </Tabs.Trigger>
              <Tabs.Trigger value="scan" relative w-60px>
                扫码
              </Tabs.Trigger>
            </Tabs.List>
            <div h-250px flex="~ col items-center justify-center">
              <Tabs.Content value="phone">
                TODO
              </Tabs.Content>
              <Tabs.Content value="scan">
                <MethodScan @close="open = false" />
              </Tabs.Content>
              <Tabs.Content value="oauth">
                <MethodOAuth @close="open = false" />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </DialogContent>
      </DialogPositioner>
    </Teleport>
  </DialogRoot>
</template>
