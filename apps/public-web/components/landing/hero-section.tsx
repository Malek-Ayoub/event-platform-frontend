import { Container, Section } from '@event-platform/ui/layout';

export function HeroSection() {
  return (
    <Section spacing="lg" aria-label="Hero">
      <Container>
        <div data-slot="hero-section-content">
          <h2 className="text-2xl font-semibold tracking-tight">Hero</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Landing hero section placeholder.</p>
        </div>
      </Container>
    </Section>
  );
}
