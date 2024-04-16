import { expect, test } from './fixtures'
import { openPopup } from './pages/popup'

test('Popup content', async ({ page, extensionId }) => {
  const popup = await openPopup(page, extensionId)

  expect(popup)
  // TODO
})
