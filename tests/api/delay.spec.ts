import { test } from '@playwright/test';
import { validateResponse } from './utils';

const USERS_ENDPOINT = 'api/users';

test.describe('Tests for delayed responses', () => {
  const delaysMs = [2_000, 3_000, 10_000];

  delaysMs.forEach((delay) =>
    test(`Delayed response, delay: ${delay}`, async ({ request }) => {
      const response = await request.get(`/${USERS_ENDPOINT}`, {
        params: { delay: delay / 1_000 },
        timeout: delay * 1.2,
      });
      const result = await validateResponse(response);
    })
  );
});
