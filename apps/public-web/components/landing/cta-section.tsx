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
              Ready to host your next event?
            </h2>
            <p className="text-muted-foreground">
              Join the platform to publish events, manage venues, and reach audiences ready to book.
            </p>
          </div>
          {/*
            Visual-only CTA until a real registration/onboarding route exists.
            Disabled prevents misleading navigation to a page that is not implemented yet.
          */}
          <Button disabled type="button">
            Get started
          </Button>
        </div>
      </Container>
    </Section>
  );
}
