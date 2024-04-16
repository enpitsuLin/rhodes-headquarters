import { expect, test } from './fixtures'
import { openPopup } from './pages/popup'

test('Popup counter increments when clicked', async ({ page, extensionId }) => {
  const popup = await openPopup(page, extensionId)

  expect(popup)
  // TODO
})
