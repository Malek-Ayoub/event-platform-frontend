import type { ReactNode } from 'react';
import { useAuth } from '../context/use-auth.js';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '../permissions/permission-engine.js';
import type { Permission } from '../types/permission.js';

export type PermissionGuardMode = 'any' | 'all';

export type PermissionGuardProps = {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  mode?: PermissionGuardMode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
};

function evaluatePermissions(
  user: ReturnType<typeof useAuth>['user'],
  permission: Permission | undefined,
  permissions: Permission[],
  mode: PermissionGuardMode,
): boolean {
  if (permission) {
    return hasPermission(user, permission);
  }

  if (permissions.length === 0) {
    return false;
  }

  return mode === 'all'
    ? hasAllPermissions(user, permissions)
    : hasAnyPermission(user, permissions);
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  mode = 'any',
  fallback = null,
  loadingFallback = null,
}: PermissionGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  const allowed = evaluatePermissions(user, permission, permissions, mode);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
