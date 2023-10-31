import { test } from '@playwright/test';
import { MainPage } from './boxed-step-pom'


// various test scenarios for adding items to the cart
// comment out the line before the `addAndViewCart` function in one of the tests 
// Then run the test to see how box steps hide the implementation details of the step

test.describe('add to cart scenarios', () => {
  test.beforeEach(async ({ page }) => {
    const pom = new MainPage(page);
    await pom.goto();
  });
  
  test('buy now from carousel using pom', async ({ page }) => {
    const pom = new MainPage(page);
    await page.getByRole('button', { name: 'Buy Now' }).click();
    await pom.addToCart();
    await pom.openCart();
    await pom.expectToBeInCart('Xbox Wireless Controller Lunar Shift Special Edition')
  });

  test('add to cart from search using pom', async ({ page }) => {
    const pom = new MainPage(page);
    const product = 'Xbox Wireless Controller Mineral Camo Special Edition'
    await pom.searchForProduct('xbox');
    await pom.clickOnProductByImage(product);
    await pom.addToCart();
    await pom.openCart();
    await pom.expectToBeInCart(product);
  });

  test('add to cart from all products page using pom', async ({ page }) => {
    const pom = new MainPage(page);
    const product = 'Xbox Wireless Controller Mineral Camo Special Edition'
    await pom.clickOnProductPage('All Products');
    await pom.clickOnProductByImage(product);
    await pom.addToCart();
    await pom.openCart();
    await pom.expectToBeInCart(product);
  });

  test('add to cart from all laptops page using pom', async ({ page }) => {
    const pom = new MainPage(page);
    const product = 'Microsoft Surface Pro X 1876 13 Inches Laptop'
    await pom.clickOnProductPage('Laptops');
    await pom.clickOnProductByImage(product);
    await pom.addToCart();
    await pom.openCart();
    await pom.expectToBeInCart(product);
  });
});
