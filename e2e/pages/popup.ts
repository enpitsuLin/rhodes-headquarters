import type { Page } from '@playwright/test'

export class PopupPage {
  constructor(
    public readonly page: Page,
    public readonly extendsionId: string,
  ) {

  }

  async goto() {
    await this.page.goto(this.url)
  }

  get url() {
    return `chrome-extension://${this.extendsionId}/popup.html`
  }
}
