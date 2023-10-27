import { test, expect, Page } from '@playwright/test';

// run these tests to see how error messages are displayed hiding implementation details of the boxed step. 
// comment out line 20 and run the second test to see how box steps work

async function addAndViewCart(page: Page){
  await test.step('add to cart', async () => {
    await page.getByRole('button', { name: 'Add To Bag' }).click();
    await page.getByLabel('cart').click();
  }, { box: true });
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
