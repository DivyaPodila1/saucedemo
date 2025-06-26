import { expect, Page, Locator } from '@playwright/test';

export class CheckoutStepOnePage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('.error-button');
  }

  async verifyCheckoutStepOnePageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
  }

  async fillUserInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async proceedToStepTwo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillUserInformation(firstName, lastName, postalCode);
    await this.clickContinue();
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async verifyFirstNameRequired(): Promise<void> {
    await this.lastNameInput.fill('Doe');
    await this.postalCodeInput.fill('12345');
    await this.clickContinue();
    await this.verifyErrorMessage('Error: First Name is required');
  }

  async verifyLastNameRequired(): Promise<void> {
    await this.firstNameInput.fill('John');
    await this.postalCodeInput.fill('12345');
    await this.clickContinue();
    await this.verifyErrorMessage('Error: Last Name is required');
  }

  async verifyPostalCodeRequired(): Promise<void> {
    await this.firstNameInput.fill('John');
    await this.lastNameInput.fill('Doe');
    await this.clickContinue();
    await this.verifyErrorMessage('Error: Postal Code is required');
  }

  async clearForm(): Promise<void> {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.postalCodeInput.clear();
  }

  async closeErrorMessage(): Promise<void> {
    if (await this.errorButton.isVisible()) {
      await this.errorButton.click();
    }
  }
} 