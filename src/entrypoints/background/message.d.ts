/**
 * 使用 `webext-bridge` 因为会有明确的作用域
 *
 * 而 `@webext-core/messaging` 是一套代码复用在不同的作用域的，会让人很困惑
 */

import type { ProtocolWithReturn } from 'webext-bridge'
import type * as API from './api'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // 鹰角 API
    'api:hypergrayph:send-phone-code': ProtocolWithReturn<string, ReturnType<typeof API.hypergrayph.sendPhoneCode>>
    'api:hypergrayph:gen-scan-login-url': ProtocolWithReturn<void, ReturnType<typeof API.hypergrayph.genScanLoginUrl>>
    'api:hypergrayph:get-scan-status': ProtocolWithReturn<string, ReturnType<typeof API.hypergrayph.getScanStatus>>
    'api:hypergrayph:get-oauth-token-by-phone-code': ProtocolWithReturn<Parameters<typeof API.hypergrayph.getOauthTokenByPhoneCode>[0], ReturnType<typeof API.hypergrayph.getOauthTokenByPhoneCode>>
    'api:hypergrayph:get-oauth-token-by-phone-password': ProtocolWithReturn<Parameters<typeof API.hypergrayph.getOAuthTokenByPhonePassword>[0], ReturnType<typeof API.hypergrayph.getOAuthTokenByPhonePassword>>
    'api:hypergrayph:get-oauth-token-by-scan-code': ProtocolWithReturn<Parameters<typeof API.hypergrayph.getOAuthTokenByScanCode>[0], ReturnType<typeof API.hypergrayph.getOAuthTokenByScanCode>>

    // 森空岛 API
    'api:skland:grant-authorize-code': ProtocolWithReturn<string, ReturnType<typeof API.hypergrayph.grantAuthorizeCode>>
    'api:skland:generate-cred-by-code': ProtocolWithReturn<string, ReturnType<typeof API.skland.generateCredByCode>>
    'api:skland:get-player-binding': ProtocolWithReturn<string, ReturnType<typeof API.skland.getPlayerBinding>>
    'api:skland:get-binding-info': ProtocolWithReturn<{ cred: string, uid: string }, ReturnType<typeof API.skland.getBindingInfo>>
    'api:skland:refresh-token': ProtocolWithReturn<void, ReturnType<typeof API.skland.refresh>>
  }
}
