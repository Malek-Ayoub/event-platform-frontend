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

  it('renders marketing copy and a Browse Events link to /events', () => {
    renderWithTenant(<CTASection />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Ready to find your next event?' }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Browse upcoming events, discover what is happening near you, and book your next experience.',
      ),
    ).toBeTruthy();

    const browseLink = screen.getByRole('link', { name: 'Browse Events' });
    expect(browseLink.getAttribute('href')).toBe('/events');
  });
});
