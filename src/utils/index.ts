import type { Account } from '@/store/account'
import { accountsStorage } from '@/store/account'
import type { Authorize } from '@/store/authorize'
import { authorizeMappingStorage } from '@/store/authorize'
import * as API from '~/api'

async function grantAuthorizeCode({
  token,
  accounts,
  accountMapping,
}: { token: string, accounts: Account[], accountMapping: Record<string, Authorize> }) {
  const authorizeCode = await API.hypergrayph.grantAuthorizeCode(token)
  const { userId, ...credData } = await API.skland.generateCredByCode(authorizeCode)
  const { user, gameStatus } = await API.skland.getUserInfo(credData)
  const binding = await API.skland.getPlayerBinding(credData)

  accountMapping[userId] = credData

  const newAccount: Account = {
    id: userId,
    token,
    binding,
    user,
    gameStatus,
  }

  accounts.push(newAccount)
}

async function refreshAccount({ accountMapping, account, token }: { token: string, accountMapping: Record<string, Authorize>, account: Account }) {
  const credData = accountMapping[account.id]
  if (!credData)
    throw new Error(`unexpected error: ID ${account.id} has no its credData`)
  const valid = await API.skland.checkAccessToken(credData)
  if (!valid) {
    const authorizeCode = await API.hypergrayph.grantAuthorizeCode(token)
    const { userId, ...credData } = await API.skland.generateCredByCode(authorizeCode)
    accountMapping[userId] = credData
  }
  const { user, gameStatus } = await API.skland.getUserInfo(credData)
  const binding = await API.skland.getPlayerBinding(credData)
  account.gameStatus = gameStatus
  account.user = user
  account.binding = binding
}

export async function logInOrRefreshAccount(token: string) {
  const accounts = await accountsStorage.getValue()
  const accountMapping = await authorizeMappingStorage.getValue()

  const existAccount = accounts.find(account => account.token === token)
  if (!existAccount) {
    await grantAuthorizeCode({ token, accounts, accountMapping })
  }
  else {
    await refreshAccount({
      account: existAccount,
      accountMapping,
      token,
    })
  }
  await Promise.all([
    accountsStorage.setValue(accounts),
    authorizeMappingStorage.setValue(accountMapping),
  ])
}
