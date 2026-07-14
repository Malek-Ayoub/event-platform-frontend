import Link from 'next/link';
import { Button } from '@event-platform/ui';
import { Container, NotFoundState, Section } from '@event-platform/ui/layout';

export default function SiteNotFound() {
  return (
    <Section spacing="lg">
      <Container>
        <NotFoundState
          action={
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
          }
        />
      </Container>
    </Section>
  );
}
