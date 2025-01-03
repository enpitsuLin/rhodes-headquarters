import { expect, test } from './fixtures'
import binding from './mocks/binding.json' assert {type: 'json'}
import check from './mocks/check.json' assert {type: 'json'}
import generate_cred_by_code from './mocks/generate_cred_by_code.json' assert {type: 'json'}
import grant from './mocks/grant.json' assert {type: 'json'}
import info from './mocks/info.json' assert {type: 'json'}
import me from './mocks/me.json' assert {type: 'json'}

const apiResponseMap = new Map<string, any>(
  [
    ['https://as.hypergryph.com/user/oauth2/v2/grant', grant],
    ['https://zonai.skland.com/api/v1/user/auth/generate_cred_by_code', generate_cred_by_code],
    ['https://zonai.skland.com/api/v1/user/me', me],
    ['https://zonai.skland.com/api/v1/game/player/binding', binding],
    ['https://zonai.skland.com/api/v1/user/check', check],
    ['https://zonai.skland.com/api/v1/game/player/info', info],
  ],
)

test.describe('Options', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    testInfo.snapshotSuffix = ''
  })

  test(
    'Option page and login skland user',
    async ({ page, optionsPage, popupPage, context }) => {
      await optionsPage.goto()

      await context.route(
        (url) => {
          const { origin, pathname } = url
          return apiResponseMap.has(`${origin}${pathname}`)
        },
        async (route, req) => {
          const { origin, pathname } = new URL(req.url())
          const json = apiResponseMap.get(`${origin}${pathname}`)
          if (json)
            await route.fulfill({ json })
          else await route.fulfill({ json: { url: req.url() } })
        },
      )

      expect(context.pages()).toContain(optionsPage.page)

      expect(page).toHaveTitle('Options')

      const addAccountButton = optionsPage.page.getByTestId('add-account')

      expect(await addAccountButton.textContent()).toBe('新增账号')

      await addAccountButton.click()

      await optionsPage.page.getByTestId('account-add-dialog').waitFor({ state: 'visible' })

      const tokenInput = optionsPage.page.getByTestId('token-input')

      expect(tokenInput).toBeVisible()

      await tokenInput.fill('<token>')

      expect(tokenInput).toHaveValue('<token>')

      const loginButton = optionsPage.page.getByTestId('login-button')

      expect(await loginButton.textContent()).toBe('保存')

      await loginButton.click()

      expect(await loginButton.textContent()).toBe('loading...')

      await expect(loginButton).not.toBeVisible()

      await popupPage.goto()

      await popupPage.page.evaluate(() => {
        document.querySelector('canvas')?.remove()
      })

      const main = popupPage.page.locator('main.skland-container')

      await expect(main).toHaveScreenshot('options-page.png')
    },
  )
})
