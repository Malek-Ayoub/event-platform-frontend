import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@event-platform/ui';
import { Container, Section } from '@event-platform/ui/layout';
import type { LandingSectionProps, VenueHighlight } from '@/components/landing/types';
import { getVenueHighlights } from '@/lib/mock-data/venue-highlights';

function VenueHighlightImage({ venue }: { venue: VenueHighlight }) {
  if (venue.imageUrl) {
    return (
      <img
        src={venue.imageUrl}
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
      {venue.name.charAt(0)}
    </div>
  );
}

function VenueHighlightCard({ venue }: { venue: VenueHighlight }) {
  const titleId = `venue-highlight-${venue.id}-title`;

  return (
    <article aria-labelledby={titleId}>
      <Card className="h-full overflow-hidden">
        <VenueHighlightImage venue={venue} />
        <CardHeader>
          <CardTitle id={titleId}>{venue.name}</CardTitle>
          <CardDescription>{venue.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{venue.city}</p>
        </CardContent>
      </Card>
    </article>
  );
}

function VenueHighlightsEmptyState() {
  return (
    <div className="max-w-2xl space-y-2" data-slot="venue-highlights-empty-state" role="status">
      <p className="text-lg font-semibold tracking-tight">No venue highlights right now</p>
      <p className="text-muted-foreground">
        Check back soon for popular venues hosting upcoming events.
      </p>
    </div>
  );
}

export function VenueHighlightsSection({ className }: LandingSectionProps) {
  const venues = getVenueHighlights();

  return (
    <Section spacing="lg" aria-label="Venue highlights" className={className}>
      <Container>
        <div className="space-y-8" data-slot="venue-highlights-section-content">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Venue highlights</h2>
            <p className="max-w-2xl text-muted-foreground">
              Explore popular venues hosting memorable events near you.
            </p>
          </div>

          {venues.length === 0 ? (
            <VenueHighlightsEmptyState />
          ) : (
            <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {venues.map((venue) => (
                <li key={venue.id}>
                  <VenueHighlightCard venue={venue} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
