import type { Account } from '@/store/account'
import { accountsStorage, currentAccountStorage, currentChararcterUidStorage } from '@/store/account'
import type { Authorize } from '@/store/authorize'
import { authorizeMappingStorage } from '@/store/authorize'
import { chararcterStorage } from '@/store/info'
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

async function checkAccount({ accountMapping, account }: { accountMapping: Record<string, Authorize>, account: Account }) {
  const credData = accountMapping[account.id]
  if (!credData)
    throw new Error(`unexpected error: ID ${account.id} has no its credData`)
  return API.skland.checkAccessToken(credData)
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
  const availableUid = accounts.map(a =>
    a.binding.map(b => b.bindingList),
  ).flat(2)[0].uid
  await Promise.all([
    accountsStorage.setValue(accounts),
    authorizeMappingStorage.setValue(accountMapping),
    currentChararcterUidStorage.setValue(availableUid),
    currentAccountStorage.setValue(accounts[0].id),
  ])
}

export async function refreshCharacterInfo() {
  const accounts = await accountsStorage.getValue()
  const uid = await currentChararcterUidStorage.getValue()
  const currentAccountId = await currentAccountStorage.getValue()
  const account = accounts.find(account => account.id === currentAccountId)
  if (!account)
    throw new Error(`Unexpected Error: account with id [${currentAccountId}] not found`)
  const accountMapping = await authorizeMappingStorage.getValue()

  const valid = await checkAccount({ accountMapping, account })
  if (!valid) {
    const authorizeCode = await API.hypergrayph.grantAuthorizeCode(account.token)
    const { userId, ...credData } = await API.skland.generateCredByCode(authorizeCode)
    accountMapping[userId] = credData
  }
  const authorizeData = accountMapping[currentAccountId]
  const info = await API.skland.getBindingInfo({ ...authorizeData, uid })
  chararcterStorage.setValue(info)
}
