import { expect, Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;
  private readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('.pony_express');
  }

  async verifyCheckoutCompletePageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeText).toBeVisible();
    await expect(this.backHomeButton).toBeVisible();
  }

  async verifyOrderCompleteMessage(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toContainText('Your order has been dispatched');
  }

  async verifySuccessfulCheckout(): Promise<void> {
    await this.verifyCheckoutCompletePageLoaded();
    await this.verifyOrderCompleteMessage();
    await expect(this.ponyExpressImage).toBeVisible();
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async goBackToProducts(): Promise<void> {
    await this.clickBackHome();
    // Verify we're back on the inventory page
    await expect(this.page).toHaveURL(/.*inventory/);
  }

  async getCompleteHeaderText(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  async verifyPonyExpressImageDisplayed(): Promise<void> {
    await expect(this.ponyExpressImage).toBeVisible();
    // Verify the image is actually loaded
    const imageSrc = await this.ponyExpressImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
  }
} 