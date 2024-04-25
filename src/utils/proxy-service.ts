import { defineProxyService } from '@webext-core/proxy-service'
import type { Alarms, Notifications } from 'wxt/browser'
import { format } from 'date-fns'
import { Logger } from './logger'
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
    await logInOrRefreshAccount(token)
    await this.refreshCharacterInfo()
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

class NotificationService {
  id = 0
  static recruitsAlaramNames = [
    'RECRUITS_1_ALARMS_NAME',
    'RECRUITS_2_ALARMS_NAME',
    'RECRUITS_3_ALARMS_NAME',
    'RECRUITS_4_ALARMS_NAME',
  ] as const

  static sanityAlaramName = 'SANITY_ALARM_NAME' as const
  constructor() {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (this.isPeriodNames(alarm.name)) {
        const id = ++this.id
        browser.notifications.create(
          `Notification_${id}`,
          this.getPeriodTitleAndMessage(alarm.name),
        )
      }
    })
  }

  private getPeriodTitleAndMessage(name: string): Notifications.CreateNotificationOptions {
    return {
      type: 'basic',
      title: name,
      message: name,
      iconUrl: browser.runtime.getURL('/icon-512.png'),
    }
  }

  async createAlarmNotification(
    name: typeof NotificationService.recruitsAlaramNames[number] | typeof NotificationService.sanityAlaramName,
    date: Date,
  ) {
    if (await browser.alarms.get(name))
      await browser.alarms.clear(name)

    if (+date > Date.now()) {
      Logger.log(`Created alarm notification for ${name} when`, format(date, 'MM/dd HH:mm:ss'))
      browser.alarms.create(name, {
        when: +date,
      })
    }
  }

  async clearAlarmNotification() {
    Logger.log(`Clear all alarm notification`)

    await Promise.all(
      [
        ...NotificationService.recruitsAlaramNames,
        NotificationService.sanityAlaramName,
      ].map(name => browser.alarms.clear(name)),
    )
  }

  private isPeriodNames(name: string) {
    // @ts-expect-error ignore constant equal check
    return NotificationService.recruitsAlaramNames.includes(name)
      || NotificationService.sanityAlaramName === name
  }

  create(title: string, message: string, options?: Alarms.CreateAlarmInfoType): Promise<string> | string {
    const id = ++this.id

    const showNotification = () => {
      return browser.notifications.create(
        `Notification_${id}`,
        {
          type: 'basic',
          title,
          message,
          iconUrl: browser.runtime.getURL('/icon-512.png'),
        },
      )
    }

    if (!options)
      return showNotification()

    const showNotificationListener = async () => {
      await browser.notifications.create(
        `Notification_${id}`,
        {
          type: 'basic',
          title,
          message,
          iconUrl: browser.runtime.getURL('/icon-512.png'),
        },
      )

      if (browser.alarms
        .onAlarm.hasListener(showNotificationListener)) {
        browser.alarms
          .onAlarm.removeListener(showNotificationListener)
      }
    }
    browser.alarms.onAlarm.addListener(showNotificationListener)
    browser
      .alarms
      .create(`Notification_${id}`, options)

    return `Notification_${id}`
  }
}

export const [registerNotificationService, getNotificationService] = defineProxyService(
  'NotificationService',
  () => new NotificationService(),
)
