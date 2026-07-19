'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ApiError } from '@event-platform/api-client/core';
import { Badge, Button } from '@event-platform/ui';
import { Container, ErrorState, LoadingState, Section } from '@event-platform/ui/layout';
import {
  useVenuesQuery,
  type VenueResource,
  type VenueStatus,
} from '@/components/venues/venues.query';

function parsePageFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get('page');
  const parsed = raw ? Number.parseInt(raw, 10) : 1;

  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

function statusBadgeVariant(
  status: VenueStatus | undefined,
): 'success' | 'warning' | 'danger' | 'secondary' {
  if (status === 'active') return 'success';
  if (status === 'suspended') return 'danger';
  if (status === 'pending') return 'warning';
  return 'secondary';
}

function VenueRow({ venue }: { venue: VenueResource }) {
  const id = venue.id;

  if (id == null) {
    return null;
  }

  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-3 pr-4">
        <Link href={`/venues/${id}`} className="font-medium hover:underline">
          {venue.name ?? '—'}
        </Link>
      </td>
      <td className="py-3 pr-4 font-mono text-sm text-muted-foreground">
        {venue.subdomain ?? '—'}
      </td>
      <td className="py-3 pr-4">
        {venue.status ? (
          <Badge variant={statusBadgeVariant(venue.status)}>{venue.status}</Badge>
        ) : (
          '—'
        )}
      </td>
      <td className="py-3 text-sm">{venue.commission_rate ?? '—'}</td>
    </tr>
  );
}

export function VenuesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = useMemo(() => parsePageFromSearchParams(searchParams), [searchParams]);

  const { data: result, isLoading, isError, error, refetch } = useVenuesQuery(page);
  const venues = result?.data;
  const meta = result?.meta;

  const goToPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextPage <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(nextPage));
      }

      const query = params.toString();
      router.push(query ? `/venues?${query}` : '/venues', { scroll: false });
    },
    [router, searchParams],
  );

  const showPagination =
    !isLoading && !isError && venues && venues.length > 0 && meta && meta.last_page > 1;

  return (
    <Section spacing="lg" variant="muted" aria-label="Venues list">
      <Container className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Venues</h1>
            <p className="text-sm text-muted-foreground">Manage platform venues.</p>
          </div>
          <Button type="button" asChild>
            <Link href="/venues/new">Create venue</Link>
          </Button>
        </div>

        {isLoading ? (
          <LoadingState title="Loading venues" description="Fetching venue list." />
        ) : null}

        {isError ? (
          error instanceof ApiError && error.status === 403 ? (
            <ErrorState
              title="Super Admin access required"
              description="Only Super Admin accounts can list venues."
            />
          ) : (
            <ErrorState
              title="Unable to load venues"
              description="We could not load venues right now. Please try again."
              action={
                <Button type="button" onClick={() => void refetch()}>
                  Retry
                </Button>
              }
            />
          )
        ) : null}

        {!isLoading && !isError && venues && venues.length === 0 ? (
          <div className="space-y-3" data-slot="venues-empty">
            <p className="text-sm text-muted-foreground">No venues yet</p>
            <Button type="button" variant="outline" asChild>
              <Link href="/venues/new">Create venue</Link>
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && venues && venues.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm" data-slot="venues-table">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Subdomain</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 font-medium">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((venue) => (
                    <VenueRow key={venue.id} venue={venue} />
                  ))}
                </tbody>
              </table>
            </div>

            {showPagination && meta ? (
              <nav
                aria-label="Venues pagination"
                className="flex items-center justify-center gap-4"
                data-slot="venues-pagination"
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={meta.current_page <= 1}
                  onClick={() => goToPage(meta.current_page - 1)}
                >
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => goToPage(meta.current_page + 1)}
                >
                  Next
                </Button>
              </nav>
            ) : null}
          </>
        ) : null}
      </Container>
    </Section>
  );
}
