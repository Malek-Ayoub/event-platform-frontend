import { createFallbackTenant, TenantProvider } from '@event-platform/tenant';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { CTASection } from './cta-section';

function renderWithTenant(ui: ReactNode) {
  return render(<TenantProvider fallbackTenant={createFallbackTenant()}>{ui}</TenantProvider>);
}

describe('CTASection', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders marketing copy and a primary call-to-action button', () => {
    renderWithTenant(<CTASection />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Ready to host your next event?' }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Join the platform to publish events, manage venues, and reach audiences ready to book.',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Get started' })).toBeTruthy();
  });

  it('does not render a navigable link for the call to action', () => {
    renderWithTenant(<CTASection />);

    expect(screen.queryByRole('link')).toBeNull();
  });
});
