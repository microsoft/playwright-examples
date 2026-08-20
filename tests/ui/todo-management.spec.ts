import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.page';
import { todos } from '../../test-data/todos';

test.describe('Todo management', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.open();
  });

  test('@smoke creates a new task', async () => {
    await todoPage.addTodo(todos.critical);

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoCount).toContainText('1 item left');
  });

  test('completes and filters tasks', async () => {
    await todoPage.addTodo(todos.regression);
    await todoPage.addTodo(todos.report);
    await todoPage.completeTodo(todos.regression);
    await todoPage.filterBy('Completed');

    await expect(todoPage.item(todos.regression)).toBeVisible();
    await expect(todoPage.item(todos.report)).toBeHidden();
  });

  test('clears completed tasks without deleting active work', async () => {
    await todoPage.addTodo(todos.regression);
    await todoPage.addTodo(todos.report);
    await todoPage.completeTodo(todos.regression);
    await todoPage.clearCompletedButton.click();

    await expect(todoPage.item(todos.regression)).toHaveCount(0);
    await expect(todoPage.item(todos.report)).toBeVisible();
    await expect(todoPage.todoCount).toContainText('1 item left');
  });

  test('does not create an empty task', async () => {
    await todoPage.newTodo.fill('   ');
    await todoPage.newTodo.press('Enter');

    await expect(todoPage.todoItems).toHaveCount(0);
  });
});
