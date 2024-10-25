import { defineProxyService } from '@webext-core/proxy-service'
import type { ArknightRole, SklandAccount } from '~/composables/storages'

import * as API from '~/api'

class AccountService {
  static readonly refreshInfoAlarmName = 'refresh-info'
  constructor() {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AccountService.refreshInfoAlarmName)
        this.refreshCharacterInfo()
    })
  }

  async logInOrRefreshAccount(token: string, deviceId: string) {
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

  async refreshCharacterInfo() {

  }

  async createRefreshInfoAlarm() {
    browser.alarms.create(AccountService.refreshInfoAlarmName, {
      periodInMinutes: 10,
      when: 0,
    })
  }
}

export const [registerAccountService, getAccountService] = defineProxyService(
  'AccountService',
  () => new AccountService(),
)
