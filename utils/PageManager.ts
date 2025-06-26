import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInfo } from '../test-data/testData';

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly inventoryPage: InventoryPage;
  private readonly cartPage: CartPage;
  private readonly checkoutStepOnePage: CheckoutStepOnePage;
  private readonly checkoutStepTwoPage: CheckoutStepTwoPage;
  private readonly checkoutCompletePage: CheckoutCompletePage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutStepOnePage = new CheckoutStepOnePage(page);
    this.checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getInventoryPage(): InventoryPage {
    return this.inventoryPage;
  }

  getCartPage(): CartPage {
    return this.cartPage;
  }

  getCheckoutStepOnePage(): CheckoutStepOnePage {
    return this.checkoutStepOnePage;
  }

  getCheckoutStepTwoPage(): CheckoutStepTwoPage {
    return this.checkoutStepTwoPage;
  }

  getCheckoutCompletePage(): CheckoutCompletePage {
    return this.checkoutCompletePage;
  }

  // Helper method for complete login flow
  async loginAsStandardUser(): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.loginWithValidCredentials('standard_user', 'secret_sauce');
  }

  // Helper method for complete e2e purchase flow
  async completePurchaseFlow(userInfo: CheckoutInfo): Promise<void> {
    // Add items to cart
    await this.inventoryPage.addBackpackToCart();
    await this.inventoryPage.addBikeLightToCart();
    
    // Go to cart
    await this.inventoryPage.clickCartIcon();
    await this.cartPage.verifyCartPageLoaded();
    
    // Proceed to checkout
    await this.cartPage.proceedToCheckout();
    
    // Fill user information
    await this.checkoutStepOnePage.verifyCheckoutStepOnePageLoaded();
    await this.checkoutStepOnePage.proceedToStepTwo(
      userInfo.firstName, 
      userInfo.lastName, 
      userInfo.postalCode
    );
    
    // Review and finish order
    await this.checkoutStepTwoPage.verifyCheckoutStepTwoPageLoaded();
    await this.checkoutStepTwoPage.finishCheckout();
    
    // Verify completion
    await this.checkoutCompletePage.verifySuccessfulCheckout();
  }
} 