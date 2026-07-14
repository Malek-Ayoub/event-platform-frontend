import { Container, Section } from '@event-platform/ui/layout';
import type { LandingSectionProps } from '@/components/landing/types';

export function CTASection(_props: LandingSectionProps) {
  return (
    <Section spacing="lg" variant="muted" aria-label="Call to action">
      <Container>
        <div data-slot="cta-section-content">
          <h2 className="text-2xl font-semibold tracking-tight">Get started</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Call to action section placeholder.
          </p>
        </div>
      </Container>
    </Section>
  );
}
