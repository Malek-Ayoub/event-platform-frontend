export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; details?: unknown; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code ?? 'api_error';
    this.details = options.details;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network request failed', cause?: unknown) {
    super(message, { status: 0, code: 'network_error', cause });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out', cause?: unknown) {
    super(message, { status: 0, code: 'timeout_error', cause });
    this.name = 'TimeoutError';
  }
}

export class CancelledRequestError extends ApiError {
  constructor(message = 'Request was cancelled', cause?: unknown) {
    super(message, { status: 0, code: 'cancelled_request', cause });
    this.name = 'CancelledRequestError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, { status: 401, code: 'unauthorized', details });
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', details?: unknown) {
    super(message, { status: 403, code: 'forbidden', details });
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, { status: 422, code: 'validation_error', details });
    this.name = 'ValidationError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, { status: 409, code: 'conflict', details });
    this.name = 'ConflictError';
  }
}

export class SessionExpiredError extends ApiError {
  constructor(message = 'Session expired', details?: unknown) {
    super(message, { status: 419, code: 'session_expired', details });
    this.name = 'SessionExpiredError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Server error', details?: unknown) {
    super(message, { status: 500, code: 'server_error', details });
    this.name = 'ServerError';
  }
}

export class ApiClientsAlreadyInitializedError extends ApiError {
  constructor() {
    super('API clients have already been initialized.', {
      code: 'api_clients_already_initialized',
    });
    this.name = 'ApiClientsAlreadyInitializedError';
  }
}

export class ApiClientsNotInitializedError extends ApiError {
  constructor() {
    super('API clients have not been initialized. Call initializeApiClients() first.', {
      code: 'api_clients_not_initialized',
    });
    this.name = 'ApiClientsNotInitializedError';
  }
}
