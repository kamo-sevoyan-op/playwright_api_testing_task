import { test, expect, APIResponse } from '@playwright/test';
import {
  assertDefaultPage,
  assertNonExistingId,
  assertNonExistingPage,
  assertPageNumber,
  validateRequest,
} from './utils';

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
      assertDefaultPage(result);
    });
  });

  test.describe('With page query parameter', () => {
    const pageNumbers = [1, 2];

    pageNumbers.forEach((pageNumber) =>
      test(`Page number should be equal to query parameter, page=${pageNumber}`, async ({
        request,
      }) => {
        await assertPageNumber(request, DUMMY_ENDPOINT, pageNumber);
      })
    );

    test('Should return 404 status code for non existing page', async ({
      request,
    }) => {
      await assertNonExistingPage(request, DUMMY_ENDPOINT, 3);
    });
  });

  test.describe('Tests for single resource', () => {
    const resourceIds = [1, 2, 3, 4];

    resourceIds.forEach((resourceId) => {
      test(`Should return resource data, resource_id=${resourceId}`, async ({
        request,
      }) => {
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
    });

    test('Should return 404 status code for non existing resource id', async ({
      request,
    }) => {
      const resourceId = 13;
      await assertNonExistingId(request, DUMMY_ENDPOINT, resourceId);
    });
  });
});
