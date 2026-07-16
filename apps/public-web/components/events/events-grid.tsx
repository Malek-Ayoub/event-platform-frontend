'use client';

import { Button } from '@event-platform/ui';
import { Container, ErrorState, LoadingState, Section } from '@event-platform/ui/layout';
import { EventCard } from '@/components/events/event-card';
import { usePublicEventsQuery } from '@/components/events/events.query';
import { SectionEmptyState } from '@/components/landing/section-empty-state';

export function EventsGrid() {
  const { data: events, isLoading, isError, refetch } = usePublicEventsQuery();

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
        ) : null}
      </Container>
    </Section>
  );
}
