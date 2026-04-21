import { test, expect } from '@playwright/test';

test.describe('Form validation', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');
    });

    test('should show error when required field is empty', async ({ page }) => {
        const input = page.getByPlaceholder('What needs to be done?');
        await input.click();
        await input.press('Enter');
        const items = page.getByTestId('todo-item');
        await expect(items).toHaveCount(0);
    });

    test('should not accept whitespace-only input', async ({ page }) => {
        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('     ');
        await input.press('Enter');
        const items = page.getByTestId('todo-item');
        await expect(items).toHaveCount(0);
    });

    test('should accept valid input and add item', async ({ page }) => {
        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('Buy groceries');
        await input.press('Enter');
        const items = page.getByTestId('todo-item');
        await expect(items).toHaveCount(1);
        await expect(items.first()).toContainText('Buy groceries');
    });

    test('should clear input field after valid submission', async ({ page }) => {
        const input = page.getByPlaceholder('What needs to be done?');
        await input.fill('Walk the dog');
        await input.press('Enter');
        await expect(input).toHaveValue('');
    });

    test('should allow adding multiple valid items', async ({ page }) => {
        const input = page.getByPlaceholder('What needs to be done?');
        const todos = ['Buy milk', 'Read a book', 'Go for a run'];
        for (const todo of todos) {
            await input.fill(todo);
            await input.press('Enter');
        }
        const items = page.getByTestId('todo-item');
        await expect(items).toHaveCount(3);
    });

});