import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@event-platform/ui';
import { Container, Section } from '@event-platform/ui/layout';
import { SectionEmptyState } from '@/components/landing/section-empty-state';
import type { FeaturedEvent, LandingSectionProps } from '@/components/landing/types';
import { getFeaturedEvents } from '@/lib/mock-data/featured-events';

function formatEventDate(isoDatetime: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDatetime));
}

function FeaturedEventBanner({ event }: { event: FeaturedEvent }) {
  if (event.bannerUrl) {
    return (
      <img
        src={event.bannerUrl}
        alt=""
        aria-hidden="true"
        className="aspect-[16/9] w-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex aspect-[16/9] w-full items-center justify-center bg-primary text-4xl font-semibold text-primary-foreground"
    >
      {event.name.charAt(0)}
    </div>
  );
}

function FeaturedEventCard({ event }: { event: FeaturedEvent }) {
  const titleId = `featured-event-${event.id}-title`;

  return (
    <article aria-labelledby={titleId}>
      <Card className="h-full overflow-hidden">
        <FeaturedEventBanner event={event} />
        <CardHeader>
          <CardTitle id={titleId}>{event.name}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <time className="text-sm text-muted-foreground" dateTime={event.startDatetime}>
            {formatEventDate(event.startDatetime)}
          </time>
        </CardContent>
      </Card>
    </article>
  );
}

export function FeaturedEventsSection({ className }: LandingSectionProps) {
  const events = getFeaturedEvents();

  return (
    <Section spacing="lg" variant="muted" aria-label="Featured events" className={className}>
      <Container>
        <div className="space-y-8" data-slot="featured-events-section-content">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Featured events</h2>
            <p className="max-w-2xl text-muted-foreground">
              Discover upcoming events curated for you.
            </p>
          </div>

          {events.length === 0 ? (
            <SectionEmptyState
              sectionName="featured-events"
              title="No featured events right now"
              description="Check back soon for upcoming events you can discover and book."
            />
          ) : (
            <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <li key={event.id}>
                  <FeaturedEventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
