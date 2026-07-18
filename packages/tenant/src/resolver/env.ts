/**
 * Next.js only inlines `process.env.NEXT_PUBLIC_*` when the key is a static
 * string literal. Dynamic `process.env[key]` access always returns undefined
 * in the browser bundle — do not use it for NEXT_PUBLIC_* reads.
 */

function readImportMetaEnv(key: string): string | undefined {
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
    const value = env?.[key]?.trim();
    return value || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Read tenant slug override from supported environment variables.
 */
export function readTenantSlugFromEnv(): string | null {
  if (typeof process !== 'undefined') {
    const fromNext = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim();
    if (fromNext) {
      return fromNext;
    }

    const fromNode = process.env.TENANT_SLUG?.trim();
    if (fromNode) {
      return fromNode;
    }
  }

  const fromVite = readImportMetaEnv('VITE_TENANT_SLUG');
  if (fromVite) {
    return fromVite;
  }

  return null;
}

/**
 * Read base domain override for local development.
 */
export function readBaseDomainFromEnv(): string | null {
  if (typeof process !== 'undefined') {
    const fromNext = process.env.NEXT_PUBLIC_TENANCY_BASE_DOMAIN?.trim();
    if (fromNext) {
      return fromNext;
    }

    const fromNode = process.env.TENANCY_BASE_DOMAIN?.trim();
    if (fromNode) {
      return fromNode;
    }
  }

  const fromVite = readImportMetaEnv('VITE_TENANCY_BASE_DOMAIN');
  if (fromVite) {
    return fromVite;
  }

  return null;
}
