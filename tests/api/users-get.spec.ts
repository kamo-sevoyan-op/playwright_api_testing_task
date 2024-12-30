import { test, expect, APIResponse } from '@playwright/test';
import {
  assertDefaultPage,
  assertNonExistingId,
  assertNonExistingPage,
  assertPageNumber,
  validateRequest,
} from './utils';

const USERS_ENDPOINT = 'api/users';

test.describe(`Tests for ${USERS_ENDPOINT} endpoint`, () => {
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
      assertDefaultPage(result);
    });
  });

  test.describe('With page query parameter', () => {
    const pageNumbers = [1, 2];

    pageNumbers.forEach((pageNumber) =>
      test(`Page number should be equal to query parameter, page=${pageNumber}`, async ({
        request,
      }) => {
        await assertPageNumber(request, USERS_ENDPOINT, pageNumber);
      })
    );

    test('Should return 404 status code for non existing page', async ({
      request,
    }) => {
      await assertNonExistingPage(request, USERS_ENDPOINT, 3);
    });
  });

  test.describe('Tests for single user', () => {
    const userIds = [1, 2, 3, 4];

    userIds.forEach((userId) =>
      test(`Should return user data, user_id=${userId}`, async ({
        request,
      }) => {
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
      })
    );

    test('Should return 404 status code for non existing user id', async ({
      request,
    }) => {
      const userId = 13;
      await assertNonExistingId(request, USERS_ENDPOINT, userId);
    });
  });
});
