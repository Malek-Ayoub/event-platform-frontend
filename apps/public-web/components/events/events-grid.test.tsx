import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByText('Loading events')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders an error state with a Retry action when the query fails', () => {
    const refetch = vi.fn();

    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByText('Unable to load events')).toBeTruthy();

    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders an empty state when the query succeeds with no events', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    const emptyState = screen.getByRole('status');
    expect(emptyState.getAttribute('data-slot')).toBe('events-empty-state');
    expect(screen.getByText('No events available right now')).toBeTruthy();
    expect(
      screen.getByText('Check back soon for upcoming events you can discover and book.'),
    ).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('renders event cards when public events load successfully', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: MOCK_EVENTS,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
  });
});
