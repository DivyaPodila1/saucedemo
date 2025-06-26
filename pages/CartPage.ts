import { expect, Page, Locator } from '@playwright/test';

export interface CartItemDetails {
  name: string;
  price: string;
  description: string;
  quantity: string;
}

export class CartPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly removeButtons: Locator;
  private readonly cartQuantity: Locator;
  private readonly cartItemName: Locator;
  private readonly cartItemPrice: Locator;
  private readonly cartItemDesc: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('[data-test*="remove"]');
    this.cartQuantity = page.locator('.cart_quantity');
    this.cartItemName = page.locator('.inventory_item_name');
    this.cartItemPrice = page.locator('.inventory_item_price');
    this.cartItemDesc = page.locator('.inventory_item_desc');
  }

  async verifyCartPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async verifyCartItemCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartItems).toHaveCount(0);
    } else {
      await expect(this.cartItems).toHaveCount(expectedCount);
    }
  }

  async verifyItemInCart(itemName: string): Promise<void> {
    await expect(this.cartItemName.filter({ hasText: itemName })).toBeVisible();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    // Convert item name to data-test attribute format
    const dataTestValue = itemName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    const removeButton = this.page.locator(`[data-test="remove-${dataTestValue}"]`);
    await removeButton.click();
  }

  async removeBackpackFromCart(): Promise<void> {
    await this.page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  }

  async removeBikeLightFromCart(): Promise<void> {
    await this.page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  }

  async removeBoltTShirtFromCart(): Promise<void> {
    await this.page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getCartItemDetails(): Promise<CartItemDetails[]> {
    const itemCount = await this.cartItems.count();
    const items: CartItemDetails[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const name = await item.locator('.inventory_item_name').textContent() || '';
      const price = await item.locator('.inventory_item_price').textContent() || '';
      const description = await item.locator('.inventory_item_desc').textContent() || '';
      const quantity = await item.locator('.cart_quantity').textContent() || '';
      
      items.push({ name, price, description, quantity });
    }
    
    return items;
  }

  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async verifyItemQuantity(itemName: string, expectedQuantity: number): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item.locator('.cart_quantity')).toHaveText(expectedQuantity.toString());
  }

  async verifyItemPrice(itemName: string, expectedPrice: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item.locator('.inventory_item_price')).toHaveText(expectedPrice);
  }
} 