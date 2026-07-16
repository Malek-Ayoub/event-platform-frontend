'use client';

import Link from 'next/link';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@event-platform/ui';
import {
  Container,
  ErrorState,
  LoadingState,
  NotFoundState,
  Section,
} from '@event-platform/ui/layout';
import { ApiError } from '@event-platform/api-client/core';
import { formatDateTime } from '@event-platform/shared';
import { useEventDetailQuery } from '@/components/events/events.query';
import type { EventDetailViewModel } from '@/components/events/events.query';

function TicketTypeCard({
  ticketType,
}: {
  ticketType: EventDetailViewModel['ticketTypes'][number];
}) {
  const badgeText =
    !ticketType.isAvailable && ticketType.remaining <= 0 ? 'Sold out' : 'Not available';
  const badgeVariant = badgeText === 'Sold out' ? 'danger' : 'secondary';

  return (
    <li>
      <Card className="h-full overflow-hidden">
        <div className="flex items-stretch">
          <div
            className="w-2 bg-primary"
            aria-hidden="true"
            style={ticketType.color ? { backgroundColor: ticketType.color } : undefined}
          />

          <div className="flex-1">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle>{ticketType.name}</CardTitle>

                {!ticketType.isAvailable ? (
                  <Badge variant={badgeVariant} aria-label={badgeText}>
                    {badgeText}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm font-medium">{ticketType.priceLabel}</p>

              {ticketType.isAvailable ? (
                <p className="text-sm text-muted-foreground">Remaining: {ticketType.remaining}</p>
              ) : null}

              {ticketType.benefits && ticketType.benefits.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {ticketType.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </div>
        </div>
      </Card>
    </li>
  );
}

export function EventDetailPage({ slug }: { slug: string }) {
  const { data: event, isLoading, isError, error, refetch } = useEventDetailQuery(slug);

  return (
    <Section spacing="lg" variant="muted" aria-label="Event detail">
      <Container className="space-y-6">
        {isLoading ? (
          <LoadingState title="Loading event" description="Fetching event details." />
        ) : null}

        {isError ? (
          error instanceof ApiError && error.status === 404 ? (
            <NotFoundState
              action={
                <Button asChild>
                  <Link href="/events">Back to events</Link>
                </Button>
              }
            />
          ) : (
            <ErrorState
              title="Unable to load event"
              description="We could not load this event right now. Please try again later."
              action={
                <Button type="button" onClick={() => void refetch()}>
                  Retry
                </Button>
              }
            />
          )
        ) : null}

        {!isLoading && !isError && event ? (
          <div className="space-y-6">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt=""
                aria-hidden="true"
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex aspect-[16/9] w-full items-center justify-center bg-primary text-4xl font-semibold text-primary-foreground"
              >
                {event.title.charAt(0)}
              </div>
            )}

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
              <p className="text-sm text-muted-foreground">{event.venue}</p>
              <p className="text-sm text-muted-foreground">
                {event.endDatetime
                  ? `${event.dateLabel} - ${formatDateTime(event.endDatetime)}`
                  : event.dateLabel}
              </p>
              <p className="text-sm leading-relaxed">{event.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Ticket types</h2>

              <ul className="grid list-none gap-4 md:grid-cols-2">
                {event.ticketTypes.map((ticketType) => (
                  <TicketTypeCard key={ticketType.id} ticketType={ticketType} />
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
