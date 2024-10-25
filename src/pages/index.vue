<script setup lang="ts">
import { useRouter } from 'vue-router/auto'
import { useMagicKeys, useStyleTag } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import LayoutDefault from '~/components/layouts/default.vue'
import SectionSanity from '~/components/home/SectionSanity.vue'
import SectionRecruit from '~/components/home/SectionRecruit.vue'
import SectionMission from '~/components/home/SectionMission.vue'
import SectionTip from '~/components/home/SectionTip.vue'
import SectionCharacter from '~/components/home/SectionCharacter.vue'
import Loading from '~/components/Loading.vue'
import { useArknightRole } from '~/store/account'

const router = useRouter()

const { load, unload } = useStyleTag(`html,body{height:unset}#app {height:250px !important}`, { immediate: false })

const { meta, control } = useMagicKeys()

const { roles, info } = storeToRefs(useArknightRole())

watch(roles, ({ length }) => {
  if (length === 0)
    load()

  else
    unload()
}, { immediate: true })

function onOptionClick() {
  // TODO 确定一下 PC 上 control 键，可以判断环境再判断键位
  if (meta.value || control.value) {
    browser.tabs.create({
      url: browser.runtime.getURL('/options.html?to=preferences'),
    })
  }
  else { router.push('/options') }
}
</script>

<template>
  <LayoutDefault>
    <template v-if="roles.length === 0">
      <div py-4>
        <h2 text-xl>
          暂无账号
        </h2>
        <span>No Account</span>
      </div>
      <p text-sm>
        你需要点击下面的<code mx-1 rounded bg-secondary-background px-2>+</code>去设置页添加你的森空岛账户来获取你的明日方舟角色信息
      </p>

      <div bg="black/50" absolute bottom-0 left-0 right-0 h-60px flex="~ justify-center">
        <Loading as="button" type="button" @click="onOptionClick">
          <svg
            size-20px c-primary width="32" height="32" viewBox="0 0 32 32" fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 14H4V18H14V28H18V18H28V14H18V4H14V14Z" fill="currentColor" />
          </svg>
        </Loading>
      </div>
    </template>
    <template v-else-if="info">
      <SectionCharacter :status="info.status" />
      <SectionSanity :status="info.status" />
      <SectionRecruit :recruits="info.recruit" :hire="info.building.hire" />
      <SectionMission :info="info" />
      <SectionTip />
    </template>
  </LayoutDefault>
</template>
