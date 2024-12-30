import { test, expect } from '@playwright/test';
import { validateResponse } from './utils';

const USERS_ENDPOINT = 'api/users';

test.describe(`Tests for ${USERS_ENDPOINT}|PATCH endpoint`, () => {
  test('Should update user data', async ({ request }) => {
    const userData = {
      name: 'John',
      job: 'Engineer',
    };
    const userId = 2;

    const beforePost = new Date().getTime();
    const response = await request.patch(`${USERS_ENDPOINT}/${userId}`, {
      data: userData,
    });
    const data = await validateResponse(response);

    expect(data).toHaveProperty('name', userData.name);
    expect(data).toHaveProperty('job', userData.job);
    expect(data).toHaveProperty('updatedAt');

    const createdAt = new Date(data.updatedAt).getTime();
    expect(beforePost).toBeLessThanOrEqual(createdAt);
  });
});
