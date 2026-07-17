import { LoginForm } from '@/components/auth/LoginForm';
import { Container, Section } from '@event-platform/ui/layout';

export function LoginPage() {
  return (
    <Section spacing="lg" variant="muted" aria-label="Login">
      <Container>
        <LoginForm />
      </Container>
    </Section>
  );
}
