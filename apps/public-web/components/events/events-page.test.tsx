import { createFallbackTenant, TenantProvider } from '@event-platform/tenant';
import { PublicLayout } from '@event-platform/ui/layout';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { EventCardViewModel } from '@/components/events/events.query';
import { EventsPage } from './events-page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const MOCK_EVENTS: EventCardViewModel[] = [
  {
    id: '1',
    slug: 'summer-jazz-night',
    title: 'Summer Jazz Night',
    venue: 'Harborview Pavilion',
    imageUrl: 'https://picsum.photos/seed/summer-jazz/640/360',
    startDatetime: '2026-08-15T19:30:00.000Z',
    dateLabel: 'Aug 15, 2026, 7:30 PM',
    priceLabel: '$45.00',
  },
  {
    id: '2',
    slug: 'tech-forward-summit',
    title: 'Tech Forward Summit',
    venue: 'The Loft at Market Street',
    imageUrl: 'https://picsum.photos/seed/tech-summit/640/360',
    startDatetime: '2026-09-20T09:00:00.000Z',
    dateLabel: 'Sep 20, 2026, 9:00 AM',
    priceLabel: '$120.00',
  },
  {
    id: '3',
    slug: 'harvest-food-wine-festival',
    title: 'Harvest Food & Wine Festival',
    venue: 'Cedar Hall',
    imageUrl: null,
    startDatetime: '2026-10-05T17:00:00.000Z',
    dateLabel: 'Oct 5, 2026, 5:00 PM',
    priceLabel: 'Free',
  },
];

vi.mock('@/components/events/events.query', () => ({
  usePublicEventsQuery: () => ({
    data: {
      data: MOCK_EVENTS,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 3,
        from: 1,
        to: 3,
      },
    },
    isLoading: false,
    isError: false,
  }),
}));

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

  it('renders EventsGrid with event cards from the public events query', () => {
    renderEventsPage();

    expect(screen.getByRole('region', { name: 'Events list' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Tech Forward Summit' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Harvest Food & Wine Festival' }),
    ).toBeTruthy();
  });

  it('keeps EventsHeader before EventsGrid', () => {
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
