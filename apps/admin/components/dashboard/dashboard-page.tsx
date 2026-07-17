'use client';

import { useRouter } from 'next/navigation';
import { ApiError } from '@event-platform/api-client/core';
import { useAuth } from '@event-platform/auth';
import { formatCurrency, formatDateTime } from '@event-platform/shared';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@event-platform/ui';
import { Container, ErrorState, LoadingState, Section } from '@event-platform/ui/layout';
import { useAdminDashboardQuery } from '@/components/dashboard/dashboard.query';
import type {
  AdminDashboardAlert,
  AdminDashboardCheckIn,
  AdminDashboardOrder,
  AdminDashboardPayment,
  AdminDashboardTopEvent,
  AdminDashboardTopVenue,
} from '@/components/dashboard/dashboard.query';

function money(amount: string | undefined | null, currency: string | undefined): string {
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

function alertBadgeVariant(
  severity: AdminDashboardAlert['severity'],
): 'secondary' | 'warning' | 'danger' {
  if (severity === 'danger') return 'danger';
  if (severity === 'warning') return 'warning';
  return 'secondary';
}

function AlertsList({ alerts }: { alerts: AdminDashboardAlert[] }) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">Alerts</h2>
      <ul className="list-none space-y-3 p-0">
        {alerts.map((alert, index) => (
          <li
            key={`${alert.type ?? 'alert'}-${index}`}
            className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
          >
            <p className="font-medium">{alert.message ?? '—'}</p>
            {alert.severity ? (
              <Badge variant={alertBadgeVariant(alert.severity)}>{alert.severity}</Badge>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopVenuesList({
  venues,
  currency,
}: {
  venues: AdminDashboardTopVenue[];
  currency: string | undefined;
}) {
  if (venues.length === 0) {
    return <SectionEmpty />;
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {venues.map((venue) => (
        <li
          key={venue.venue_id ?? venue.venue_name}
          className="space-y-1 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
        >
          <p className="font-medium">{venue.venue_name ?? '—'}</p>
          <p className="text-muted-foreground">
            Gross: {money(venue.gross_sales, currency)} · Outstanding:{' '}
            {money(venue.outstanding_commission, currency)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function TopEventsList({
  events,
  currency,
}: {
  events: AdminDashboardTopEvent[];
  currency: string | undefined;
}) {
  if (events.length === 0) {
    return <SectionEmpty />;
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {events.map((event) => (
        <li
          key={event.event_id ?? event.event_name}
          className="space-y-1 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
        >
          <p className="font-medium">{event.event_name ?? '—'}</p>
          <p className="text-muted-foreground">{event.venue_name ?? '—'}</p>
          <p className="text-muted-foreground">
            Gross: {money(event.gross_sales, currency)} · Sold: {event.tickets_sold ?? 0}
          </p>
        </li>
      ))}
    </ul>
  );
}

function OrdersList({
  orders,
  currency,
}: {
  orders: AdminDashboardOrder[];
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
            <p className="text-muted-foreground">{order.venue_name ?? '—'}</p>
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

function PaymentsList({ payments }: { payments: AdminDashboardPayment[] }) {
  if (payments.length === 0) {
    return <SectionEmpty />;
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {payments.map((payment) => (
        <li
          key={payment.id ?? `${payment.order_number}-${payment.verified_at}`}
          className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
        >
          <div className="space-y-1">
            <p className="font-medium">{payment.venue_name ?? '—'}</p>
            <p className="text-muted-foreground">{payment.order_number ?? '—'}</p>
            <p className="text-muted-foreground">{payment.provider ?? '—'}</p>
            <p className="text-muted-foreground">
              {payment.verified_at ? formatDateTime(payment.verified_at) : '—'}
            </p>
          </div>
          <div className="space-y-2 text-right">
            <p className="font-medium">{money(payment.amount, payment.currency)}</p>
            {payment.status ? <Badge variant="secondary">{payment.status}</Badge> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function CheckInsList({ checkIns }: { checkIns: AdminDashboardCheckIn[] }) {
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
            <p className="text-muted-foreground">{checkIn.venue_name ?? '—'}</p>
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
  const { data, isLoading, isError, error, refetch } = useAdminDashboardQuery();

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
          <LoadingState title="Loading dashboard" description="Fetching platform overview." />
        ) : null}

        {isError ? (
          error instanceof ApiError && error.status === 403 ? (
            <ErrorState
              title="Super Admin access required"
              description="Only Super Admin accounts can view the platform dashboard."
            />
          ) : (
            <ErrorState
              title="Unable to load dashboard"
              description="We could not load the admin dashboard right now. Please try again."
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard label="Gross revenue" value={money(data.kpis.gross_revenue, currency)} />
                <KpiCard label="Net revenue" value={money(data.kpis.net_revenue, currency)} />
                <KpiCard label="Commission due" value={money(data.kpis.commission_due, currency)} />
                <KpiCard
                  label="Commission paid"
                  value={money(data.kpis.commission_paid, currency)}
                />
                <KpiCard
                  label="Outstanding commission"
                  value={money(data.kpis.outstanding_commission, currency)}
                />
                <KpiCard label="Active events" value={String(data.kpis.active_events ?? 0)} />
                <KpiCard label="Active venues" value={String(data.kpis.active_venues ?? 0)} />
                <KpiCard label="Orders" value={String(data.kpis.orders_count ?? 0)} />
                <KpiCard label="Tickets sold" value={String(data.kpis.tickets_sold ?? 0)} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Today</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard label="Today sales" value={money(data.today.today_sales, currency)} />
                <KpiCard label="Today revenue" value={money(data.today.today_revenue, currency)} />
                <KpiCard label="Today orders" value={String(data.today.today_orders ?? 0)} />
                <KpiCard label="Today check-ins" value={String(data.today.today_check_ins ?? 0)} />
                <KpiCard
                  label="Events starting today"
                  value={String(data.today.events_starting_today ?? 0)}
                />
              </div>
            </div>

            <AlertsList alerts={data.alerts} />

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight">Top venues</h2>
                <TopVenuesList venues={data.top_venues} currency={currency} />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight">Top events</h2>
                <TopEventsList events={data.top_events} currency={currency} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Latest orders</h2>
              <OrdersList orders={data.latest_orders} currency={currency} />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Latest payments</h2>
              <PaymentsList payments={data.latest_payments} />
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
