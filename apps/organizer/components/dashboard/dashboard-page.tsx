'use client';

import { useRouter } from 'next/navigation';
import { ApiError } from '@event-platform/api-client/core';
import { useAuth } from '@event-platform/auth';
import { formatCurrency, formatDateTime, formatPercentage } from '@event-platform/shared';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@event-platform/ui';
import { Container, ErrorState, LoadingState, Section } from '@event-platform/ui/layout';
import { useOrganizerDashboardQuery } from '@/components/dashboard/dashboard.query';
import type {
  OrganizerDashboardCheckIn,
  OrganizerDashboardEvent,
  OrganizerDashboardOrder,
} from '@/components/dashboard/dashboard.query';

function money(amount: string | undefined, currency: string | undefined): string {
  if (amount == null) {
    return '—';
  }

  return formatCurrency(Number(amount), currency ?? 'USD');
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function SectionEmpty() {
  return <p className="text-sm text-muted-foreground">No data yet</p>;
}

function EventsList({ events }: { events: OrganizerDashboardEvent[] }) {
  if (events.length === 0) {
    return <SectionEmpty />;
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {events.map((event) => (
        <li
          key={event.id ?? event.name}
          className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
        >
          <div className="space-y-1">
            <p className="font-medium">{event.name ?? '—'}</p>
            <p className="text-muted-foreground">
              {event.starts_at ? formatDateTime(event.starts_at) : '—'}
            </p>
            <p className="text-muted-foreground">
              Sold: {event.tickets_sold ?? 0}/{event.capacity ?? 0} · Remaining:{' '}
              {event.remaining ?? 0}
            </p>
          </div>
          {event.status ? <Badge variant="secondary">{event.status}</Badge> : null}
        </li>
      ))}
    </ul>
  );
}

function OrdersList({
  orders,
  currency,
}: {
  orders: OrganizerDashboardOrder[];
  currency: string | undefined;
}) {
  if (orders.length === 0) {
    return <SectionEmpty />;
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {orders.map((order) => (
        <li
          key={order.order_number}
          className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
        >
          <div className="space-y-1">
            <p className="font-medium">{order.order_number ?? '—'}</p>
            <p className="text-muted-foreground">{order.customer_name ?? '—'}</p>
            <p className="text-muted-foreground">
              {order.created_at ? formatDateTime(order.created_at) : '—'}
            </p>
          </div>
          <div className="space-y-2 text-right">
            <p className="font-medium">{money(order.amount, currency)}</p>
            {order.status ? <Badge variant="secondary">{order.status}</Badge> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function CheckInsList({ checkIns }: { checkIns: OrganizerDashboardCheckIn[] }) {
  if (checkIns.length === 0) {
    return <SectionEmpty />;
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {checkIns.map((checkIn) => (
        <li
          key={`${checkIn.ticket_number}-${checkIn.checked_in_at}`}
          className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
        >
          <div className="space-y-1">
            <p className="font-medium">{checkIn.ticket_number ?? '—'}</p>
            <p className="text-muted-foreground">{checkIn.holder_name ?? '—'}</p>
            <p className="text-muted-foreground">
              {checkIn.checked_in_at ? formatDateTime(checkIn.checked_in_at) : '—'}
            </p>
          </div>
          {checkIn.gate ? (
            <p className="text-sm text-muted-foreground">Gate: {checkIn.gate}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data, isLoading, isError, error, refetch } = useOrganizerDashboardQuery();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const currency = data?.meta.currency;

  return (
    <Section spacing="lg" variant="muted" aria-label="Dashboard">
      <Container className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            {user ? (
              <div className="space-y-1 text-sm">
                <p>
                  Signed in as <span className="font-medium">{user.name}</span>
                </p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            ) : null}
          </div>
          <Button type="button" variant="outline" onClick={() => void handleLogout()}>
            Logout
          </Button>
        </div>

        {isLoading ? (
          <LoadingState title="Loading dashboard" description="Fetching organizer overview." />
        ) : null}

        {isError ? (
          error instanceof ApiError && error.status === 403 ? (
            <ErrorState
              title="You don't have access to this dashboard"
              description="Your account does not have permission to view organizer dashboard data."
            />
          ) : (
            <ErrorState
              title="Unable to load dashboard"
              description="We could not load the organizer dashboard right now. Please try again."
              action={
                <Button type="button" onClick={() => void refetch()}>
                  Retry
                </Button>
              }
            />
          )
        ) : null}

        {!isLoading && !isError && data ? (
          <>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">KPIs</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Gross sales" value={money(data.kpis.gross_sales, currency)} />
                <KpiCard label="Net revenue" value={money(data.kpis.net_revenue, currency)} />
                <KpiCard label="Orders" value={String(data.kpis.orders_count ?? 0)} />
                <KpiCard label="Tickets sold" value={String(data.kpis.tickets_sold ?? 0)} />
                <KpiCard
                  label="Tickets remaining"
                  value={String(data.kpis.tickets_remaining ?? 0)}
                />
                <KpiCard
                  label="Attendance rate"
                  value={
                    data.kpis.attendance_rate != null
                      ? formatPercentage(data.kpis.attendance_rate)
                      : '—'
                  }
                />
                <KpiCard
                  label="Outstanding commission"
                  value={money(data.kpis.outstanding_commission, currency)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Today</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Today sales" value={money(data.today.today_sales, currency)} />
                <KpiCard label="Today orders" value={String(data.today.today_orders ?? 0)} />
                <KpiCard label="Today check-ins" value={String(data.today.today_check_ins ?? 0)} />
                <KpiCard label="Today revenue" value={money(data.today.today_revenue, currency)} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Commission</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard label="Due" value={money(data.commission.due, currency)} />
                <KpiCard label="Paid" value={money(data.commission.paid, currency)} />
                <KpiCard label="Outstanding" value={money(data.commission.outstanding, currency)} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Upcoming events</h2>
              <EventsList events={data.events} />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Latest orders</h2>
              <OrdersList orders={data.latest_orders} currency={currency} />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Latest check-ins</h2>
              <CheckInsList checkIns={data.latest_check_ins} />
            </div>
          </>
        ) : null}
      </Container>
    </Section>
  );
}
