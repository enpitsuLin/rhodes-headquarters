import path from 'node:path'
import type { BrowserContext } from '@playwright/test'
import { test as base, chromium } from '@playwright/test'
import { OptionsPage } from './pages/options'
import { PopupPage } from './pages/popup'

const pathToExtension = path.resolve('.output/chrome-mv3')

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
  popupPage: PopupPage
  optionsPage: OptionsPage
}>({

  // eslint-disable-next-line no-empty-pattern
  context: async ({ }, use) => {
    const context = await chromium.launchPersistentContext('', {
      // eslint-disable-next-line node/prefer-global/process
      headless: !!process.env.CI,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    })
    await use(context)
    await context.close()
  },
  optionsPage: async ({ page, extensionId }, use) => {
    const optionsPage = new OptionsPage(
      page,
      extensionId,
    )
    await use(optionsPage)
  },
  popupPage: async ({ page, extensionId }, use) => {
    const popupPage = new PopupPage(
      page,
      extensionId,
    )
    await use(popupPage)
  },
  extensionId: async ({ context }, use) => {
    let background: { url: () => string }
    if (pathToExtension.endsWith('-mv3')) {
      [background] = context.serviceWorkers()
      if (!background)
        background = await context.waitForEvent('serviceworker')
    }
    else {
      [background] = context.backgroundPages()
      if (!background)
        background = await context.waitForEvent('backgroundpage')
    }

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  },
})
export const expect = test.expect
