import type { Alarms } from 'wxt/browser'
import { browser } from 'wxt/browser'
import { Logger } from '~/utils'

/**
 * 一个按设定间隔执行的任务，从首次调度时开始计时。
 */
export interface IntervalJob<Context = unknown> {
  id: string
  type: 'interval'
  /**
   * 间隔时间（毫秒）。由于 alarms API 的限制，必须大于1分钟。
   */
  duration: number
  /**
   * 首次调度时是否立即执行任务。如果为 `false`，将在 `duration` 后首次执行。
   * 更新现有任务时此选项无效。
   *
   * @default false
   */
  immediate?: boolean
  context?: Context
  execute: (context: Context) => Promise<any> | any
}

/**
 * 在特定日期/时间执行一次的任务。
 */
export interface OnceJob<Context = unknown> {
  id: string
  type: 'once'
  /**
   * 执行任务的日期。
   */
  date: Date | string | number
  context?: Context
  execute: (context: Context) => Promise<any> | any
}

export type Job<Context = unknown> = IntervalJob<Context> | OnceJob<Context>

export interface JobScheduler {
  /**
   * 调度一个任务。如果具有相同 `id` 的任务已被调度，且任务内容不同，将更新该任务。
   */
  scheduleJob: <Context = unknown>(job: Job<Context>) => Promise<void>
  /**
   * 通过 ID 取消调度任务。
   */
  removeJob: (jobId: string) => Promise<void>

  /**
   * 监听任务成功完成事件。
   */
  on: ((event: 'success', callback: (job: Job, result: any) => void) => RemoveListenerFn) & ((event: 'error', callback: (job: Job, error: unknown) => void) => RemoveListenerFn)

  getJobs: () => Job<unknown>[]
}

/**
 * 调用此函数以移除已添加的监听器。
 */
type RemoveListenerFn = () => void

/**
 * > 需要 `alarms` 权限。
 *
 * 创建一个基于 [alarms API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms)
 * 的 `JobScheduler`。
 *
 * @param options
 * @returns 可用于调度和管理任务的 `JobScheduler`
 */
export function defineJobScheduler(): JobScheduler {
  if (browser.alarms == null) {
    throw new Error('alarms permission is required')
  }

  const successListeners: Array<(job: Job<any>, result: any) => void> = []
  function triggerSuccessListeners<Context>(job: Job<Context>, result: any) {
    successListeners.forEach(l => l(job, result))
  }

  const errorListeners: Array<(job: Job<any>, error: unknown) => void> = []
  function triggerErrorListeners<Context>(job: Job<Context>, error: unknown) {
    errorListeners.forEach(l => l(job, error))
  }

  /**
   * 存储用于 `onAlarm` 的任务回调
   */
  const jobs = new Map<Job['id'], Job<unknown>>()

  async function executeJob<Context>(job: Job<Context>) {
    Logger.log(`执行任务:`, job)

    const startTime = performance.now()
    let status = 'success'
    try {
      const result = await job.execute(job.context ?? ({} as Context))

      triggerSuccessListeners(job, result)
    }
    catch (err) {
      status = 'failure'
      triggerErrorListeners(job, err)
    }

    const endTime = performance.now()
    const durationInMs = endTime - startTime
    Logger.log(
      `执行任务消耗 ${readableDuration({ seconds: durationInMs / 1000 })}`,
      {
        startTime: startTime + performance.timeOrigin,
        endTime: endTime + performance.timeOrigin,
        durationInMs,
        status,
        job,
      },
    )
  }

  function jobToAlarm<Context>(job: Job<Context>): Alarms.Alarm | null {
    let scheduledTime: number
    let periodInMinutes: number | undefined
    switch (job.type) {
      case 'once':
        scheduledTime = new Date(job.date).getTime()
        if (scheduledTime < Date.now())
          return null
        break
      case 'interval':
        scheduledTime = Date.now()
        if (!job.immediate)
          scheduledTime += job.duration
        periodInMinutes = job.duration / 60e3
        break
    }
    return {
      name: job.id,
      scheduledTime,
      periodInMinutes,
    }
  }

  async function scheduleJob<Context = unknown>(job: Job<Context>) {
    Logger.debug('新增任务日程:', job)

    // If there's not a future alarm, don't schedule a job.
    const alarm = jobToAlarm(job)
    if (alarm === null) {
      jobs.delete(job.id)
      return
    }

    // Create the job if it's different
    jobs.set(job.id, job as Job<unknown>)
    const existing = await browser.alarms.get(job.id)
    switch (job.type) {
      case 'once':
        if (alarm.scheduledTime !== existing?.scheduledTime) {
          browser.alarms.create(alarm.name, { when: alarm.scheduledTime })
        }
        break
      case 'interval':
        if (!existing || alarm.periodInMinutes !== existing.periodInMinutes) {
          browser.alarms.create(alarm.name, {
            delayInMinutes: job.immediate ? 0 : alarm.periodInMinutes,
            periodInMinutes: alarm.periodInMinutes,
          })
        }
        break
    }
  }

  // Listen for alarms and execute jobs
  browser.alarms.onAlarm.addListener(async (alarm) => {
    const job = jobs.get(alarm.name)
    if (job)
      await executeJob(job)
  })

  return {
    scheduleJob,

    async removeJob(jobId) {
      jobs.delete(jobId)
      await browser.alarms.clear(jobId)
    },

    on(event, callback) {
      const listeners = event === 'success' ? successListeners : errorListeners
      listeners.push(callback)
      return () => {
        const i = listeners.indexOf(callback)
        listeners.splice(i, 1)
      }
    },

    getJobs() {
      return Array.from(jobs.values())
    },
  }
}
