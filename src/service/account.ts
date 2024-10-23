import { defineProxyService } from '@webext-core/proxy-service'
import * as API from '~/api'

class AccountService {
  static readonly refreshInfoAlarmName = 'refresh-info'
  constructor() {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AccountService.refreshInfoAlarmName)
        this.refreshCharacterInfo()
    })
  }

  async logInOrRefreshAccount(token: string) {
    const code = await API.hypergrayph.grantAuthorizeCode(token)
    const res = await API.skland.generateCredByCode(code)
    const binding = await API.skland.getPlayerBinding(res.cred)

    return Promise.all(binding.map(async (b) => {
      const info = await API.skland.getBindingInfo(res.cred, b.uid)

      return {
        ...b,
        info,
        accountId: res.userId,
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
