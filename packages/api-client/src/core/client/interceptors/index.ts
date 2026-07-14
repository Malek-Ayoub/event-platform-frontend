import type { SessionStorageAdapter } from '@event-platform/auth';
import { createAuthInterceptor } from './auth.js';
import { applyHeadersInterceptor, type RequestInterceptorConfig } from './headers.js';
import { createTenantInterceptor } from './tenant.js';

export type InterceptorOptions = {
  sessionStorage?: SessionStorageAdapter;
  tenantSlug?: string | null;
  includeTenantHeader?: boolean;
};

type AxiosInstanceLike = {
  interceptors: {
    request: {
      use: (onFulfilled: (config: RequestInterceptorConfig) => RequestInterceptorConfig) => number;
    };
  };
};

export function applyRequestInterceptors(
  axiosInstance: AxiosInstanceLike,
  options: InterceptorOptions,
): void {
  axiosInstance.interceptors.request.use(applyHeadersInterceptor);
  axiosInstance.interceptors.request.use(createAuthInterceptor(options.sessionStorage));

  if (options.includeTenantHeader) {
    axiosInstance.interceptors.request.use(createTenantInterceptor(options.tenantSlug));
  }
}

export { createAuthInterceptor } from './auth.js';
export { applyHeadersInterceptor } from './headers.js';
export type { RequestInterceptorConfig } from './headers.js';
export { createTenantInterceptor } from './tenant.js';
export { mapAxiosError } from './errors.js';
