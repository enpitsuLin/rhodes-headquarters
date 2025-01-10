/**
 * 使用 `webext-bridge` 因为会有明确的作用域
 *
 * 而 `@webext-core/messaging` 是一套代码复用在不同的作用域的，会让人很困惑
 */

import type { ProtocolWithReturn } from 'webext-bridge'
import type * as API from './api'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    'api:hypergrayph:gen-scan-login-url': ProtocolWithReturn<void, ReturnType<typeof API.hypergrayph.genScanLoginUrl>>
    'api:hypergrayph:get-scan-status': ProtocolWithReturn<string, ReturnType<typeof API.hypergrayph.getScanStatus>>
    'api:hypergrayph:get-oauth-token-by-scan-code': ProtocolWithReturn<string, ReturnType<typeof API.hypergrayph.getOAuthTokenByScanCode>>

    'api:skland:grant-authorize-code': ProtocolWithReturn<string, ReturnType<typeof API.hypergrayph.grantAuthorizeCode>>
    'api:skland:generate-cred-by-code': ProtocolWithReturn<string, ReturnType<typeof API.skland.generateCredByCode>>
    'api:skland:get-player-binding': ProtocolWithReturn<string, ReturnType<typeof API.skland.getPlayerBinding>>
    'api:skland:get-binding-info': ProtocolWithReturn<{ cred: string, uid: string }, ReturnType<typeof API.skland.getBindingInfo>>
    'api:skland:refresh-token': ProtocolWithReturn<void, ReturnType<typeof API.skland.refresh>>
  }
}
