export type TenantUrlOptions = {
  baseDomain: string;
  protocol?: 'http' | 'https';
  port?: number | string | null;
  apiPath?: string;
};

function formatPort(port: number | string | null | undefined): string {
  if (port === null || port === undefined || port === '') {
    return '';
  }

  const value = String(port);
  return value.startsWith(':') ? value : `:${value}`;
}

/**
 * Build the public URL for a tenant subdomain (e.g. `https://acme.example.com`).
 */
export function buildTenantPublicUrl(slug: string, options: TenantUrlOptions): string {
  const protocol = options.protocol ?? 'https';
  const port = formatPort(options.port);

  return `${protocol}://${slug}.${options.baseDomain}${port}`;
}

/**
 * Build the tenant-scoped API base URL (subdomain host + optional API path prefix).
 */
export function buildTenantApiBaseUrl(slug: string, options: TenantUrlOptions): string {
  const base = buildTenantPublicUrl(slug, options);
  const apiPath = options.apiPath ?? '/api';

  if (apiPath === '' || apiPath === '/') {
    return base;
  }

  return `${base}${apiPath.startsWith('/') ? apiPath : `/${apiPath}`}`;
}
