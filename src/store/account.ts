import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ArknightRole } from './schema'
import { arknightRolesStorage, currentUidStorage, infoStorage } from './schema'
import type { BindingInfo } from '@/types'

export const useArknightRole = defineStore('arknight-role', {
  state() {
    const roles = useWxtStorage(arknightRolesStorage)
    const currentUid = useWxtStorage(currentUidStorage)
    const infoMapping = useWxtStorage(infoStorage)

    return {
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
    addRole(role: ArknightRole) {
      this.roles.push(role)
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
