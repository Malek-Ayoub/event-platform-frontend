import Link from 'next/link';
import { Button } from '@event-platform/ui';
import { Container, Section } from '@event-platform/ui/layout';
import type { LandingSectionProps } from '@/components/landing/types';

export function CTASection({ className }: LandingSectionProps) {
  return (
    <Section spacing="lg" variant="muted" aria-label="Call to action" className={className}>
      <Container>
        <div className="max-w-2xl space-y-6" data-slot="cta-section-content">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to find your next event?
            </h2>
            <p className="text-muted-foreground">
              Browse upcoming events, discover what is happening near you, and book your next
              experience.
            </p>
          </div>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
