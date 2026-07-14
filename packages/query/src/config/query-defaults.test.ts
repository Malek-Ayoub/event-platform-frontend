import { describe, expect, it } from 'vitest';
import {
  CancelledRequestError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from '@event-platform/api-client/core';
import { defaultQueryRetry } from './query-defaults.js';

describe('defaultQueryRetry', () => {
  it('does not retry validation or auth errors', () => {
    expect(defaultQueryRetry(0, new ValidationError())).toBe(false);
    expect(defaultQueryRetry(0, new UnauthorizedError())).toBe(false);
    expect(defaultQueryRetry(0, new ForbiddenError())).toBe(false);
    expect(defaultQueryRetry(0, new CancelledRequestError())).toBe(false);
  });

  it('retries transient errors up to two times', () => {
    expect(defaultQueryRetry(0, new Error('boom'))).toBe(true);
    expect(defaultQueryRetry(1, new Error('boom'))).toBe(true);
    expect(defaultQueryRetry(2, new Error('boom'))).toBe(false);
  });
});
