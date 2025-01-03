import type { Alarms, Notifications } from 'wxt/browser'
import { defineProxyService } from '@webext-core/proxy-service'
import { format } from 'date-fns'
import { Logger } from '~/utils/logger'

class NotificationService {
  id = 0
  static recruitsAlaramNames = [
    'RECRUITS_1_ALARMS_NAME',
    'RECRUITS_2_ALARMS_NAME',
    'RECRUITS_3_ALARMS_NAME',
    'RECRUITS_4_ALARMS_NAME',
  ] as const

  static sanityAlaramName = 'SANITY_ALARM_NAME' as const

  alarmsNotification = new Map<string, { title: string, message: string }>([
    ['RECRUITS_1_ALARMS_NAME', { title: '公招结束', message: '公招栏位1已成功招募到候选人' }],
    ['RECRUITS_2_ALARMS_NAME', { title: '公招结束', message: '公招栏位2已成功招募到候选人' }],
    ['RECRUITS_3_ALARMS_NAME', { title: '公招结束', message: '公招栏位3已成功招募到候选人' }],
    ['RECRUITS_4_ALARMS_NAME', { title: '公招结束', message: '公招栏位4已成功招募到候选人' }],
    ['SANITY_ALARM_NAME', { title: '理智恢复', message: '理智已完全恢复' }],
  ])

  constructor() {
    browser.alarms.onAlarm.addListener((alarm) => {
      if (this.isNotificationAlarmName(alarm.name)) {
        const id = ++this.id
        browser.notifications.create(
          `Notification_${id}`,
          this.getPeriodTitleAndMessage(alarm.name),
        )
      }
    })
  }

  private getPeriodTitleAndMessage(name: string): Notifications.CreateNotificationOptions {
    const params = this.alarmsNotification.get(name)
    if (!params)
      throw new Error('通知参数不存在')
    return {
      ...params,
      type: 'basic',
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
      Logger.log(`为「${this.alarmsNotification.get(name)?.title}」创建定时器, 通知时间: ${format(date, 'MM/dd HH:mm:ss')}`)
      browser.alarms.create(name, {
        when: +date,
      })
    }
  }

  async clearAlarmNotification() {
    Logger.log(`清除所有通知定时器`)

    await Promise.all(
      [
        ...NotificationService.recruitsAlaramNames,
        NotificationService.sanityAlaramName,
      ].map(name => browser.alarms.clear(name)),
    )
  }

  private isNotificationAlarmName(name: string) {
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
        .onAlarm
        .hasListener(showNotificationListener)) {
        browser.alarms
          .onAlarm
          .removeListener(showNotificationListener)
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
