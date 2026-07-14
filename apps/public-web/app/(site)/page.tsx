import { Container, Section } from '@event-platform/ui/layout';

export default function HomePage() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Sprint 1.1 — Application Shell
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">public-web</h1>
          <p className="max-w-2xl text-muted-foreground">
            Layout foundation is active. Business screens will be added in later sprints.
          </p>
        </div>
      </Container>
    </Section>
  );
}
