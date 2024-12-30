import { test, expect, APIResponse } from '@playwright/test';
import { validateRequest } from './utils';

const DUMMY_ENDPOINT = 'api/dummy_resource';

test.describe(`Tests for ${DUMMY_ENDPOINT} endpoint`, () => {
  test.describe('Without page query parameter', () => {
    let response: APIResponse;
    let result: any;

    test.beforeEach(async ({ request }) => {
      response = await request.get(`/${DUMMY_ENDPOINT}`);
      result = await validateRequest(response);
    });

    test('Should return resources', async () => {
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
      const response = await request.get(`/${DUMMY_ENDPOINT}`, {
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
      const response = await request.get(`/${DUMMY_ENDPOINT}`, {
        params: { page: pageNumber },
      });
      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Tests for single resource', () => {
    test('Should return resource data', async ({ request }) => {
      const resourceId = 1;

      const response = await request.get(`/${DUMMY_ENDPOINT}/${resourceId}`);
      const result = await validateRequest(response);

      const data = result.data;
      expect(data).toBeTruthy();

      const id = data.id;
      expect(data).toBeTruthy();
      expect(id).toBe(resourceId);

      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('year');
      expect(data).toHaveProperty('color');
    });

    test('Should return 404 status code for non existing resource id', async ({
      request,
    }) => {
      const resourceId = 13;
      const response = await request.get(`/${DUMMY_ENDPOINT}/${resourceId}`);

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(404);
    });
  });
});
