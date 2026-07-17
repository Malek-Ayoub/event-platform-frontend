'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@event-platform/auth';
import { Button } from '@event-platform/ui';
import { Container, Section } from '@event-platform/ui/layout';

export function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Section spacing="lg" variant="muted" aria-label="Dashboard">
      <Container className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Dashboard coming soon</p>
          </div>
          <Button type="button" variant="outline" onClick={() => void handleLogout()}>
            Logout
          </Button>
        </div>

        {user ? (
          <div className="space-y-1 text-sm">
            <p>
              Signed in as <span className="font-medium">{user.name}</span>
            </p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
