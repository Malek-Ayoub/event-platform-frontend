const ENV_KEYS = ['NEXT_PUBLIC_TENANT_SLUG', 'VITE_TENANT_SLUG', 'TENANT_SLUG'] as const;

function readProcessEnv(key: string): string | undefined {
  if (typeof process === 'undefined') {
    return undefined;
  }

  return process.env[key]?.trim() || undefined;
}

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
  for (const key of ENV_KEYS) {
    const fromProcess = readProcessEnv(key);
    if (fromProcess) {
      return fromProcess;
    }

    const fromImportMeta = readImportMetaEnv(key);
    if (fromImportMeta) {
      return fromImportMeta;
    }
  }

  return null;
}

/**
 * Read base domain override for local development.
 */
export function readBaseDomainFromEnv(): string | null {
  const keys = [
    'NEXT_PUBLIC_TENANCY_BASE_DOMAIN',
    'VITE_TENANCY_BASE_DOMAIN',
    'TENANCY_BASE_DOMAIN',
  ] as const;

  for (const key of keys) {
    const fromProcess = readProcessEnv(key);
    if (fromProcess) {
      return fromProcess;
    }

    const fromImportMeta = readImportMetaEnv(key);
    if (fromImportMeta) {
      return fromImportMeta;
    }
  }

  return null;
}
