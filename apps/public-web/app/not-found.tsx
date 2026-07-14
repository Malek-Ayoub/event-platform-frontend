import { Container, NotFoundState, Section } from '@event-platform/ui/layout';

export default function RootNotFound() {
  return (
    <Section spacing="md">
      <Container>
        <NotFoundState description="This URL does not match any page in the application." />
      </Container>
    </Section>
  );
}
