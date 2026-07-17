import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { EventDetailPage } from './event-detail-page';
import type { EventDetailViewModel } from '@/components/events/events.query';
import { useEventDetailQuery } from '@/components/events/events.query';

vi.mock('@/components/events/events.query', () => ({
  useEventDetailQuery: vi.fn(),
}));

const MOCK_EVENT: EventDetailViewModel = {
  id: '1',
  slug: 'summer-jazz-night',
  title: 'Summer Jazz Night',
  description: 'An evening of jazz.',
  venue: 'Harborview Pavilion',
  imageUrl: 'https://picsum.photos/seed/summer-jazz/640/360',
  startDatetime: '2026-08-15T19:30:00.000Z',
  endDatetime: '2026-08-15T22:30:00.000Z',
  dateLabel: 'Aug 15, 2026, 7:30 PM',
  priceLabel: '$45.00',
  ticketTypes: [
    {
      id: '10',
      name: 'General Admission',
      priceAmount: 45,
      currency: 'USD',
      priceLabel: '$45.00',
      remaining: 3,
      isAvailable: true,
      benefits: ['Early entry'],
      color: '#336699',
    },
    {
      id: '11',
      name: 'VIP',
      priceAmount: 75,
      currency: 'USD',
      priceLabel: '$75.00',
      remaining: 10,
      isAvailable: false,
      benefits: null,
      color: '#cc3333',
    },
  ],
};

describe('EventDetailPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders event title and ticket types on success', () => {
    vi.mocked(useEventDetailQuery).mockReturnValue({
      data: MOCK_EVENT,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEventDetailQuery>);

    render(<EventDetailPage slug="summer-jazz-night" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Summer Jazz Night' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'General Admission' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'VIP' })).toBeTruthy();
  });

  it('renders NotFoundState when the API returns 404', () => {
    vi.mocked(useEventDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Resource not found.', { status: 404 }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEventDetailQuery>);

    render(<EventDetailPage slug="missing-event" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeTruthy();
    const backLink = screen.getByRole('link', { name: 'Back to events' });
    expect(backLink.getAttribute('href')).toBe('/events');
  });

  it('renders ErrorState with Retry action for non-404 errors', () => {
    const refetch = vi.fn();

    vi.mocked(useEventDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Server error', { status: 500 }),
      refetch,
    } as unknown as ReturnType<typeof useEventDetailQuery>);

    render(<EventDetailPage slug="summer-jazz-night" />);

    expect(screen.getByText('Unable to load event')).toBeTruthy();
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('shows "Not available" badge for unavailable ticket types', () => {
    const UNAVAILABLE_EVENT: EventDetailViewModel = {
      ...MOCK_EVENT,
      ticketTypes: [
        {
          id: '11',
          name: 'VIP',
          priceAmount: 75,
          currency: 'USD',
          priceLabel: '$75.00',
          remaining: 10,
          isAvailable: false,
          benefits: null,
          color: '#cc3333',
        },
      ],
    };

    vi.mocked(useEventDetailQuery).mockReturnValue({
      data: UNAVAILABLE_EVENT,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEventDetailQuery>);

    render(<EventDetailPage slug="summer-jazz-night" />);

    expect(screen.getByRole('heading', { level: 3, name: 'VIP' })).toBeTruthy();
    expect(screen.getByText('Not available')).toBeTruthy();
    expect(screen.queryByText(/Remaining:/i)).toBeNull();
    expect(screen.queryByLabelText(/Increase VIP quantity/i)).toBeNull();
  });

  it('increments and decrements quantity within remaining bounds', () => {
    vi.mocked(useEventDetailQuery).mockReturnValue({
      data: MOCK_EVENT,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useEventDetailQuery>);

    render(<EventDetailPage slug="summer-jazz-night" />);

    const decrease = screen.getByRole('button', {
      name: 'Decrease General Admission quantity',
    }) as HTMLButtonElement;
    const increase = screen.getByRole('button', {
      name: 'Increase General Admission quantity',
    }) as HTMLButtonElement;
    const checkout = screen.getByRole('button', { name: 'Continue to checkout' });

    expect(decrease.disabled).toBe(true);
    expect((checkout as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(increase);
    fireEvent.click(increase);
    expect(screen.getByLabelText('General Admission quantity').textContent).toBe('2');
    expect(decrease.disabled).toBe(false);

    fireEvent.click(increase);
    expect(screen.getByLabelText('General Admission quantity').textContent).toBe('3');
    expect(increase.disabled).toBe(true);

    const link = screen.getByRole('link', { name: 'Continue to checkout' });
    expect(link.getAttribute('href')).toBe('/events/summer-jazz-night/checkout?items=10:3');

    fireEvent.click(decrease);
    expect(screen.getByLabelText('General Admission quantity').textContent).toBe('2');
    expect(screen.getByRole('link', { name: 'Continue to checkout' }).getAttribute('href')).toBe(
      '/events/summer-jazz-night/checkout?items=10:2',
    );
  });
});
