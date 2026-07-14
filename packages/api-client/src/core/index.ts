export { ApiAuthAdapter } from './adapters/index.js';
export type { ApiAuthAdapterOptions } from './adapters/index.js';
export { initializeApiClients } from './bootstrap/index.js';
export type { InitializeApiClientsConfig } from './bootstrap/index.js';
export { createAdminClient, createPublicClient, createTenantClient } from './client/factory.js';
export type { ApiClient, ApiClientKind, CreateClientOptions } from './client/factory.js';
export { HttpClient } from './client/http-client.js';
export type { HttpClientOptions, HttpRequestConfig } from './client/http-client.js';
export {
  ApiClientsAlreadyInitializedError,
  ApiClientsNotInitializedError,
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
} from './errors/index.js';
export {
  getRegisteredApiClients,
  isApiClientsInitialized,
  resetApiClients,
} from './registry/index.js';
export type { RegisteredApiClients } from './registry/index.js';

export type { PublicApiClientName } from './generated/public-client.js';
export type { TenantApiClientName } from './generated/tenant-client.js';
export type { AdminApiClientName } from './generated/admin-client.js';

export type {
  paths as PublicPaths,
  components as PublicComponents,
} from './generated/public-types.js';
export type {
  paths as TenantPaths,
  components as TenantComponents,
} from './generated/tenant-types.js';
export type {
  paths as AdminPaths,
  components as AdminComponents,
} from './generated/admin-types.js';
