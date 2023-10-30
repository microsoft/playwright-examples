import { test, expect, Page } from '@playwright/test';

export class MainPage {
  constructor(private readonly page: Page) { }
  
  async goto() {
    await this.page.goto('https://cloudtesting.contosotraders.com/');
  }

  // using the boxedStep decorator defined below
  @boxedStep
  async searchForProduct(query: string) {
    await this.page.getByPlaceholder('Search by product name or search by image').click();
    await this.page.getByPlaceholder('Search by product name or search by image').fill(query);
    await this.page.getByPlaceholder('Search by product name or search by image').press('Enter');
  }

  // using the boxedStep decorator defined below
  @boxedStep
  async clickOnProductPage(link: string) {
    await this.page.getByRole('link', { name: link }).first().click();
  }

  // using the boxedStep decorator defined below
  @boxedStep
  async clickOnProductByImage(title: string) {
    await this.page.getByRole('img', { name: title }).click();
  }

  // using the boxedStep decorator defined below
  @boxedStep
  async addToCart() {
    await this.page.getByRole('button', { name: 'Add To Bag' }).click();
  }

  // using the boxedStep decorator defined below
  @boxedStep
  async openCart() {
    await this.page.getByLabel('cart').click();
  }

  // using the boxedStep decorator defined below
  @boxedStep
  async expectToBeInCart(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }
}


// Leveraging TypeScript decorators to wrap functions
// https://www.typescriptlang.org/docs/handbook/decorators.html
// A boxed test.step() gets defined with the name of the method
function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
  return function replacementMethod(...args: any) {
    const name = this.constructor.name + '.' + (context.name as string);
    return test.step(name, async () => {
      return await target.call(this, ...args);
    }, { box: true });  // Note the "box" option here.
  };
}
