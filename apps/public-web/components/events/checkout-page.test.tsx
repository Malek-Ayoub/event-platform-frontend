import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { CheckoutPage } from './checkout-page';
import type { EventDetailViewModel } from '@/components/events/events.query';
import { useEventDetailQuery } from '@/components/events/events.query';
import { useCreatePublicOrderMutation } from '@/components/events/orders.query';

vi.mock('@/components/events/events.query', () => ({
  useEventDetailQuery: vi.fn(),
}));

vi.mock('@/components/events/orders.query', () => ({
  useCreatePublicOrderMutation: vi.fn(),
}));

const MOCK_EVENT: EventDetailViewModel = {
  id: '1',
  slug: 'summer-jazz-night',
  title: 'Summer Jazz Night',
  description: 'An evening of jazz.',
  venue: 'Harborview Pavilion',
  imageUrl: null,
  startDatetime: '2026-08-15T19:30:00.000Z',
  endDatetime: null,
  dateLabel: 'Aug 15, 2026, 7:30 PM',
  priceLabel: '$45.00',
  ticketTypes: [
    {
      id: '10',
      name: 'General Admission',
      priceAmount: 45,
      currency: 'USD',
      priceLabel: '$45.00',
      remaining: 90,
      isAvailable: true,
      benefits: null,
      color: null,
    },
    {
      id: '15',
      name: 'Balcony',
      priceAmount: 30,
      currency: 'USD',
      priceLabel: '$30.00',
      remaining: 20,
      isAvailable: true,
      benefits: null,
      color: null,
    },
  ],
};

function mockDetailSuccess(event: EventDetailViewModel = MOCK_EVENT) {
  vi.mocked(useEventDetailQuery).mockReturnValue({
    data: event,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useEventDetailQuery>);
}

function mockMutation(
  overrides: {
    mutateAsync?: ReturnType<typeof vi.fn>;
    isPending?: boolean;
  } = {},
) {
  const mutateAsync = overrides.mutateAsync ?? vi.fn();
  vi.mocked(useCreatePublicOrderMutation).mockReturnValue({
    mutateAsync,
    isPending: overrides.isPending ?? false,
  } as unknown as ReturnType<typeof useCreatePublicOrderMutation>);
  return mutateAsync;
}

describe('CheckoutPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders order summary for valid items', () => {
    mockDetailSuccess();
    mockMutation();

    render(<CheckoutPage slug="summer-jazz-night" rawItems="10:2,15:1" />);

    expect(screen.getByText('General Admission')).toBeTruthy();
    expect(screen.getByText('Qty: 2')).toBeTruthy();
    expect(screen.getByText('Balcony')).toBeTruthy();
    expect(screen.getByText('Qty: 1')).toBeTruthy();
    expect(screen.getByText('$90.00')).toBeTruthy();
    expect(screen.getByText('$30.00')).toBeTruthy();
    expect(screen.getByText(/Total:/i).textContent).toContain('$120.00');
  });

  it('shows ErrorState when selection is empty or invalid', () => {
    mockDetailSuccess();
    mockMutation();

    const { rerender } = render(<CheckoutPage slug="summer-jazz-night" rawItems="" />);
    expect(screen.getByText('Your selection is no longer valid')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to event' }).getAttribute('href')).toBe(
      '/events/summer-jazz-night',
    );

    rerender(<CheckoutPage slug="summer-jazz-night" rawItems="10:999" />);
    expect(screen.getByText('Your selection is no longer valid')).toBeTruthy();

    rerender(<CheckoutPage slug="summer-jazz-night" rawItems="99:1" />);
    expect(screen.getByText('Your selection is no longer valid')).toBeTruthy();
  });

  it('shows confirmation with order_number after successful submit', async () => {
    mockDetailSuccess();
    const mutateAsync = mockMutation({
      mutateAsync: vi.fn().mockResolvedValue({
        id: 7,
        order_number: 'ORD-ABC12345',
        status: 'pending',
        total: '90.00',
        customer_name: 'Jane Doe',
        customer_email: 'jane@example.com',
      }),
    });

    render(<CheckoutPage slug="summer-jazz-night" rawItems="10:2" />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        event_id: 1,
        customer_name: 'Jane Doe',
        customer_email: 'jane@example.com',
        customer_phone: null,
        line_items: [{ ticket_type_id: 10, quantity: 2 }],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Order placed')).toBeTruthy();
      expect(screen.getByText('ORD-ABC12345')).toBeTruthy();
      expect(screen.getByText(/Status:\s*pending/i)).toBeTruthy();
    });
  });

  it('shows retryable 422 validation message above the form', async () => {
    mockDetailSuccess();
    mockMutation({
      mutateAsync: vi.fn().mockRejectedValue(
        new ApiError('Not enough tickets remaining.', {
          status: 422,
          details: { line_items: ['Not enough tickets remaining.'] },
        }),
      ),
    });

    render(<CheckoutPage slug="summer-jazz-night" rawItems="10:2" />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('Not enough tickets remaining.');
    });

    expect(screen.getByRole('button', { name: 'Place order' })).toBeTruthy();
    expect(screen.getByLabelText('Name')).toBeTruthy();
  });

  it('shows a dedicated message for 429 rate limiting', async () => {
    mockDetailSuccess();
    mockMutation({
      mutateAsync: vi.fn().mockRejectedValue(new ApiError('Too Many Attempts.', { status: 429 })),
    });

    render(<CheckoutPage slug="summer-jazz-night" rawItems="10:1" />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'too many attempts, try again in a minute',
      );
    });
  });
});
