import type { SessionStorageAdapter } from '@event-platform/auth';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { applyRequestInterceptors } from '../client/interceptors/index.js';
import { mapAxiosError } from '../client/interceptors/errors.js';

export type HttpClientOptions = {
  baseUrl: string;
  sessionStorage?: SessionStorageAdapter;
  tenantSlug?: string | null;
  timeoutMs?: number;
};

export type HttpRequestConfig = Omit<AxiosRequestConfig, 'baseURL'>;

export class HttpClient {
  readonly kind: 'public' | 'tenant' | 'admin';
  private readonly axios: AxiosInstance;

  constructor(kind: 'public' | 'tenant' | 'admin', options: HttpClientOptions) {
    this.kind = kind;
    this.axios = axios.create({
      baseURL: options.baseUrl.replace(/\/+$/, ''),
      timeout: options.timeoutMs ?? 30_000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    applyRequestInterceptors(this.axios as never, {
      sessionStorage: options.sessionStorage,
      tenantSlug: options.tenantSlug,
      includeTenantHeader: kind === 'tenant',
    });

    this.axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(mapAxiosError(error)),
    );
  }

  get axiosInstance(): AxiosInstance {
    return this.axios;
  }

  async request<T>(config: HttpRequestConfig): Promise<T> {
    const response = await this.axios.request<T>(config);
    return response.data;
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

export type { AxiosResponse, InternalAxiosRequestConfig };
