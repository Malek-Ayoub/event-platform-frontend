export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export function buildUrl(base: string, path = ''): string {
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  if (normalizedPath === '') {
    return normalizedBase;
  }

  return `${normalizedBase}/${normalizedPath}`;
}

export function appendQueryParams(url: string, params: QueryParams): string {
  const [pathname, existingQuery = ''] = url.split('?');
  const search = new URLSearchParams(existingQuery);

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }

    search.set(key, String(value));
  }

  const query = search.toString();
  return query.length > 0 ? `${pathname}?${query}` : pathname;
}

/**
 * Extract tenant subdomain from a hostname (e.g. `acme.example.com` → `acme`).
 */
export function parseSubdomain(hostname: string, baseDomain: string): string | null {
  const normalizedHost = hostname.toLowerCase().split(':')[0] ?? '';
  const normalizedBase = baseDomain.toLowerCase();

  if (normalizedHost === normalizedBase || normalizedHost === `www.${normalizedBase}`) {
    return null;
  }

  const suffix = `.${normalizedBase}`;

  if (!normalizedHost.endsWith(suffix)) {
    return null;
  }

  const subdomain = normalizedHost.slice(0, -suffix.length);

  return subdomain.length > 0 ? subdomain : null;
}

export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}
