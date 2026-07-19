import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { VenueDetailPage } from './venue-detail-page';
import {
  useActivateVenueMutation,
  useSuspendVenueMutation,
  useUpdateVenueMutation,
  useVenueQuery,
} from '@/components/venues/venues.query';
import type { VenueResource } from '@/components/venues/venues.query';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/venues/venues.query', () => ({
  useVenueQuery: vi.fn(),
  useUpdateVenueMutation: vi.fn(),
  useSuspendVenueMutation: vi.fn(),
  useActivateVenueMutation: vi.fn(),
}));

const ACTIVE_VENUE: VenueResource = {
  id: 12,
  name: 'Harbor Hall',
  slug: 'harbor-hall',
  subdomain: 'harbor-hall',
  status: 'active',
  commission_rate: '1.00',
  owner: {
    name: 'Sam Organizer',
    email: 'owner@harbor.test',
  },
  created_at: '2026-07-19T12:00:00.000Z',
};

function mockQuery(overrides: Partial<ReturnType<typeof useVenueQuery>> = {}) {
  vi.mocked(useVenueQuery).mockReturnValue({
    data: ACTIVE_VENUE,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useVenueQuery>);
}

function mockMutations({
  update = {},
  suspend = {},
  activate = {},
}: {
  update?: Partial<ReturnType<typeof useUpdateVenueMutation>>;
  suspend?: Partial<ReturnType<typeof useSuspendVenueMutation>>;
  activate?: Partial<ReturnType<typeof useActivateVenueMutation>>;
} = {}) {
  vi.mocked(useUpdateVenueMutation).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    ...update,
  } as unknown as ReturnType<typeof useUpdateVenueMutation>);

  vi.mocked(useSuspendVenueMutation).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    ...suspend,
  } as unknown as ReturnType<typeof useSuspendVenueMutation>);

  vi.mocked(useActivateVenueMutation).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    ...activate,
  } as unknown as ReturnType<typeof useActivateVenueMutation>);
}

describe('VenueDetailPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders venue details and edit form', () => {
    mockQuery();
    mockMutations();

    render(<VenueDetailPage venueId={12} />);

    expect(screen.getAllByText('Harbor Hall').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('harbor-hall')).toBeTruthy();
    expect(screen.getByText('Sam Organizer')).toBeTruthy();
    expect(screen.getByText('owner@harbor.test')).toBeTruthy();
    expect(screen.getByText('1.00')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Suspend' })).toBeTruthy();
    expect(screen.getByLabelText('Venue name')).toBeTruthy();
    expect(screen.getByLabelText('Commission rate')).toBeTruthy();
  });

  it('shows Venue not found for 404', () => {
    mockQuery({
      data: undefined,
      isError: true,
      error: new ApiError('Resource not found.', { status: 404 }),
    });
    mockMutations();

    render(<VenueDetailPage venueId={999} />);

    expect(screen.getByText('Venue not found')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to venues' }).getAttribute('href')).toBe(
      '/venues',
    );
  });

  it('shows Super Admin access required for 403', () => {
    mockQuery({
      data: undefined,
      isError: true,
      error: new ApiError('Forbidden', { status: 403 }),
    });
    mockMutations();

    render(<VenueDetailPage venueId={12} />);

    expect(screen.getByText('Super Admin access required')).toBeTruthy();
  });

  it('suspends an active venue and reflects the new status', async () => {
    const suspended: VenueResource = { ...ACTIVE_VENUE, status: 'suspended' };
    const mutateAsync = vi.fn().mockResolvedValue(suspended);

    mockQuery();
    mockMutations({ suspend: { mutateAsync } });

    const { rerender } = render(<VenueDetailPage venueId={12} />);

    fireEvent.click(screen.getByRole('button', { name: 'Suspend' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
    });

    mockQuery({ data: suspended });
    mockMutations({
      activate: { mutateAsync: vi.fn() },
    });
    rerender(<VenueDetailPage venueId={12} />);

    expect(screen.getByText('suspended')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Activate' })).toBeTruthy();
  });

  it('activates a suspended venue and reflects the new status', async () => {
    const suspended: VenueResource = { ...ACTIVE_VENUE, status: 'suspended' };
    const activated: VenueResource = { ...ACTIVE_VENUE, status: 'active' };
    const mutateAsync = vi.fn().mockResolvedValue(activated);

    mockQuery({ data: suspended });
    mockMutations({ activate: { mutateAsync } });

    const { rerender } = render(<VenueDetailPage venueId={12} />);

    fireEvent.click(screen.getByRole('button', { name: 'Activate' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
    });

    mockQuery({ data: activated });
    mockMutations({
      suspend: { mutateAsync: vi.fn() },
    });
    rerender(<VenueDetailPage venueId={12} />);

    expect(screen.getByText('active')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Suspend' })).toBeTruthy();
  });

  it('shows backend message when suspend returns 422', async () => {
    const mutateAsync = vi
      .fn()
      .mockRejectedValue(new ApiError('Venue is already suspended.', { status: 422 }));

    mockQuery();
    mockMutations({ suspend: { mutateAsync } });

    render(<VenueDetailPage venueId={12} />);
    fireEvent.click(screen.getByRole('button', { name: 'Suspend' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('Venue is already suspended.');
    });
  });

  it('shows backend validation message when update returns 422', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(
      new ApiError('The given data was invalid.', {
        status: 422,
        details: { commission_rate: ['The commission rate must not be greater than 100.'] },
      }),
    );

    mockQuery();
    mockMutations({ update: { mutateAsync } });

    render(<VenueDetailPage venueId={12} />);

    fireEvent.change(screen.getByLabelText('Venue name'), { target: { value: 'New Name' } });
    fireEvent.change(screen.getByLabelText('Commission rate'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(
        'The commission rate must not be greater than 100.',
      );
    });
  });

  it('saves name and commission rate on successful update', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({
      ...ACTIVE_VENUE,
      name: 'New Harbor',
      commission_rate: '3.50',
    });

    mockQuery();
    mockMutations({ update: { mutateAsync } });

    render(<VenueDetailPage venueId={12} />);

    fireEvent.change(screen.getByLabelText('Venue name'), { target: { value: 'New Harbor' } });
    fireEvent.change(screen.getByLabelText('Commission rate'), { target: { value: '3.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        name: 'New Harbor',
        commission_rate: 3.5,
      });
    });
  });
});
