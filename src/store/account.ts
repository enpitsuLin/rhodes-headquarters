import type { ArknightRole, SklandAccount } from '~/composables/storages'
import type { BindingInfo } from '~/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import {
  useArknightAccountsInfo,
  useArknightCharacters,
  useCurrentArknightCharacter,
  useSklandAccounts,
} from '~/composables/storages'

export const useAccountsStore = defineStore('PRRH:arknight-role', {
  state() {
    const accounts = useSklandAccounts()
    const characters = useArknightCharacters()
    const currentUid = useCurrentArknightCharacter()
    const infoMapping = useArknightAccountsInfo()

    return {
      accounts,
      characters,
      currentUid,
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
