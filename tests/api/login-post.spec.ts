import { test, expect } from '@playwright/test';
import { validateResponse } from './utils';

const LOGIN_ENDPOINT = 'api/login';
const { LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;

test.describe(`Tests for ${LOGIN_ENDPOINT}|POST endpoint`, () => {
  test('Should login the user', async ({ request }) => {
    const credentials = {
      email: LOGIN_EMAIL ?? '',
      password: LOGIN_PASSWORD ?? '',
    };

    const response = await request.post(`${LOGIN_ENDPOINT}`, {
      data: credentials,
    });

    const data = await validateResponse(response);

    expect(data).toHaveProperty('token');
  });

  test('Should fail to login with invalid credentials', async ({ request }) => {
    const credentials = {
      email: LOGIN_EMAIL ?? '',
    };

    const response = await request.post(`${LOGIN_ENDPOINT}`, {
      data: credentials,
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });
});
