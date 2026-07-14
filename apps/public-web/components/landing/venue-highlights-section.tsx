import { Container, Section } from '@event-platform/ui/layout';
import type { LandingSectionProps } from '@/components/landing/types';

export function VenueHighlightsSection(_props: LandingSectionProps) {
  return (
    <Section spacing="lg" aria-label="Venue highlights">
      <Container>
        <div data-slot="venue-highlights-section-content">
          <h2 className="text-2xl font-semibold tracking-tight">Venue highlights</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Venue highlights section placeholder.
          </p>
        </div>
      </Container>
    </Section>
  );
}
