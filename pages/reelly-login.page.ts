import { expect, type Locator, type Page } from '@playwright/test';

const defaultReellyBaseUrl = 'https://find.reelly.io';

export class ReellyLoginPage {
  readonly heading: Locator;
  readonly passwordlessMessage: Locator;
  readonly emailInput: Locator;
  readonly sendCodeButton: Locator;
  readonly requiredEmailError: Locator;
  readonly invalidEmailError: Locator;
  readonly supportLink: Locator;
  readonly createAccountLink: Locator;

  private readonly loginUrl: string;

  constructor(private readonly page: Page) {
    const baseUrl = process.env.REELLY_BASE_URL ?? defaultReellyBaseUrl;

    this.loginUrl = new URL('/auth/login', baseUrl).toString();
    this.heading = page.getByRole('heading', { name: 'Log in to Reelly' });
    this.passwordlessMessage = page.getByText("We'll send a 6-digit code to your email.");
    this.emailInput = page.getByRole('textbox', { name: 'Email address*' });
    this.sendCodeButton = page.getByRole('button', { name: 'Send code' });
    this.requiredEmailError = page.getByText('Email address is required');
    this.invalidEmailError = page.getByText('Enter valid email address');
    this.supportLink = page.getByRole('link', { name: 'Contact support.' });
    this.createAccountLink = page.getByRole('link', { name: 'Create an account' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.loginUrl);
    await expect(this.page).toHaveURL(/\/auth\/login\/?(?:\?.*)?$/);
    await expect(this.heading).toBeVisible();
  }

  async requestCode(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.sendCodeButton.click();
  }

  async expectCodeEntryStep(email: string): Promise<void> {
    await expect(this.emailInput).toBeHidden({ timeout: 15_000 });
    await expect(this.page.getByText(email, { exact: false }).first()).toBeVisible();
    await expect(
      this.page.locator('input[autocomplete="one-time-code"], input[inputmode="numeric"]').first()
    ).toBeVisible();
  }
}
