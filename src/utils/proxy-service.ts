import { defineProxyService } from '@webext-core/proxy-service'

class AccountService {
  static readonly refreshInfoAlarmName = 'refresh-info'
  constructor() {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AccountService.refreshInfoAlarmName)
        this.refreshCharacterInfo()
    })
  }

  async logInOrRefreshAccount(token: string) {
    await logInOrRefreshAccount(token)
    this.createRefreshInfoAlarm()
    return true
  }

  async refreshCharacterInfo() {
    await refreshCharacterInfo()
  }

  private createRefreshInfoAlarm() {
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
