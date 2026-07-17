'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Button } from '@event-platform/ui';
import { Container, ErrorState, LoadingState, Section } from '@event-platform/ui/layout';
import { EventCard } from '@/components/events/event-card';
import { usePublicEventsQuery } from '@/components/events/events.query';
import { SectionEmptyState } from '@/components/landing/section-empty-state';

function parsePageFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get('page');
  const parsed = raw ? Number.parseInt(raw, 10) : 1;

  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export function EventsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = useMemo(() => parsePageFromSearchParams(searchParams), [searchParams]);

  const { data: result, isLoading, isError, refetch } = usePublicEventsQuery({ page });
  const events = result?.data;
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
      router.push(query ? `/events?${query}` : '/events', { scroll: false });
    },
    [router, searchParams],
  );

  const showPagination =
    !isLoading && !isError && events && events.length > 0 && meta && meta.last_page > 1;

  return (
    <Section spacing="lg" variant="muted" aria-label="Events list">
      <Container>
        {isLoading ? (
          <LoadingState title="Loading events" description="Fetching upcoming events." />
        ) : null}

        {isError ? (
          <ErrorState
            title="Unable to load events"
            description="We could not load events right now. Please try again later."
            action={
              <Button type="button" onClick={() => void refetch()}>
                Retry
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && events && events.length === 0 ? (
          <SectionEmptyState
            sectionName="events"
            title="No events available right now"
            description="Check back soon for upcoming events you can discover and book."
          />
        ) : null}

        {!isLoading && !isError && events && events.length > 0 ? (
          <>
            <ul
              className="grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
              data-slot="events-grid-content"
            >
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard {...event} />
                </li>
              ))}
            </ul>

            {showPagination ? (
              <nav
                aria-label="Events pagination"
                className="mt-8 flex items-center justify-center gap-4"
                data-slot="events-pagination"
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
