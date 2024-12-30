import { test, expect } from '@playwright/test';

const USERS_ENDPOINT = 'api/users';

test.describe(`Tests for ${USERS_ENDPOINT}|DELETE endpoint`, () => {
  test('Should delete user data', async ({ request }) => {
    const userId = 16;
    const response = await request.delete(`${USERS_ENDPOINT}/${userId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);
  });
});
