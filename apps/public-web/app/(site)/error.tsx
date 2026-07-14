'use client';

import { Button } from '@event-platform/ui';
import { Container, ErrorState, Section } from '@event-platform/ui/layout';

export type SiteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SiteError({ error, reset }: SiteErrorProps) {
  return (
    <Section spacing="lg">
      <Container>
        <ErrorState
          title="Something went wrong"
          description={error.message || 'An unexpected error occurred. Please try again.'}
          action={
            <Button type="button" onClick={reset}>
              Try again
            </Button>
          }
        />
      </Container>
    </Section>
  );
}
