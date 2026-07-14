import { createFallbackTenant, TenantProvider } from '@event-platform/tenant';
import { PublicLayout } from '@event-platform/ui/layout';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { EventsPage } from './events-page';

function renderEventsPage(ui: ReactNode = <EventsPage />) {
  return render(<TenantProvider fallbackTenant={createFallbackTenant()}>{ui}</TenantProvider>);
}

describe('EventsPage composition', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders EventsHeader with page title and intro copy', () => {
    renderEventsPage();

    expect(screen.getByRole('region', { name: 'Events' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Events' })).toBeTruthy();
    expect(
      screen.getByText('Browse upcoming events and discover what is happening near you.'),
    ).toBeTruthy();
  });

  it('renders EventsGridPlaceholder with event cards', () => {
    renderEventsPage();

    expect(screen.getByRole('region', { name: 'Events list' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Tech Forward Summit' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Harvest Food & Wine Festival' }),
    ).toBeTruthy();
  });

  it('keeps EventsHeader before EventsGridPlaceholder', () => {
    renderEventsPage();

    const regions = screen.getAllByRole('region');
    expect(regions.map((region) => region.getAttribute('aria-label'))).toEqual([
      'Events',
      'Events list',
    ]);
  });

  it('composes inside the application shell without breaking landmarks', () => {
    renderEventsPage(
      <PublicLayout header={<div>Site header</div>} footer={<div>Site footer</div>}>
        <EventsPage />
      </PublicLayout>,
    );

    const main = screen.getByRole('main');
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(main.contains(screen.getByRole('region', { name: 'Events' }))).toBe(true);
    expect(main.contains(screen.getByRole('region', { name: 'Events list' }))).toBe(true);
  });
});
