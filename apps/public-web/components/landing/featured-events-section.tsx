import { Container, Section } from '@event-platform/ui/layout';

export function FeaturedEventsSection() {
  return (
    <Section spacing="lg" variant="muted" aria-label="Featured events">
      <Container>
        <div data-slot="featured-events-section-content">
          <h2 className="text-2xl font-semibold tracking-tight">Featured events</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Featured events section placeholder.
          </p>
        </div>
      </Container>
    </Section>
  );
}
