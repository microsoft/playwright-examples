import { test, expect, Page } from '@playwright/test';

// various test scenarios for adding items to the cart
// comment out the line before the `addAndViewCart` function in one of the tests 
// Then run the test to see how box steps hide the implementation details of the step

// reusable function to add an item to the cart and view the cart
// we wrap our actions in a test step and set box to true
async function addAndViewCart(page: Page){
  await test.step('add and view cart', async () => {
    await page.getByRole('button', { name: 'Add To Bag' }).click();
    await page.getByLabel('cart').click();
  }, { box: true }); // box: true will hide the implementation details of the step
}

test.describe('add to cart scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://cloudtesting.contosotraders.com/')
  });

  test('add to cart from carousel', async ({ page }) => {
    await page.getByRole('button', { name: 'Buy Now' }).click();
    await addAndViewCart(page);
    await expect(page.getByText('Xbox Wireless Controller Lunar Shift Special Edition')).toBeVisible();
  });

  test('add to cart from search', async ({ page }) => {
    const product = 'Xbox Wireless Controller Mineral Camo Special Edition'
    const placeholder = page.getByPlaceholder('Search by product name or search by image')
    await placeholder.click();
    await placeholder.fill('xbox');
    await placeholder.press('Enter');
    await page.getByRole('img', { name: product }).click();
    await addAndViewCart(page);
    await expect(page.getByText(product)).toBeVisible();
  });

  test('add to cart from all products page', async ({ page }) => {
    const product = 'Xbox Wireless Controller Lunar Shift Special Edition'
    await page.getByRole('link', { name: 'All Products' }).first().click();
    await page.getByRole('img', { name: product }).click();
    await addAndViewCart(page);
    await expect(page.getByText(product)).toBeVisible();
  });

  test('add to cart from laptops page', async ({ page }) => {
    const product = 'Microsoft Surface Pro X 1876 13 Inches Laptop'
    await page.getByRole('link', { name: 'Laptops' }).first().click();
    await page.getByRole('img', { name:  product}).click();
    await addAndViewCart(page);
    await expect(page.getByText(product)).toBeVisible();
  });
});
