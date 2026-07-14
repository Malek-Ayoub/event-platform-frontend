import { createFallbackTenant, TenantProvider } from '@event-platform/tenant';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as featuredEventsData from '@/lib/mock-data/featured-events';
import { FeaturedEventsSection } from './featured-events-section';

function renderWithTenant(ui: ReactNode) {
  return render(<TenantProvider fallbackTenant={createFallbackTenant()}>{ui}</TenantProvider>);
}

describe('FeaturedEventsSection', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the section heading and intro copy', () => {
    renderWithTenant(<FeaturedEventsSection />);

    expect(screen.getByRole('heading', { level: 2, name: 'Featured events' })).toBeTruthy();
    expect(screen.getByText('Discover upcoming events curated for you.')).toBeTruthy();
  });

  it('renders featured event cards with accessible headings', () => {
    renderWithTenant(<FeaturedEventsSection />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Tech Forward Summit' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Harvest Food & Wine Festival' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'New Year Gala' })).toBeTruthy();
  });

  it('renders an empty state when no featured events are available', () => {
    vi.spyOn(featuredEventsData, 'getFeaturedEvents').mockReturnValue([]);

    renderWithTenant(<FeaturedEventsSection />);

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('No featured events right now')).toBeTruthy();
    expect(
      screen.getByText('Check back soon for upcoming events you can discover and book.'),
    ).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeNull();
  });
});
