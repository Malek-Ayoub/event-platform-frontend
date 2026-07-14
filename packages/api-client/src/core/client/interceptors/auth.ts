import type { SessionStorageAdapter } from '@event-platform/auth';
import type { RequestInterceptorConfig } from './headers.js';

function setHeader(config: RequestInterceptorConfig, key: string, value: string): void {
  if (typeof config.headers.set === 'function') {
    config.headers.set(key, value);
    return;
  }

  config.headers[key] = value;
}

export function createAuthInterceptor(sessionStorage?: SessionStorageAdapter) {
  return (config: RequestInterceptorConfig): RequestInterceptorConfig => {
    const token = sessionStorage?.get()?.accessToken;

    if (token) {
      setHeader(config, 'Authorization', `Bearer ${token}`);
    }

    return config;
  };
}
