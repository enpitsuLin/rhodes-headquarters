import { expect, test } from './fixtures'

test.describe('Popup', () => {
  test(
    'Show button which open Options page when accounts was empty',
    async ({ page, popupPage, context }) => {
      await popupPage.goto()

      expect(context.pages()).toContain(popupPage.page)

      expect(page).toHaveTitle('Popup')

      const toOptionsButton = popupPage.page.getByTestId('option-button')

      expect(await toOptionsButton.textContent()).toBe('前去添加')

      const newPagePromise = context.waitForEvent('page')

      await toOptionsButton.click()

      const newPage = await newPagePromise

      expect(await newPage.title()).toBe('Options')
    },
  )
})
