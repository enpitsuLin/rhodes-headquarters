import type { Page } from '@playwright/test'

export async function openPopup(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)

  await page.waitForSelector('main.skland-container')

  // TODO
  return true
}
