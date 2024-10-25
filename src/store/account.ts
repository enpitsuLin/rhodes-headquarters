import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BindingInfo } from '~/types'
import type { ArknightRole, SklandAccount } from '~/composables/storages'
import {
  useArknightAccounts,
  useArknightAccountsInfo,
  useCurrentArknightAccount,
  useSklandAccounts,
} from '~/composables/storages'

export const useArknightRole = defineStore('PRRH:arknight-role', {
  state() {
    const accounts = useSklandAccounts()
    const roles = useArknightAccounts()
    const currentUid = useCurrentArknightAccount()
    const infoMapping = useArknightAccountsInfo()

    return {
      accounts,
      roles,
      currentUid,
      infoMapping,
    }
  },
  getters: {
    currentRole: state => state.roles.find(role => role.uid === state.currentUid),
    info: state => state.currentUid ? state.infoMapping[state.currentUid] : null,
  },
  actions: {
    addAccount(account: SklandAccount) {
      this.accounts.push(account)
    },
    addRole(role: ArknightRole) {
      this.roles.push(role)
    },
    removeRole(uid: ArknightRole['uid']) {
      if (this.currentUid === uid)
        this.currentUid = null

      this.roles = this.roles.filter(role => role.uid !== uid)
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
  import.meta.hot.accept(acceptHMRUpdate(useArknightRole, import.meta.hot))
}
