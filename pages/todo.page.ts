import { expect, type Locator, type Page } from '@playwright/test';

export class TodoPage {
  readonly newTodo: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;

  constructor(private readonly page: Page) {
    this.newTodo = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  async open(): Promise<void> {
    await this.page.goto('./');
    await expect(this.page).toHaveURL(/\/todomvc\/?(?:#\/?)?$/);
    await expect(this.newTodo).toBeVisible();
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodo.fill(title);
    await this.newTodo.press('Enter');
    await expect(this.todoItems.filter({ hasText: title })).toBeVisible();
  }

  item(title: string): Locator {
    return this.todoItems.filter({ hasText: title });
  }

  async completeTodo(title: string): Promise<void> {
    const item = this.item(title);
    await item.getByRole('checkbox').check();
    await expect(item).toHaveClass(/completed/);
  }

  async filterBy(name: 'All' | 'Active' | 'Completed'): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
