import {
  CancelledRequestError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from '@event-platform/api-client/core';
import { QueryClient } from '@tanstack/react-query';

export const defaultQueryRetry = (failureCount: number, error: unknown): boolean => {
  if (
    error instanceof ValidationError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof CancelledRequestError
  ) {
    return false;
  }

  return failureCount < 2;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: defaultQueryRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: defaultQueryRetry,
    },
  },
});
