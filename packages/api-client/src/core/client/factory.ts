import type { SessionStorageAdapter } from '@event-platform/auth';
import { HttpClient, type HttpClientOptions } from './http-client.js';

export type ApiClientKind = 'public' | 'tenant' | 'admin';

export type ApiClient = HttpClient;

export type CreateClientOptions = Omit<HttpClientOptions, 'baseUrl'> & {
  baseUrl: string;
};

function createClient(kind: ApiClientKind, options: CreateClientOptions): ApiClient {
  return new HttpClient(kind, options);
}

export function createPublicClient(options: CreateClientOptions): ApiClient {
  return createClient('public', options);
}

export function createTenantClient(options: CreateClientOptions): ApiClient {
  return createClient('tenant', options);
}

export function createAdminClient(options: CreateClientOptions): ApiClient {
  return createClient('admin', options);
}

export type { SessionStorageAdapter };
