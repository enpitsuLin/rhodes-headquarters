import type { RemovableRef } from '@vueuse/core'
import { defineProxyService } from '@webext-core/proxy-service'
import type { ArknightRole, SklandAccount } from '~/composables/storages'
import { useArknightAccountsInfo, useArknightCharacters, useCurrentArknightCharacter, useSklandAccounts } from '~/composables/storages'

import * as API from '~/api'
import type { BindingInfo } from '~/types'

class BackgroundService {
  static readonly refreshInfoAlarmName = 'refresh-info'
  sklandAccounts: RemovableRef<SklandAccount[]>
  arknightCharacters: RemovableRef<ArknightRole[]>
  currentArknightCharacter: RemovableRef<string | null>
  infoMapping: RemovableRef<Record<string, BindingInfo>>
  currentArknightCharacterInfo: globalThis.ComputedRef<BindingInfo | undefined>

  constructor() {
    this.sklandAccounts = useSklandAccounts()
    this.arknightCharacters = useArknightCharacters()
    this.currentArknightCharacter = useCurrentArknightCharacter()
    this.infoMapping = useArknightAccountsInfo()
    this.currentArknightCharacterInfo = computed(() => {
      if (!this.currentArknightCharacter.value)
        return

      return this.infoMapping.value[this.currentArknightCharacter.value]
    })

    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === BackgroundService.refreshInfoAlarmName)
        this.refresh()
    })
  }

  async signIn(token: string, deviceId: string) {
    const code = await API.hypergrayph.grantAuthorizeCode(token)
    const res = await API.skland.generateCredByCode(code, deviceId)
    const binding = await API.skland.getPlayerBinding(res.cred)

    const account: SklandAccount = {
      id: res.userId,
      cred: res.cred,
    }

    return Promise.all(binding.map(async (b) => {
      const info = await API.skland.getBindingInfo(res.cred, b.uid)
      const role: ArknightRole = {
        ...b,
        accountId: res.userId,
      }
      return {
        role,
        account,
        info,
      }
    }))
  }

  /**
   * 刷新当前角色信息
   *
   * @description 设置的定时器时间刷新，以及初始化会触发一次
   */
  async refresh() {
    const currentArknightAccount = this.arknightCharacters.value.find(a => a.uid === this.currentArknightCharacter.value)
    if (!currentArknightAccount)
      return

    const currentSklandAccount = this.sklandAccounts.value.find(a => a.id === currentArknightAccount.accountId)
    if (!currentSklandAccount)
      return

    const info = await API.skland.getBindingInfo(currentSklandAccount.cred, currentArknightAccount.uid)

    this.infoMapping.value[currentArknightAccount.uid] = info
    Logger.log(`定时刷新「${currentArknightAccount.nickName}」角色信息`)
  }

  async createRefreshAlarm(periodInMinutes: number) {
    Logger.log('创建定时器')
    const alarm = await browser.alarms.get(BackgroundService.refreshInfoAlarmName)

    if (alarm) {
      Logger.log('刷新定时器设置')
      browser.alarms.clear(BackgroundService.refreshInfoAlarmName)
    }

    browser.alarms.create(BackgroundService.refreshInfoAlarmName, {
      periodInMinutes,
      when: 0,
    })
  }
}

export const [registerBackgroundService, getBackgroundService] = defineProxyService(
  'BackgroundService',
  () => new BackgroundService(),
)
