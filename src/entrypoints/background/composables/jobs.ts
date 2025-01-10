import type { JobScheduler } from 'background/utils/job'
import type { MergedRecruit } from 'background/utils/recruit'
import type { ArknightRole, SklandAccount } from '~/store/account'
import type { BindingInfo, Preference } from '~/types'
import { debouncedWatch } from '@vueuse/core'
import * as API from 'background/api'
import { mergeRecruits } from 'background/utils/recruit'
import { fromUnixTime } from 'date-fns'

const REFRESH_INFO_JOB_ID = 'PRRH:JOB:REFRESH_INFO'
const SANITY_RESTORE_JOB_ID = 'PRRH:JOB:SANITY_RESTORE'
const RECRUIT_DONE_JOB_ID = 'PRRH:JOB:RECRUIT_DONE'

export function useBackgroundJobs(jobScheduler: MaybeRefOrGetter<JobScheduler>) {
  const preference = useWxtStorageAsync<Preference>(
    'PRRH:PREFERENCE',
    {
      periodInMinutes: 10,
      charactersAlarmsEnable: false,
    },
  )

  const accounts = useWxtStorageAsync<SklandAccount[]>('PRRH:SKLAND_ACCOUNTS', [])
  const characters = useWxtStorageAsync<ArknightRole[]>('PRRH:ARKNIGHT_CHARACTERS', [])
  const currentUid = useWxtStorageAsync<string | null>('PRRH:ARKNIGHT_CHARACTER_CURRENT', '')
  const infoMapping = useWxtStorageAsync<Record<string, BindingInfo>>('PRRH:ARKNIGHT_ACCOUNTS_INFO', {})

  const currentAccount = computed(() => {
    if (!currentUid.value)
      return null

    return infoMapping.value[currentUid.value]
  })

  function addRefreshInfoJob() {
    toValue(jobScheduler).scheduleJob({
      id: REFRESH_INFO_JOB_ID,
      type: 'interval',
      duration: preference.value.periodInMinutes * 60e3,
      immediate: true,
      execute: refreshInfo,
    })
  }

  function addSanityRestoreJob(info: BindingInfo) {
    const completeRecoveryTime = info.status.ap.completeRecoveryTime
    if (!completeRecoveryTime)
      return

    toValue(jobScheduler).scheduleJob({
      id: SANITY_RESTORE_JOB_ID,
      type: 'once',
      date: fromUnixTime(completeRecoveryTime),
      execute: () => {
        Logger.log('理智完全恢复')
      },
    })
  }

  function addRecruitDoneJob(recruit: MergedRecruit) {
    toValue(jobScheduler).scheduleJob({
      id: `${RECRUIT_DONE_JOB_ID}-${recruit.startTs}`,
      type: 'once',
      date: recruit.date,
      context: recruit,
      execute: (ctx) => {
        Logger.log('公招结束', ctx.title)
        browser.notifications.create({
          type: 'basic',
          title: '公招结束',
          message: `${ctx.title}已成功招募到候选人`,
          iconUrl: browser.runtime.getURL('/icon-512.png'),
        })
      },
    })
  }

  async function refreshCharacterInfo(character: ArknightRole) {
    const account = accounts.value.find(account => account.id === character.accountId)
    if (!account)
      return

    const data = await API.skland.getBindingInfo({
      uid: character.uid,
      cred: account.cred,
    })
    infoMapping.value[character.uid] = data
  }

  async function refreshInfo() {
    if (preference.value.charactersAlarmsEnable) {
      await Promise.all(
        characters.value.map(async (character) => {
          await refreshCharacterInfo(character)
        }),
      )
    }
    else {
      const currentCharacter = characters.value.find(role => role.uid === currentUid.value)
      if (!currentCharacter)
        return

      await refreshCharacterInfo(currentCharacter)
    }
  }

  watch(
    preference,
    (newValue, oldValue) => {
      if (newValue.periodInMinutes !== oldValue?.periodInMinutes) {
        addRefreshInfoJob()
      }
    },
    { deep: true, immediate: true },
  )

  debouncedWatch(
    currentAccount,
    (account) => {
      if (!account)
        return

      const completeRecoveryTime = account.status.ap.completeRecoveryTime
      if (!completeRecoveryTime)
        return

      addSanityRestoreJob(account)

      const recruits = mergeRecruits(account.recruit)
      recruits.forEach(addRecruitDoneJob)
    },
    { debounce: 500, maxWait: 1000 },
  )

  return {
    runAllJobs() {
      addRefreshInfoJob()
      if (currentAccount.value) {
        addSanityRestoreJob(currentAccount.value)
        const recruits = mergeRecruits(currentAccount.value.recruit)
        recruits.forEach(addRecruitDoneJob)
      }
    },
  }
}
