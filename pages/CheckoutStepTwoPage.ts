import { expect, Page, Locator } from '@playwright/test';

export interface OrderSummary {
  items: Array<{
    name: string;
    price: string;
    quantity: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentInfo: string;
  shippingInfo: string;
}

export class CheckoutStepTwoPage {
  private readonly page: Page;
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly paymentInformation: Locator;
  private readonly shippingInformation: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly cartQuantity: Locator;
  private readonly itemName: Locator;
  private readonly itemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.paymentInformation = page.locator('[data-test="payment-info-value"]');
    this.shippingInformation = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.cartQuantity = page.locator('.cart_quantity');
    this.itemName = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');
  }

  async verifyCheckoutStepTwoPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.paymentInformation).toBeVisible();
    await expect(this.shippingInformation).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async verifyItemsInOverview(expectedItemCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedItemCount);
  }

  async verifyItemInOverview(itemName: string): Promise<void> {
    await expect(this.itemName.filter({ hasText: itemName })).toBeVisible();
  }

  async verifyPaymentInformation(expectedPayment: string): Promise<void> {
    await expect(this.paymentInformation).toHaveText(expectedPayment);
  }

  async verifyShippingInformation(expectedShipping: string): Promise<void> {
    await expect(this.shippingInformation).toHaveText(expectedShipping);
  }

  async getSubtotal(): Promise<number> {
    const subtotalText = await this.subtotalLabel.textContent() || '';
    return parseFloat(subtotalText.replace('Item total: $', ''));
  }

  async getTax(): Promise<number> {
    const taxText = await this.taxLabel.textContent() || '';
    return parseFloat(taxText.replace('Tax: $', ''));
  }

  async getTotal(): Promise<number> {
    const totalText = await this.totalLabel.textContent() || '';
    return parseFloat(totalText.replace('Total: $', ''));
  }

  async verifyPriceCalculation(): Promise<void> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    
    // Verify that total = subtotal + tax (with small tolerance for floating point)
    const expectedTotal = subtotal + tax;
    expect(Math.abs(total - expectedTotal)).toBeLessThan(0.01);
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async getOrderSummary(): Promise<OrderSummary> {
    const items: Array<{ name: string; price: string; quantity: string }> = [];
    const itemCount = await this.cartItems.count();
    
    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const name = await item.locator('.inventory_item_name').textContent() || '';
      const price = await item.locator('.inventory_item_price').textContent() || '';
      const quantity = await item.locator('.cart_quantity').textContent() || '';
      
      items.push({ name, price, quantity });
    }
    
    return {
      items,
      subtotal: await this.getSubtotal(),
      tax: await this.getTax(),
      total: await this.getTotal(),
      paymentInfo: await this.paymentInformation.textContent() || '',
      shippingInfo: await this.shippingInformation.textContent() || ''
    };
  }

  async verifySubtotalAmount(expectedAmount: number): Promise<void> {
    const actualSubtotal = await this.getSubtotal();
    expect(actualSubtotal).toBe(expectedAmount);
  }

  async verifyTotalAmount(expectedAmount: number): Promise<void> {
    const actualTotal = await this.getTotal();
    expect(Math.abs(actualTotal - expectedAmount)).toBeLessThan(0.01);
  }
} 