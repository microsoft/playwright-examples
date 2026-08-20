import { test, expect } from '@playwright/test';

const apiBaseUrl = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

test.describe('Posts API', () => {
  test('@smoke returns a post by id', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/posts/1`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    await expect(response).toBeOK();
    expect(await response.json()).toMatchObject({ id: 1, userId: 1 });
  });

  test('returns not found for an unknown post', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/posts/999999`);

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({});
  });

  test('creates a post from valid data', async ({ request }) => {
    const payload = { title: 'Quality report', body: 'Release risks reviewed', userId: 7 };
    const response = await request.post(`${apiBaseUrl}/posts`, { data: payload });

    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject(payload);
  });
});
