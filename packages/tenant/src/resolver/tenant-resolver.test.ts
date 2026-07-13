import { describe, expect, it } from 'vitest';
import { createFallbackTenant } from '../constants/defaults.js';
import { resolveTenant, TenantResolver } from '../resolver/tenant-resolver.js';

describe('TenantResolver', () => {
  const registry = {
    acme: {
      id: 'tenant-acme',
      slug: 'acme',
      branding: {
        name: 'Acme Events',
        slug: 'acme',
        logo: '/logo.svg',
        favicon: '/favicon.ico',
        primaryColor: '#111111',
        secondaryColor: '#222222',
      },
      theme: {
        '--color-primary': '#111111',
      },
    },
  };

  it('resolves tenant from subdomain', () => {
    const result = resolveTenant({
      hostname: 'acme.example.com',
      baseDomain: 'example.com',
      registry,
      useEnvOverride: false,
    });

    expect(result.slug).toBe('acme');
    expect(result.source).toBe('subdomain');
    expect(result.isFallback).toBe(false);
    expect(result.branding.name).toBe('Acme Events');
  });

  it('uses explicit slug override for tests', () => {
    const result = resolveTenant({
      hostname: 'example.com',
      baseDomain: 'example.com',
      registry,
      slugOverride: 'acme',
      useEnvOverride: false,
    });

    expect(result.slug).toBe('acme');
    expect(result.source).toBe('override');
  });

  it('falls back when hostname has no tenant subdomain', () => {
    const fallbackTenant = createFallbackTenant();
    const result = resolveTenant({
      hostname: 'example.com',
      baseDomain: 'example.com',
      fallbackTenant,
      useEnvOverride: false,
    });

    expect(result.source).toBe('fallback');
    expect(result.isFallback).toBe(true);
    expect(result.slug).toBe(fallbackTenant.slug);
  });

  it('marks unknown slug as fallback tenant data', () => {
    const result = new TenantResolver({
      baseDomain: 'example.com',
      useEnvOverride: false,
    }).resolve({ hostname: 'unknown.example.com' });

    expect(result.slug).toBe('unknown');
    expect(result.isFallback).toBe(true);
    expect(result.source).toBe('subdomain');
  });
});
