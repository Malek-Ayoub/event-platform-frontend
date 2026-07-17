import { LoginForm } from '@/components/auth/login-form';
import { Container, Section } from '@event-platform/ui/layout';

export default function LoginPage() {
  return (
    <Section spacing="lg" variant="muted" aria-label="Login">
      <Container>
        <LoginForm />
      </Container>
    </Section>
  );
}
