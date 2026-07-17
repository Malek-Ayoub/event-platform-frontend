import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventCardViewModel, PublicEventsQueryResult } from '@/components/events/events.query';
import { EventsGrid } from './events-grid';
import { usePublicEventsQuery } from './events.query';

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

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

const SINGLE_PAGE_RESULT: PublicEventsQueryResult = {
  data: MOCK_EVENTS,
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 1,
    from: 1,
    to: 1,
  },
};

const MULTI_PAGE_RESULT: PublicEventsQueryResult = {
  data: MOCK_EVENTS,
  meta: {
    current_page: 1,
    last_page: 3,
    per_page: 12,
    total: 30,
    from: 1,
    to: 12,
  },
};

describe('EventsGrid', () => {
  afterEach(() => {
    cleanup();
    mockPush.mockReset();
    mockSearchParams = new URLSearchParams();
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
      data: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 0,
          from: null,
          to: null,
        },
      },
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
    expect(screen.queryByRole('navigation', { name: 'Events pagination' })).toBeNull();
  });

  it('renders event cards when public events load successfully', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: SINGLE_PAGE_RESULT,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByRole('heading', { level: 3, name: 'Summer Jazz Night' })).toBeTruthy();
  });

  it('passes the current page from URL search params to the query hook', () => {
    mockSearchParams = new URLSearchParams('page=2');

    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: {
        ...MULTI_PAGE_RESULT,
        meta: { ...MULTI_PAGE_RESULT.meta, current_page: 2 },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(usePublicEventsQuery).toHaveBeenCalledWith({ page: 2 });
  });

  it('defaults to page 1 when the page query param is missing', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: SINGLE_PAGE_RESULT,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(usePublicEventsQuery).toHaveBeenCalledWith({ page: 1 });
  });

  it('shows pagination with the current page and last page when multiple pages exist', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: MULTI_PAGE_RESULT,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByRole('navigation', { name: 'Events pagination' })).toBeTruthy();
    expect(screen.getByText('Page 1 of 3')).toBeTruthy();
  });

  it('does not show pagination when only one page exists', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: SINGLE_PAGE_RESULT,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.queryByRole('navigation', { name: 'Events pagination' })).toBeNull();
  });

  it('disables Previous on the first page and Next on the last page', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: {
        ...MULTI_PAGE_RESULT,
        meta: { ...MULTI_PAGE_RESULT.meta, current_page: 3 },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByText('Page 3 of 3')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Previous' }).hasAttribute('disabled')).toBe(false);
    expect(screen.getByRole('button', { name: 'Next' }).hasAttribute('disabled')).toBe(true);
  });

  it('disables Previous on page 1', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: MULTI_PAGE_RESULT,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    expect(screen.getByRole('button', { name: 'Previous' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: 'Next' }).hasAttribute('disabled')).toBe(false);
  });

  it('updates the URL page query when Next is clicked', () => {
    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: MULTI_PAGE_RESULT,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(mockPush).toHaveBeenCalledWith('/events?page=2', { scroll: false });
  });

  it('removes the page query when navigating back to page 1', () => {
    mockSearchParams = new URLSearchParams('page=2');

    vi.mocked(usePublicEventsQuery).mockReturnValue({
      data: {
        ...MULTI_PAGE_RESULT,
        meta: { ...MULTI_PAGE_RESULT.meta, current_page: 2 },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePublicEventsQuery>);

    render(<EventsGrid />);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    expect(mockPush).toHaveBeenCalledWith('/events', { scroll: false });
  });
});
