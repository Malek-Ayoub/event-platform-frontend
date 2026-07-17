import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import type { Session } from '@event-platform/auth';
import { DashboardPage } from './dashboard-page';
import { useOrganizerDashboardQuery } from '@/components/dashboard/dashboard.query';
import type { OrganizerDashboardData } from '@/components/dashboard/dashboard.query';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/dashboard/dashboard.query', () => ({
  useOrganizerDashboardQuery: vi.fn(),
}));

const SESSION: Session = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Jane Organizer',
    email: 'jane@venue.com',
    permissions: ['reports.view'],
  },
};

const FULL_DASHBOARD: OrganizerDashboardData = {
  kpis: {
    gross_sales: '12500.00',
    net_revenue: '12000.00',
    orders_count: 84,
    tickets_sold: 160,
    tickets_remaining: 40,
    attendance_rate: '72.50',
    outstanding_commission: '350.00',
  },
  today: {
    today_sales: '450.00',
    today_orders: 6,
    today_check_ins: 18,
    today_revenue: '430.00',
  },
  events: [
    {
      id: 1,
      name: 'Summer Jazz Night',
      starts_at: '2026-08-15T19:30:00.000Z',
      tickets_sold: 90,
      capacity: 100,
      remaining: 10,
      status: 'published',
    },
  ],
  latest_orders: [
    {
      order_number: 'ORD-1001',
      customer_name: 'Alex Guest',
      amount: '90.00',
      status: 'paid',
      created_at: '2026-07-17T12:00:00.000Z',
    },
  ],
  latest_check_ins: [
    {
      ticket_number: 'TKT-55',
      holder_name: 'Alex Guest',
      checked_in_at: '2026-07-17T18:00:00.000Z',
      gate: 'Main',
    },
  ],
  commission: {
    due: '1250.00',
    paid: '900.00',
    outstanding: '350.00',
  },
  meta: {
    currency: 'USD',
    generated_at: '2026-07-17T16:00:00.000Z',
  },
};

const EMPTY_DASHBOARD: OrganizerDashboardData = {
  kpis: {},
  today: {},
  events: [],
  latest_orders: [],
  latest_check_ins: [],
  commission: {},
  meta: { currency: 'USD' },
};

function renderDashboard() {
  const storage = new MemorySessionStorage();
  storage.set(SESSION);

  return render(
    <AuthProvider storage={storage}>
      <DashboardPage />
    </AuthProvider>,
  );
}

describe('DashboardPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders KPIs, today, commission, and list rows on success', () => {
    vi.mocked(useOrganizerDashboardQuery).mockReturnValue({
      data: FULL_DASHBOARD,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useOrganizerDashboardQuery>);

    renderDashboard();

    expect(screen.getByText('Jane Organizer')).toBeTruthy();
    expect(screen.getByText('$12,500.00')).toBeTruthy();
    expect(screen.getByText('$12,000.00')).toBeTruthy();
    expect(screen.getByText('72.50%')).toBeTruthy();
    expect(screen.getByText('$450.00')).toBeTruthy();
    expect(screen.getByText('Due')).toBeTruthy();
    expect(screen.getByText('$1,250.00')).toBeTruthy();
    expect(screen.getByText('Summer Jazz Night')).toBeTruthy();
    expect(screen.getByText('ORD-1001')).toBeTruthy();
    expect(screen.getAllByText('Alex Guest').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('TKT-55')).toBeTruthy();
    expect(screen.getByText(/Gate:\s*Main/)).toBeTruthy();
  });

  it('shows No data yet for empty list sections', () => {
    vi.mocked(useOrganizerDashboardQuery).mockReturnValue({
      data: EMPTY_DASHBOARD,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useOrganizerDashboardQuery>);

    renderDashboard();

    expect(screen.getAllByText('No data yet')).toHaveLength(3);
  });

  it('shows a dedicated message for 403 errors', () => {
    vi.mocked(useOrganizerDashboardQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Forbidden', { status: 403 }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useOrganizerDashboardQuery>);

    renderDashboard();

    expect(screen.getByText("You don't have access to this dashboard")).toBeTruthy();
  });

  it('shows ErrorState with Retry for other errors', () => {
    const refetch = vi.fn();

    vi.mocked(useOrganizerDashboardQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Server error', { status: 500 }),
      refetch,
    } as unknown as ReturnType<typeof useOrganizerDashboardQuery>);

    renderDashboard();

    expect(screen.getByText('Unable to load dashboard')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
