import { expect, APIResponse } from '@playwright/test';

export async function validateRequest(response: APIResponse) {
  // The request is fulfilled
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const result = await response.json();
  // The result is not empty
  expect(result).toBeTruthy();

  return result;
}
