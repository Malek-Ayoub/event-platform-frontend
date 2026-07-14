import { createFallbackTenant, TenantProvider } from '@event-platform/tenant';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as venueHighlightsData from '@/lib/mock-data/venue-highlights';
import { VenueHighlightsSection } from './venue-highlights-section';

function renderWithTenant(ui: ReactNode) {
  return render(<TenantProvider fallbackTenant={createFallbackTenant()}>{ui}</TenantProvider>);
}

describe('VenueHighlightsSection', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the section heading and intro copy', () => {
    renderWithTenant(<VenueHighlightsSection />);

    expect(screen.getByRole('heading', { level: 2, name: 'Venue highlights' })).toBeTruthy();
    expect(
      screen.getByText('Explore popular venues hosting memorable events near you.'),
    ).toBeTruthy();
  });

  it('renders venue highlight cards with accessible headings', () => {
    renderWithTenant(<VenueHighlightsSection />);

    expect(screen.getByRole('heading', { level: 3, name: 'Harborview Pavilion' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 3, name: 'The Loft at Market Street' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Cedar Hall' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Skyline Terrace' })).toBeTruthy();
  });

  it('renders an empty state when no venue highlights are available', () => {
    vi.spyOn(venueHighlightsData, 'getVenueHighlights').mockReturnValue([]);

    renderWithTenant(<VenueHighlightsSection />);

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('No venue highlights right now')).toBeTruthy();
    expect(
      screen.getByText('Check back soon for popular venues hosting upcoming events.'),
    ).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 3, name: 'Harborview Pavilion' })).toBeNull();
  });
});
