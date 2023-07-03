import { test, expect, type Page } from '@playwright/test';

test.describe('Mocking an API call', () => {

  test('mocks a fruit and does not call api', async ({ page }) => {
    // Mock the api call before navigating
    await page.route('*/**/api/v1/fruits', async (route) => {
      const json = [{ name: 'Strawberry', id: 21 }];
      await route.fulfill({ json });
    });
    // Go to the page
    await page.goto('https://demo.playwright.dev/api-mocking');
  
    // Assert that the Strawberry fruit is visible
    await expect(page.getByText('Strawberry')).toBeVisible();
  });
  
});

test.describe('Intercepting the request and modifying it', () => {

  test('gets the json from api and adds a new fruit', async ({ page }) => {
    // Get the response and add to it
    await page.route('*/**/api/v1/fruits', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.push({ name: 'Playwright', id: 100 });
      // Fulfill using the original response, while patching the response body
      // with the given JSON object.
      await route.fulfill({ response, json });
    });

    // Go to the page
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Assert that the new fruit is visible
    await expect(page.getByText('Playwright', { exact: true })).toBeVisible();
  });
  
});

test.describe('Mocking with HAR files', () => {

  test('records or updates the HAR file', async ({ page }) => {
    // Get the response from the HAR file
    await page.routeFromHAR('./hars/fruits.har', {
      url: '*/**/api/v1/fruits',
      update: true,
    });

    // Go to the page
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Assert that the Playwright fruit is visible
    await expect(page.getByText('Strawberry')).toBeVisible();
  });

  test('gets the json from HAR and checks the new fruit has been added', async ({ page }) => {
    // Replay API requests from HAR.
    // Either use a matching response from the HAR,
    // or abort the request if nothing matches.
    await page.routeFromHAR('./hars/fruits.har', {
      url: '*/**/api/v1/fruits',
      update: false,
    });

    // Go to the page
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Assert that the Playwright fruit is visible
    await expect(page.getByText('Strawberry')).toBeVisible();
  });
});
