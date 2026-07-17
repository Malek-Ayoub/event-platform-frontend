'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@event-platform/auth';
import { LoadingState } from '@event-platform/ui/layout';

function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return <LoadingState title="Redirecting" description="Taking you to sign in." />;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <AuthGuard
      fallback={<RedirectToLogin />}
      loadingFallback={
        <LoadingState title="Checking session" description="Verifying your sign-in." />
      }
    >
      {children}
    </AuthGuard>
  );
}
