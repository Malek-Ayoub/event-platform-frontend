import { describe, expect, it } from 'vitest';
import { mapAxiosError } from './errors.js';
import {
  CancelledRequestError,
  ForbiddenError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ValidationError,
} from '../../errors/index.js';

describe('mapAxiosError', () => {
  it('maps network failures', () => {
    const error = mapAxiosError({ message: 'Network Error' });
    expect(error).toBeInstanceOf(NetworkError);
  });

  it('maps timeout failures', () => {
    const error = mapAxiosError({ code: 'ECONNABORTED', message: 'timeout' });
    expect(error).toBeInstanceOf(TimeoutError);
  });

  it('maps cancelled requests', () => {
    const error = mapAxiosError({ code: 'ERR_CANCELED', name: 'CanceledError' });
    expect(error).toBeInstanceOf(CancelledRequestError);
  });

  it('maps validation responses', () => {
    const error = mapAxiosError({
      message: 'Unprocessable',
      response: {
        status: 422,
        data: { message: 'Invalid', errors: { email: ['required'] } },
      },
    });

    expect(error).toBeInstanceOf(ValidationError);
  });

  it('maps unauthorized responses', () => {
    const error = mapAxiosError({
      message: 'Unauthorized',
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    });

    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('maps forbidden responses', () => {
    const error = mapAxiosError({
      message: 'Forbidden',
      response: {
        status: 403,
        data: { message: 'Forbidden' },
      },
    });

    expect(error).toBeInstanceOf(ForbiddenError);
  });
});
