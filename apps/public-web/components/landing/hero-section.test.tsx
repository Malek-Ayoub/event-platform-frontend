import { createFallbackTenant, TenantProvider, type Tenant } from '@event-platform/tenant';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HeroSection } from './hero-section';

function renderWithTenant(ui: ReactNode, tenant: Tenant = createFallbackTenant()) {
  return render(<TenantProvider fallbackTenant={tenant}>{ui}</TenantProvider>);
}

describe('HeroSection', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders tenant name and description from tenant context', () => {
    const tenant = createFallbackTenant({
      branding: {
        ...createFallbackTenant().branding,
        name: 'Acme Events',
        logo: null,
      },
    });

    renderWithTenant(<HeroSection />, tenant);

    expect(screen.getByRole('heading', { level: 1, name: 'Acme Events' })).toBeTruthy();
    expect(screen.getByText('Discover and book events with Acme Events.')).toBeTruthy();
  });

  it('renders tenant logo with accessible alt text when available', () => {
    const tenant = createFallbackTenant({
      branding: {
        ...createFallbackTenant().branding,
        name: 'Venue Co',
        logo: 'https://example.com/logo.png',
      },
    });

    renderWithTenant(<HeroSection />, tenant);

    expect(screen.getByRole('img', { name: 'Venue Co' })).toBeTruthy();
  });

  it('renders a visual fallback when tenant logo is unavailable', () => {
    const tenant = createFallbackTenant({
      branding: {
        ...createFallbackTenant().branding,
        name: 'Fallback Events',
        logo: null,
      },
    });

    renderWithTenant(<HeroSection />, tenant);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Fallback Events' })).toBeTruthy();
  });

  it('renders a placeholder browse events call to action', () => {
    renderWithTenant(<HeroSection />);

    expect(screen.getByRole('link', { name: 'Browse events' })).toBeTruthy();
  });
});
