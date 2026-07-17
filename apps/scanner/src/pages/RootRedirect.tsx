import { Navigate } from 'react-router-dom';
import { useAuth } from '@event-platform/auth';
import { LoadingState } from '@event-platform/ui/layout';

export function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState title="Loading" description="Checking your session." />;
  }

  return <Navigate to={isAuthenticated ? '/scan' : '/login'} replace />;
}
