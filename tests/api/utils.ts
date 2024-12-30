import { expect, APIResponse, APIRequestContext } from '@playwright/test';

export async function validateRequest(response: APIResponse) {
  // The request is fulfilled
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

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

export function assertDefaultPage(
  result: any,
) { 
  const { page: pageNumber } = result;
  expect(pageNumber).toBeTruthy();
  expect(pageNumber).toBe(1);
}