import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { VenuesListPage } from './venues-list-page';
import { useVenuesQuery } from '@/components/venues/venues.query';
import type { VenuesListResult } from '@/components/venues/venues.query';

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock('@/components/venues/venues.query', () => ({
  useVenuesQuery: vi.fn(),
}));

const LIST_RESULT: VenuesListResult = {
  data: [
    {
      id: 1,
      name: 'Harbor Hall',
      subdomain: 'harbor-hall',
      status: 'active',
      commission_rate: '1.00',
    },
    {
      id: 2,
      name: 'Sky Arena',
      subdomain: 'sky-arena',
      status: 'suspended',
      commission_rate: '2.50',
    },
  ],
  meta: {
    current_page: 1,
    last_page: 2,
    per_page: 15,
    total: 16,
    from: 1,
    to: 15,
  },
};

function mockQuery(overrides: Partial<ReturnType<typeof useVenuesQuery>> = {}) {
  vi.mocked(useVenuesQuery).mockReturnValue({
    data: LIST_RESULT,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useVenuesQuery>);
}

describe('VenuesListPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockSearchParams.delete('page');
  });

  it('renders venues with links and pagination', () => {
    mockQuery();

    render(<VenuesListPage />);

    expect(screen.getByRole('heading', { name: 'Venues' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Harbor Hall' }).getAttribute('href')).toBe(
      '/venues/1',
    );
    expect(screen.getByText('harbor-hall')).toBeTruthy();
    expect(screen.getByText('active')).toBeTruthy();
    expect(screen.getByText('1.00')).toBeTruthy();
    expect(screen.getByText('Page 1 of 2')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockPush).toHaveBeenCalledWith('/venues?page=2', { scroll: false });
  });

  it('shows empty state with create link', () => {
    mockQuery({
      data: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
          from: null,
          to: null,
        },
      },
    });

    render(<VenuesListPage />);

    expect(screen.getByText('No venues yet')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Create venue' }).length).toBeGreaterThan(0);
  });

  it('shows Super Admin access required for 403', () => {
    mockQuery({
      data: undefined,
      isError: true,
      error: new ApiError('Forbidden', { status: 403 }),
    });

    render(<VenuesListPage />);

    expect(screen.getByText('Super Admin access required')).toBeTruthy();
  });

  it('shows retry on generic load failure', () => {
    const refetch = vi.fn();
    mockQuery({
      data: undefined,
      isError: true,
      error: new Error('network'),
      refetch,
    });

    render(<VenuesListPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalled();
  });
});
