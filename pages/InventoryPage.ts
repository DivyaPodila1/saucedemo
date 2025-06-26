import { expect, Page, Locator } from '@playwright/test';

export interface ProductDetails {
  name: string;
  price: string;
  description: string;
}

export class InventoryPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  
  // Product-specific locators
  private readonly backpackAddButton: Locator;
  private readonly bikeLightAddButton: Locator;
  private readonly boltTShirtAddButton: Locator;
  private readonly fleeceJacketAddButton: Locator;
  private readonly onesieAddButton: Locator;
  private readonly redTShirtAddButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('.product_sort_container');
    
    // Product-specific locators
    this.backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.bikeLightAddButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.boltTShirtAddButton = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    this.fleeceJacketAddButton = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
    this.onesieAddButton = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
    this.redTShirtAddButton = page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  }

  async verifyInventoryPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems).toHaveCount(6);
  }

  async addProductToCart(productName: string): Promise<void> {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}"]`);
    await addButton.click();
  }

  async addBackpackToCart(): Promise<void> {
    await this.backpackAddButton.click();
  }

  async addBikeLightToCart(): Promise<void> {
    await this.bikeLightAddButton.click();
  }

  async addBoltTShirtToCart(): Promise<void> {
    await this.boltTShirtAddButton.click();
  }

  async verifyCartBadgeCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }

  async clickCartIcon(): Promise<void> {
    await this.cartIcon.click();
  }

  async sortProducts(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }

  async verifyProductSorting(sortOption: string): Promise<void> {
    const productNames = await this.page.locator('.inventory_item_name').allTextContents();
    
    switch (sortOption) {
      case 'az':
        const sortedAZ = [...productNames].sort();
        expect(productNames).toEqual(sortedAZ);
        break;
      case 'za':
        const sortedZA = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedZA);
        break;
      case 'lohi':
        const prices = await this.page.locator('.inventory_item_price').allTextContents();
        const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...numericPrices].sort((a, b) => a - b);
        expect(numericPrices).toEqual(sortedPrices);
        break;
      case 'hilo':
        const pricesHiLo = await this.page.locator('.inventory_item_price').allTextContents();
        const numericPricesHiLo = pricesHiLo.map(price => parseFloat(price.replace('$', '')));
        const sortedPricesDesc = [...numericPricesHiLo].sort((a, b) => b - a);
        expect(numericPricesHiLo).toEqual(sortedPricesDesc);
        break;
    }
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async getProductDetails(productName: string): Promise<ProductDetails> {
    const productItem = this.page.locator('.inventory_item').filter({ hasText: productName });
    const name = await productItem.locator('.inventory_item_name').textContent() || '';
    const price = await productItem.locator('.inventory_item_price').textContent() || '';
    const description = await productItem.locator('.inventory_item_desc').textContent() || '';
    
    return { name, price, description };
  }
} 