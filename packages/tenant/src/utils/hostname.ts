export type HostnameParseOptions = {
  baseDomain: string;
  excludedSubdomains?: readonly string[];
};

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().split(':')[0] ?? '';
}

/**
 * Returns true when the hostname represents the main (non-tenant) domain.
 */
export function isMainDomain(hostname: string, baseDomain: string): boolean {
  const normalizedHost = normalizeHost(hostname);
  const normalizedBase = baseDomain.toLowerCase();

  return normalizedHost === normalizedBase || normalizedHost === `www.${normalizedBase}`;
}

/**
 * Extract a tenant slug from a hostname using subdomain tenancy rules.
 */
export function getTenantFromHostname(
  hostname: string,
  { baseDomain, excludedSubdomains = [] }: HostnameParseOptions,
): string | null {
  const normalizedHost = normalizeHost(hostname);
  const normalizedBase = baseDomain.toLowerCase();

  if (isMainDomain(normalizedHost, normalizedBase)) {
    return null;
  }

  const suffix = `.${normalizedBase}`;

  if (!normalizedHost.endsWith(suffix)) {
    return null;
  }

  const subdomain = normalizedHost.slice(0, -suffix.length);

  if (subdomain.length === 0 || subdomain.includes('.')) {
    return null;
  }

  if (excludedSubdomains.includes(subdomain)) {
    return null;
  }

  return subdomain;
}

/**
 * Local development helper: `acme.localhost` resolves to `acme`.
 */
export function isLocalhostDevelopment(hostname: string, baseDomain: string): boolean {
  const normalizedHost = normalizeHost(hostname);
  const normalizedBase = baseDomain.toLowerCase();

  return normalizedBase === 'localhost' && normalizedHost.endsWith('.localhost');
}
