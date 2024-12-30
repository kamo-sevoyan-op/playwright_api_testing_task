import { test, expect } from '@playwright/test';
import { validateRequest } from './utils';

const USERS_ENDPOINT = 'api/users';

test.describe(`Tests for ${USERS_ENDPOINT}|POST endpoint`, () => {
  test('Should add new user data', async ({ request }) => {
    const userData = {
      name: 'John',
      job: 'Engineer',
    };

    const beforePost = new Date().getTime();
    const response = await request.post(USERS_ENDPOINT, { data: userData });

    const data = await validateRequest(response, 201);

    expect(data).toHaveProperty('name', userData.name);
    expect(data).toHaveProperty('job', userData.job);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('createdAt');

    const createdAt = new Date(data.createdAt).getTime();
    expect(beforePost).toBeLessThanOrEqual(createdAt);
  });
});
