import { Container, Section } from '@event-platform/ui/layout';

export function EventsHeader() {
  return (
    <Section spacing="lg" aria-label="Events">
      <Container>
        <div className="space-y-2" data-slot="events-header-content">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Events</h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse upcoming events and discover what is happening near you.
          </p>
        </div>
      </Container>
    </Section>
  );
}
