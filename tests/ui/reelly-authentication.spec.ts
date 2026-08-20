import { test, expect } from '@playwright/test';
import { ReellyLoginPage } from '../../pages/reelly-login.page';

const registeredEmail = process.env.REELLY_EMAIL;

test.describe('Reelly AI passwordless sign-in', () => {
  let loginPage: ReellyLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new ReellyLoginPage(page);
    await loginPage.open();
  });

  test('@smoke @reelly shows the passwordless login form', async ({ page }) => {
    await expect(loginPage.passwordlessMessage).toBeVisible();
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'name@domain.com');
    await expect(loginPage.sendCodeButton).toBeEnabled();
    await expect(page.getByAltText('Reelly')).toBeVisible();
  });

  test('@reelly requires an email address', async ({ page }) => {
    await loginPage.sendCodeButton.click();

    await expect(loginPage.requiredEmailError).toBeVisible();
    await expect(loginPage.emailInput).toBeFocused();
    await expect(page).toHaveURL(/\/auth\/login\/?(?:\?.*)?$/);
  });

  test('@reelly rejects an invalid email format', async ({ page }) => {
    await loginPage.requestCode('not-an-email');

    await expect
      .poll(
        async () =>
          (await loginPage.invalidEmailError.isVisible()) ||
          (await loginPage.requiredEmailError.isVisible()),
        { message: 'Expected Reelly to reject the malformed email address' }
      )
      .toBe(true);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.sendCodeButton).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login\/?(?:\?.*)?$/);
  });

  test('@reelly exposes account recovery and registration paths', async () => {
    await expect(loginPage.supportLink).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    await expect(loginPage.createAccountLink).toHaveAttribute('href', '/auth/signup');
  });

  const liveAuthTest = registeredEmail ? test : test.skip;
  liveAuthTest('@live-auth @reelly requests a one-time code for a registered user', async () => {
    await loginPage.requestCode(registeredEmail!);

    await loginPage.expectCodeEntryStep(registeredEmail!);
  });
});
