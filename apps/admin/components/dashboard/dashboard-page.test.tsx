import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import type { Session } from '@event-platform/auth';
import { DashboardPage } from './dashboard-page';
import { useAdminDashboardQuery } from '@/components/dashboard/dashboard.query';
import type { AdminDashboardData } from '@/components/dashboard/dashboard.query';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/dashboard/dashboard.query', () => ({
  useAdminDashboardQuery: vi.fn(),
}));

const SESSION: Session = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@platform.com',
    permissions: [],
    isSuperAdmin: true,
  },
};

const FULL_DASHBOARD: AdminDashboardData = {
  kpis: {
    gross_revenue: '125000.00',
    net_revenue: '120000.00',
    commission_due: '12500.00',
    commission_paid: '9000.00',
    outstanding_commission: '3500.00',
    active_events: 42,
    active_venues: 18,
    orders_count: 2400,
    tickets_sold: 4800,
  },
  today: {
    today_sales: '4500.00',
    today_revenue: '4300.00',
    today_orders: 60,
    today_check_ins: 180,
    events_starting_today: 3,
  },
  top_venues: [
    {
      venue_id: 1,
      venue_name: 'Harborview Pavilion',
      subdomain: 'harbor',
      gross_sales: '50000.00',
      commission_due: '5000.00',
      outstanding_commission: '1200.00',
    },
  ],
  top_events: [
    {
      event_id: 10,
      event_name: 'Summer Jazz Night',
      venue_id: 1,
      venue_name: 'Harborview Pavilion',
      gross_sales: '12000.00',
      tickets_sold: 200,
    },
  ],
  latest_orders: [
    {
      order_number: 'ORD-1001',
      customer_name: 'Alex Guest',
      amount: '90.00',
      status: 'paid',
      venue_name: 'Harborview Pavilion',
      created_at: '2026-07-17T12:00:00.000Z',
    },
  ],
  latest_payments: [
    {
      id: 7,
      venue_name: 'Harborview Pavilion',
      order_number: 'ORD-1001',
      amount: '90.00',
      currency: 'USD',
      provider: 'shamcash',
      status: 'verified',
      verified_at: '2026-07-17T12:05:00.000Z',
    },
  ],
  latest_check_ins: [
    {
      ticket_number: 'TKT-55',
      holder_name: 'Alex Guest',
      venue_name: 'Harborview Pavilion',
      checked_in_at: '2026-07-17T18:00:00.000Z',
      gate: 'Main',
    },
  ],
  alerts: [
    {
      type: 'outstanding_commission',
      severity: 'warning',
      count: 4,
      amount: '3500.00',
      message: 'Venues with outstanding commission.',
    },
  ],
  meta: {
    currency: 'USD',
    generated_at: '2026-07-17T16:00:00.000Z',
  },
};

const EMPTY_DASHBOARD: AdminDashboardData = {
  kpis: {},
  today: {},
  top_venues: [],
  top_events: [],
  latest_orders: [],
  latest_payments: [],
  latest_check_ins: [],
  alerts: [],
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

  it('renders KPIs and rows from every section on success', () => {
    vi.mocked(useAdminDashboardQuery).mockReturnValue({
      data: FULL_DASHBOARD,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAdminDashboardQuery>);

    renderDashboard();

    expect(screen.getByText('Admin User')).toBeTruthy();
    expect(screen.getByText('$125,000.00')).toBeTruthy();
    expect(screen.getByText('$120,000.00')).toBeTruthy();
    expect(screen.getByText('$4,500.00')).toBeTruthy();
    expect(screen.getByText('Venues with outstanding commission.')).toBeTruthy();
    expect(screen.getAllByText('Harborview Pavilion').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Summer Jazz Night')).toBeTruthy();
    expect(screen.getAllByText('ORD-1001').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('shamcash')).toBeTruthy();
    expect(screen.getByText('TKT-55')).toBeTruthy();
    expect(screen.getByText(/Gate:\s*Main/)).toBeTruthy();
  });

  it('shows No data yet for empty list sections', () => {
    vi.mocked(useAdminDashboardQuery).mockReturnValue({
      data: EMPTY_DASHBOARD,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAdminDashboardQuery>);

    renderDashboard();

    // top venues, top events, orders, payments, check-ins — alerts section is hidden when empty
    expect(screen.getAllByText('No data yet')).toHaveLength(5);
    expect(screen.queryByText('Alerts')).toBeNull();
  });

  it('shows Super Admin access required for 403 errors', () => {
    vi.mocked(useAdminDashboardQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Forbidden', { status: 403 }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAdminDashboardQuery>);

    renderDashboard();

    expect(screen.getByText('Super Admin access required')).toBeTruthy();
  });

  it('shows ErrorState with Retry for other errors', () => {
    const refetch = vi.fn();

    vi.mocked(useAdminDashboardQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Server error', { status: 500 }),
      refetch,
    } as unknown as ReturnType<typeof useAdminDashboardQuery>);

    renderDashboard();

    expect(screen.getByText('Unable to load dashboard')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
