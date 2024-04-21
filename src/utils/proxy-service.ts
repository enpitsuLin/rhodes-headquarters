import { defineProxyService } from '@webext-core/proxy-service'
import { accountsStorage, currentAccountStorage } from '@/store/account'

class AccountService {
  static readonly refreshInfoAlarmName = 'refresh-info'
  constructor() {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AccountService.refreshInfoAlarmName)
        this.refreshCharacterInfo()
    })
  }

  async logInOrRefreshAccount(token: string) {
    return await logInOrRefreshAccount(token)
  }

  async refreshCharacterInfo() {
    const accounts = await accountsStorage.getValue()
    const currentAccountId = await currentAccountStorage.getValue()
    const account = accounts.find(account => account.id === currentAccountId)

    if (account)
      await refreshCharacterInfo()
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
