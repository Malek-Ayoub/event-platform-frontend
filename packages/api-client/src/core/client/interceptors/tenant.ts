import type { RequestInterceptorConfig } from './headers.js';

function setHeader(config: RequestInterceptorConfig, key: string, value: string): void {
  if (typeof config.headers.set === 'function') {
    config.headers.set(key, value);
    return;
  }

  config.headers[key] = value;
}

export function createTenantInterceptor(tenantSlug?: string | null) {
  return (config: RequestInterceptorConfig): RequestInterceptorConfig => {
    if (tenantSlug) {
      setHeader(config, 'X-Tenant', tenantSlug);
    }

    return config;
  };
}
