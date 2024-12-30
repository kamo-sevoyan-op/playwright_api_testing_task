import { test, expect, APIResponse } from '@playwright/test';

const USERS_ENDPOINT = 'api/users';

async function validateRequest(response: APIResponse) {
  // The request is fulfilled
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const result = await response.json();
  // The result is not empty
  expect(result).toBeTruthy();

  return result;
}

test.describe('Tests for /api/users endpoint', () => {
  test.describe('Without page query parameter', () => {
    let response: APIResponse;
    let result: any;

    test.beforeEach(async ({ request }) => {
      response = await request.get(`/${USERS_ENDPOINT}`);
      result = await validateRequest(response);
    });

    test('Should return users', async () => {
      const { per_page, data } = result;

      expect(per_page).toBeTruthy();
      expect(data).toBeTruthy();
      expect(data).toHaveLength(per_page);
    });

    test('Default value for page query parameter should be "1"', async () => {
      const { page: pageNumber } = result;
      expect(pageNumber).toBeTruthy();
      expect(pageNumber).toBe(1);
    });
  });

  test.describe('With page query parameter', () => {
    test('Page number should be equal to query parameter', async ({
      request,
    }) => {
      const PAGE_NUMBER = 1;
      const response = await request.get(`/${USERS_ENDPOINT}`, {
        params: { page: PAGE_NUMBER },
      });
      const result = await validateRequest(response);

      const { page: pageNumber } = result;

      expect(pageNumber).toBe(PAGE_NUMBER);
    });

    test('Should return 404 status code for non existing page', async ({
      request,
    }) => {
      const pageNumber = 3;
      const response = await request.get(`/${USERS_ENDPOINT}`, {
        params: { page: pageNumber },
      });
      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Tests for single user', () => {
    test('Should return user data', async ({ request }) => {
      const userId = 1;

      const response = await request.get(`/${USERS_ENDPOINT}/${userId}`);
      const result = await validateRequest(response);

      const data = result.data;
      expect(data).toBeTruthy();

      const id = data.id;
      expect(data).toBeTruthy();
      expect(id).toBe(userId);

      expect(data).toHaveProperty('first_name');
      expect(data).toHaveProperty('last_name');
      expect(data).toHaveProperty('email');
      expect(data).toHaveProperty('avatar');
    });

    test('Should return 404 status code for non existing user id', async ({
      request,
    }) => {
      const userId = 13;
      const response = await request.get(`/${USERS_ENDPOINT}/${userId}`);

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });
});
