import { describe, expect, it } from 'vitest';
import { getTenantFromHostname, isLocalhostDevelopment, isMainDomain } from './hostname.js';
import { buildTenantApiBaseUrl, buildTenantPublicUrl } from './urls.js';

const baseDomain = 'example.com';

describe('isMainDomain', () => {
  it('returns true for apex and www hosts', () => {
    expect(isMainDomain('example.com', baseDomain)).toBe(true);
    expect(isMainDomain('www.example.com', baseDomain)).toBe(true);
  });

  it('returns false for tenant subdomains', () => {
    expect(isMainDomain('acme.example.com', baseDomain)).toBe(false);
  });
});

describe('getTenantFromHostname', () => {
  it('extracts tenant slug from subdomain', () => {
    expect(getTenantFromHostname('acme.example.com', { baseDomain })).toBe('acme');
  });

  it('returns null for main domain', () => {
    expect(getTenantFromHostname('example.com', { baseDomain })).toBeNull();
    expect(getTenantFromHostname('www.example.com', { baseDomain })).toBeNull();
  });

  it('ignores excluded subdomains', () => {
    expect(
      getTenantFromHostname('api.example.com', {
        baseDomain,
        excludedSubdomains: ['api'],
      }),
    ).toBeNull();
  });

  it('supports localhost development hosts', () => {
    expect(getTenantFromHostname('acme.localhost', { baseDomain: 'localhost' })).toBe('acme');
    expect(isLocalhostDevelopment('acme.localhost', 'localhost')).toBe(true);
  });

  it('strips port from hostname', () => {
    expect(getTenantFromHostname('acme.example.com:3000', { baseDomain })).toBe('acme');
  });

  it('rejects nested subdomains', () => {
    expect(getTenantFromHostname('a.b.example.com', { baseDomain })).toBeNull();
  });
});

describe('tenant URL builders', () => {
  it('builds tenant public URLs', () => {
    expect(
      buildTenantPublicUrl('acme', {
        baseDomain: 'example.com',
        protocol: 'https',
      }),
    ).toBe('https://acme.example.com');
  });

  it('builds tenant API base URLs with default /api path', () => {
    expect(
      buildTenantApiBaseUrl('acme', {
        baseDomain: 'localhost',
        protocol: 'http',
        port: 8000,
      }),
    ).toBe('http://acme.localhost:8000/api');
  });
});
