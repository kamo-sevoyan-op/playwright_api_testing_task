import { expect, APIResponse, APIRequestContext } from '@playwright/test';

export async function validateRequest(response: APIResponse, statusCode = 200) {
  // The request is fulfilled
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(statusCode);

  const result = await response.json();
  // The result is not empty
  expect(result).toBeTruthy();

  return result;
}

export async function assertPageNumber(
  request: APIRequestContext,
  endpoint: string,
  pageNumber: number
) {
  const response = await request.get(`/${endpoint}`, {
    params: { page: pageNumber },
  });
  const result = await validateRequest(response);
  const { page: resultPageNumber } = result;

  expect(resultPageNumber).toBe(pageNumber);
}

export async function assertNonExistingPage(
  request: APIRequestContext,
  endpoint: string,
  pageNumber: number
) {
  const response = await request.get(`/${endpoint}`, {
    params: { page: pageNumber },
  });

  expect(response.ok()).toBeFalsy();
  expect(response.status()).toBe(404);
}

export function assertDefaultPage(result: any) {
  const { page: pageNumber } = result;
  expect(pageNumber).toBeTruthy();
  expect(pageNumber).toBe(1);
}

export async function assertNonExistingId(
  request: APIRequestContext,
  endpoint: string,
  id: number
) {
  const response = await request.get(`/${endpoint}/${id}`);

  expect(response.ok()).toBeFalsy();
  expect(response.status()).toBe(404);
}

export async function assertData(
  request: APIRequestContext,
  endpoint: string,
  testId: number,
  props: string[]
) {
  const response = await request.get(`/${endpoint}/${testId}`);
  const result = await validateRequest(response);
  const data = result.data;

  expect(data).toBeTruthy();

  const id = data.id;
  expect(data).toBeTruthy();
  expect(id).toBe(testId);

  props.forEach((p) => expect(data).toHaveProperty(p));
}

export async function assertPageData(result: any) {
  const { per_page, data } = result;

  expect(per_page).toBeTruthy();
  expect(data).toBeTruthy();
  expect(data).toHaveLength(per_page);
}
