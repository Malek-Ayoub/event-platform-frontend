import type { ReactNode } from 'react';
import { useAuth } from '../context/use-auth.js';

export type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
};

export function AuthGuard({ children, fallback = null, loadingFallback = null }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
