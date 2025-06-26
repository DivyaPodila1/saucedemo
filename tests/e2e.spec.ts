import { test, expect, Page } from '@playwright/test';
import { PageManager } from '../utils/PageManager';
import { TestData } from '../test-data/testData';

test.describe('End-to-End Tests', () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }: { page: Page }) => {
    pageManager = new PageManager(page);
  });

  test('complete purchase flow - standard user', async ({ page }: { page: Page }) => {
    // Login
    await pageManager.getLoginPage().goto();
    await pageManager.getLoginPage().loginWithValidCredentials(
      TestData.users.standard.username,
      TestData.users.standard.password
    );

    // Verify inventory page loaded
    await pageManager.getInventoryPage().verifyInventoryPageLoaded();

    // Add products to cart
    await pageManager.getInventoryPage().addBackpackToCart();
    await pageManager.getInventoryPage().addBikeLightToCart();
    await pageManager.getInventoryPage().verifyCartBadgeCount(2);

    // Navigate to cart
    await pageManager.getInventoryPage().clickCartIcon();
    await pageManager.getCartPage().verifyCartPageLoaded();
    await pageManager.getCartPage().verifyCartItemCount(2);

    // Verify items in cart
    await pageManager.getCartPage().verifyItemInCart(TestData.products.backpack.name);
    await pageManager.getCartPage().verifyItemInCart(TestData.products.bikeLight.name);

    // Proceed to checkout
    await pageManager.getCartPage().proceedToCheckout();

    // Fill checkout information
    await pageManager.getCheckoutStepOnePage().verifyCheckoutStepOnePageLoaded();
    await pageManager.getCheckoutStepOnePage().proceedToStepTwo(
      TestData.checkoutInfo.firstName,
      TestData.checkoutInfo.lastName,
      TestData.checkoutInfo.postalCode
    );

    // Review order
    await pageManager.getCheckoutStepTwoPage().verifyCheckoutStepTwoPageLoaded();
    await pageManager.getCheckoutStepTwoPage().verifyItemsInOverview(2);
    await pageManager.getCheckoutStepTwoPage().verifyItemInOverview(TestData.products.backpack.name);
    await pageManager.getCheckoutStepTwoPage().verifyItemInOverview(TestData.products.bikeLight.name);
    await pageManager.getCheckoutStepTwoPage().verifyPriceCalculation();

    // Complete purchase
    await pageManager.getCheckoutStepTwoPage().finishCheckout();

    // Verify successful completion
    await pageManager.getCheckoutCompletePage().verifySuccessfulCheckout();

    // Return to products
    await pageManager.getCheckoutCompletePage().goBackToProducts();
    await pageManager.getInventoryPage().verifyInventoryPageLoaded();
  });

  test('complete purchase flow using PageManager helper', async ({ page }: { page: Page }) => {
    // Login using helper method
    await pageManager.loginAsStandardUser();

    // Complete entire purchase flow using helper method
    await pageManager.completePurchaseFlow(TestData.checkoutInfo);
  });

  test('add multiple items and remove one before checkout', async ({ page }: { page: Page }) => {
    // Login
    await pageManager.loginAsStandardUser();

    // Add multiple products
    await pageManager.getInventoryPage().addBackpackToCart();
    await pageManager.getInventoryPage().addBikeLightToCart();
    await pageManager.getInventoryPage().addBoltTShirtToCart();
    await pageManager.getInventoryPage().verifyCartBadgeCount(3);

    // Go to cart
    await pageManager.getInventoryPage().clickCartIcon();
    await pageManager.getCartPage().verifyCartItemCount(3);

    // Remove one item
    await pageManager.getCartPage().removeBikeLightFromCart();
    await pageManager.getCartPage().verifyCartItemCount(2);

    // Proceed with checkout
    await pageManager.getCartPage().proceedToCheckout();
    await pageManager.getCheckoutStepOnePage().proceedToStepTwo(
      TestData.checkoutInfo.firstName,
      TestData.checkoutInfo.lastName,
      TestData.checkoutInfo.postalCode
    );

    // Verify only 2 items in checkout overview
    await pageManager.getCheckoutStepTwoPage().verifyItemsInOverview(2);
    await pageManager.getCheckoutStepTwoPage().finishCheckout();
    await pageManager.getCheckoutCompletePage().verifySuccessfulCheckout();
  });

  test('verify sorting and add highest priced item to cart', async ({ page }: { page: Page }) => {
    await pageManager.loginAsStandardUser();

    // Sort by price high to low
    await pageManager.getInventoryPage().sortProducts('hilo');
    await pageManager.getInventoryPage().verifyProductSorting('hilo');

    // Add the first item (highest priced)
    await pageManager.getInventoryPage().addBackpackToCart();
    await pageManager.getInventoryPage().verifyCartBadgeCount(1);

    // Complete purchase
    await pageManager.getInventoryPage().clickCartIcon();
    await pageManager.getCartPage().proceedToCheckout();
    await pageManager.getCheckoutStepOnePage().proceedToStepTwo(
      TestData.checkoutInfo.firstName,
      TestData.checkoutInfo.lastName,
      TestData.checkoutInfo.postalCode
    );
    await pageManager.getCheckoutStepTwoPage().finishCheckout();
    await pageManager.getCheckoutCompletePage().verifySuccessfulCheckout();
  });

  test('cancel checkout and return to shopping', async ({ page }: { page: Page }) => {
    await pageManager.loginAsStandardUser();

    // Add items to cart
    await pageManager.getInventoryPage().addBackpackToCart();
    await pageManager.getInventoryPage().clickCartIcon();
    await pageManager.getCartPage().proceedToCheckout();

    // Cancel checkout from step one
    await pageManager.getCheckoutStepOnePage().clickCancel();
    await pageManager.getCartPage().verifyCartPageLoaded();

    // Continue shopping
    await pageManager.getCartPage().continueShopping();
    await pageManager.getInventoryPage().verifyInventoryPageLoaded();
    await pageManager.getInventoryPage().verifyCartBadgeCount(1); // Item should still be in cart
  });
}); 