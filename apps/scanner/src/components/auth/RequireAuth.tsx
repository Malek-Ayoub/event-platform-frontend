import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthGuard } from '@event-platform/auth';
import { LoadingState } from '@event-platform/ui/layout';

function RedirectToLogin() {
  return <Navigate to="/login" replace />;
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
