import type { Permission } from '../types/permission.js';
import type { User } from '../types/user.js';

function isAuthorized(user: User | null): user is User {
  return user !== null;
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!isAuthorized(user)) {
    return false;
  }

  if (user.isSuperAdmin) {
    return true;
  }

  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}
