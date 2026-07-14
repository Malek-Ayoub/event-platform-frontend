import { Container, LoadingState, Section } from '@event-platform/ui/layout';

export default function SiteLoading() {
  return (
    <Section spacing="lg">
      <Container>
        <LoadingState />
      </Container>
    </Section>
  );
}
