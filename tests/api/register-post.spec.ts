import { test, expect } from '@playwright/test';
import { validateRequest } from './utils';

const REGISTER_ENDPOINT = 'api/register';
const { REGISTER_EMAIL, REGISTER_PASSWORD } = process.env;

test.describe(`Tests for ${REGISTER_ENDPOINT}|POST endpoint`, () => {
  test('Should register the user', async ({ request }) => {
    const credentials = {
      email: REGISTER_EMAIL ?? '',
      password: REGISTER_PASSWORD ?? '',
    };

    const response = await request.post(`${REGISTER_ENDPOINT}`, {
      data: credentials,
    });

    const data = await validateRequest(response);

    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('token');
  });

  test('Should fail to register with invalid credentials', async ({
    request,
  }) => {
    const credentials = {
      email: REGISTER_EMAIL ?? '',
    };

    const response = await request.post(`${REGISTER_ENDPOINT}`, {
      data: credentials,
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });
});
