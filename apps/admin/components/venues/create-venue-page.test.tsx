import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { CreateVenuePage } from './create-venue-page';
import { useCreateVenueMutation } from '@/components/venues/venues.query';
import type { VenueResource } from '@/components/venues/venues.query';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/venues/venues.query', () => ({
  useCreateVenueMutation: vi.fn(),
}));

const CREATED_VENUE: VenueResource = {
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

function mockMutation(overrides: Partial<ReturnType<typeof useCreateVenueMutation>> = {}) {
  vi.mocked(useCreateVenueMutation).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    reset: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useCreateVenueMutation>);
}

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Venue name'), { target: { value: 'Harbor Hall' } });
  fireEvent.change(screen.getByLabelText('Subdomain'), { target: { value: 'harbor-hall' } });
  fireEvent.change(screen.getByLabelText('Owner name'), { target: { value: 'Sam Organizer' } });
  fireEvent.change(screen.getByLabelText('Owner email'), {
    target: { value: 'owner@harbor.test' },
  });
  fireEvent.change(screen.getByLabelText('Owner password'), {
    target: { value: 'Password123!' },
  });
}

describe('CreateVenuePage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows confirmation details after a successful create', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(CREATED_VENUE);
    mockMutation({ mutateAsync });

    render(<CreateVenuePage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create venue' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        name: 'Harbor Hall',
        subdomain: 'harbor-hall',
        owner_name: 'Sam Organizer',
        owner_email: 'owner@harbor.test',
        owner_password: 'Password123!',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Venue created')).toBeTruthy();
    });

    expect(screen.getByText('Harbor Hall')).toBeTruthy();
    expect(screen.getByText('harbor-hall.yourdomain.com')).toBeTruthy();
    expect(screen.getByText('owner@harbor.test')).toBeTruthy();
    expect(
      screen.getByText(/The owner can sign in now with the email and password you entered/),
    ).toBeTruthy();
  });

  it('keeps the form retryable after a 422 subdomain conflict', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(
      new ApiError('The subdomain has already been taken.', {
        status: 422,
        details: { subdomain: ['The subdomain has already been taken.'] },
      }),
    );
    mockMutation({ mutateAsync });

    render(<CreateVenuePage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create venue' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(
        'The subdomain has already been taken.',
      );
    });

    expect(screen.getByRole('button', { name: 'Create venue' })).toBeTruthy();
    expect(screen.getByLabelText('Venue name')).toBeTruthy();
  });

  it('shows Super Admin access required for 403 errors', async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new ApiError('Forbidden', { status: 403 }));
    mockMutation({ mutateAsync });

    render(<CreateVenuePage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create venue' }));

    await waitFor(() => {
      expect(screen.getByText('Super Admin access required')).toBeTruthy();
    });
  });

  it('resets to an empty form when Create another venue is clicked', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(CREATED_VENUE);
    const reset = vi.fn();
    mockMutation({ mutateAsync, reset });

    render(<CreateVenuePage />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create venue' }));

    await waitFor(() => {
      expect(screen.getByText('Venue created')).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create another venue' }));

    expect(screen.getByRole('button', { name: 'Create venue' })).toBeTruthy();
    expect((screen.getByLabelText('Venue name') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Subdomain') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Owner name') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Owner email') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Owner password') as HTMLInputElement).value).toBe('');
    expect(reset).toHaveBeenCalled();
  });
});
