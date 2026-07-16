import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventCardViewModel } from '@/components/events/events.query';
import { EventsGrid } from './events-grid';
import { usePublicEventsQuery } from './events.query';

vi.mock('./events.query', () => ({
  usePublicEventsQuery: vi.fn(),
}));

const MOCK_EVENTS: EventCardViewModel[] = [
  {
    id: '1',
    slug: 'summer-jazz-night',
    title: 'Summer Jazz Night',
    venue: 'Harborview Pavilion',
    imageUrl: null,
    startDatetime: '2026-08-15T19:30:00.000Z',
    dateLabel: 'Aug 15, 2026, 7:30 PM',
    priceLabel: '$45.00',
  },
];

describe('EventsGrid', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.mocked(usePublicEventsQuery).mockReset();
  });

  it('renders a loading state while public events are loading', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByText('Loading events')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders an error state when the public events query fails', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByText('Unable to load events')).toBeTruthy();
  });

  it('renders event cards when public events load successfully', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: MOCK_EVENTS,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
  });
});
