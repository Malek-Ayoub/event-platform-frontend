import { createFallbackTenant, TenantProvider } from '@event-platform/tenant';
import { PublicLayout } from '@event-platform/ui/layout';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LandingPage } from './landing-page';

vi.mock('@/components/events/events.query', () => ({
  useUpcomingEventsQuery: () => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

const LANDING_SECTION_LABELS = [
  'Hero',
  'Upcoming events',
  'Venue highlights',
  'Call to action',
] as const;

function renderLandingPage(ui: ReactNode = <LandingPage />) {
  return render(<TenantProvider fallbackTenant={createFallbackTenant()}>{ui}</TenantProvider>);
}

describe('LandingPage composition', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all four landing sections', () => {
    renderLandingPage();

    for (const label of LANDING_SECTION_LABELS) {
      expect(screen.getByRole('region', { name: label })).toBeTruthy();
    }
  });

  it('keeps landing sections in the expected order', () => {
    renderLandingPage();

    const regions = screen.getAllByRole('region');
    expect(regions.map((region) => region.getAttribute('aria-label'))).toEqual([
      ...LANDING_SECTION_LABELS,
    ]);
  });

  it('composes inside the application shell without breaking landmarks', () => {
    renderLandingPage(
      <PublicLayout header={<div>Site header</div>} footer={<div>Site footer</div>}>
        <LandingPage />
      </PublicLayout>,
    );

    const main = screen.getByRole('main');
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(main.contains(screen.getByRole('region', { name: 'Hero' }))).toBe(true);
    expect(main.contains(screen.getByRole('region', { name: 'Call to action' }))).toBe(true);
  });
});
