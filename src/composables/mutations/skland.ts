import type { UseMutationReturn } from '@pinia/colada'
import type { ArknightRole, SklandAccount } from '../storages'
import type { BindingInfo } from '~/types'
import { defineMutation, useMutation } from '@pinia/colada'
import { generateCredByCode, getBindingInfo, getPlayerBinding, grantAuthorizeCode } from '~/api'
import { useAccountsStore } from '~/store/account'

export interface UseSkalandSignInOptions {
  onSuccess: () => void
}

export type UseSkalandSignIn = UseMutationReturn<{
  account: SklandAccount
  bindings: {
    role: ArknightRole
    info: BindingInfo
  }[]
}, string, Error>

export function useSkalandSignIn(options: UseSkalandSignInOptions): UseSkalandSignIn {
  const mutation = defineMutation(() => {
    const accountsStore = useAccountsStore()

    return useMutation({
      async mutation(token: string) {
        if (!token)
          throw new Error('凭证为空')

        const code = await grantAuthorizeCode(token)
        const res = await generateCredByCode(code)
        const binding = await getPlayerBinding(res.cred)

        const account: SklandAccount = {
          id: res.userId,
          cred: res.cred,
        }
        return {
          account,
          bindings: await Promise.all(binding.map(async (b) => {
            const info = await getBindingInfo(res.cred, b.uid)
            const role: ArknightRole = {
              ...b,
              accountId: res.userId,
            }
            return {
              role,
              info,
            }
          })),
        }
      },
      async onSuccess(data) {
        accountsStore.addAccount(data.account)
        data.bindings.forEach(({ info, role }) => {
          accountsStore.addRole(role)
          accountsStore.setInfoMapping(role.uid, info)
        })

        if (accountsStore.characters.length === 1)
          accountsStore.setCurrentUid(accountsStore.characters[0].uid)

        // TODO 添加刷新角色信息任务

        options.onSuccess()
      },
    })
  })

  return mutation()
}
