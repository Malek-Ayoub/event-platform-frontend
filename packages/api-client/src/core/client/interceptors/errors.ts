import {
  ApiError,
  CancelledRequestError,
  ConflictError,
  ForbiddenError,
  NetworkError,
  ServerError,
  SessionExpiredError,
  TimeoutError,
  UnauthorizedError,
  ValidationError,
} from '../../errors/index.js';

type HttpLikeError = {
  code?: string;
  message?: string;
  name?: string;
  response?: {
    status: number;
    data?: unknown;
  };
};

function isHttpLikeError(error: unknown): error is HttpLikeError {
  return typeof error === 'object' && error !== null;
}

function extractMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string' && data.length > 0) {
    return data;
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;

    if (typeof record.message === 'string') {
      return record.message;
    }

    if (typeof record.error === 'string') {
      return record.error;
    }
  }

  return fallback;
}

function extractValidationDetails(data: unknown): unknown {
  if (data && typeof data === 'object' && 'errors' in data) {
    return (data as Record<string, unknown>).errors;
  }

  return data;
}

export function mapAxiosError(error: unknown): ApiError {
  if (!isHttpLikeError(error)) {
    return new ApiError('Unexpected API error.', { cause: error });
  }

  if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
    return new CancelledRequestError(error.message, error);
  }

  if (error.code === 'ECONNABORTED') {
    return new TimeoutError(error.message, error);
  }

  if (!error.response) {
    return new NetworkError(error.message, error);
  }

  const status = error.response.status;
  const message = extractMessage(error.response.data, error.message ?? 'Request failed');
  const details = error.response.data;

  switch (status) {
    case 401:
      return new UnauthorizedError(message, details);
    case 403:
      return new ForbiddenError(message, details);
    case 409:
      return new ConflictError(message, details);
    case 419:
      return new SessionExpiredError(message, details);
    case 422:
      return new ValidationError(message, extractValidationDetails(details));
    default:
      if (status >= 500) {
        return new ServerError(message, details);
      }

      return new ApiError(message, { status, details, cause: error });
  }
}
