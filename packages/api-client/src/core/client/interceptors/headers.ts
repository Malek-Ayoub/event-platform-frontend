export type RequestInterceptorConfig = {
  headers: Record<string, string> & {
    set?: (key: string, value: string) => void;
  };
  method?: string;
};

function setHeader(config: RequestInterceptorConfig, key: string, value: string): void {
  if (typeof config.headers.set === 'function') {
    config.headers.set(key, value);
    return;
  }

  config.headers[key] = value;
}

export function applyHeadersInterceptor(
  config: RequestInterceptorConfig,
): RequestInterceptorConfig {
  setHeader(config, 'Accept', 'application/json');

  if (!config.headers['Content-Type'] && config.method?.toUpperCase() !== 'GET') {
    setHeader(config, 'Content-Type', 'application/json');
  }

  return config;
}
