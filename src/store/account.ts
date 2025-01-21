import type { BindingInfo, BindingRole } from '~/types'
import { acceptHMRUpdate, defineStore } from 'pinia'

export interface SklandAccount {
  id: string
  /** 森空岛账号用户登录凭证 */
  cred: string
}

/**
 * 森空岛绑定的明日方舟游戏角色
 */
export interface ArknightRole extends BindingRole {
  accountId: SklandAccount['id']
}

export const useAccountsStore = defineStore('PRRH:arknight-role', {
  state() {
    const accounts = useWxtStorageAsync<SklandAccount[]>('PRRH:SKLAND_ACCOUNTS', [])
    const characters = useWxtStorageAsync<ArknightRole[]>('PRRH:ARKNIGHT_CHARACTERS', [])
    const currentUid = useWxtStorageAsync<string | null>('PRRH:ARKNIGHT_CHARACTER_CURRENT', '')
    const infoMapping = useWxtStorageAsync<Record<string, BindingInfo>>('PRRH:ARKNIGHT_ACCOUNTS_INFO', {})

    const currentCharacter = computed(() => {
      if (!currentUid.value)
        return null

      return characters.value.find(i => i.uid === currentUid.value)
    })
    const currentAccount = computed(() => {
      if (!currentUid.value)
        return null

      return accounts.value.find(i => i.id === currentCharacter.value?.accountId)
    })

    return {
      accounts,
      characters,
      currentUid,
      currentCharacter,
      currentAccount,
      infoMapping,
    }
  },
  getters: {
    currentRole: state => state.characters.find(role => role.uid === state.currentUid),
    info: state => state.currentUid ? state.infoMapping[state.currentUid] : null,
  },
  actions: {
    addAccount(account: SklandAccount) {
      this.accounts.push(account)
    },
    addRole(role: ArknightRole) {
      this.characters.push(role)
    },
    removeRole(uid: ArknightRole['uid']) {
      if (this.currentUid === uid)
        this.currentUid = null

      this.characters = this.characters.filter(role => role.uid !== uid)

      const accountCharacter = this.characters.map(i => i.accountId)
      this.accounts = this.accounts.filter(i => accountCharacter.includes(i.id))

      delete this.infoMapping[uid]
    },
    setInfoMapping(uid: ArknightRole['uid'], info: BindingInfo) {
      this.infoMapping[uid] = info
    },
    setCurrentUid(uid: ArknightRole['uid']) {
      this.currentUid = uid
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountsStore, import.meta.hot))
}
