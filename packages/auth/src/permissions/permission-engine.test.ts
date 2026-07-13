import { describe, expect, it } from 'vitest';
import { hasAllPermissions, hasAnyPermission, hasPermission } from './permission-engine.js';
import type { User } from '../types/user.js';

const user: User = {
  id: 'user-1',
  name: 'Staff',
  email: 'staff@example.com',
  role: 'staff',
  permissions: ['reports.view', 'events.manage'],
};

describe('permission engine', () => {
  it('checks a single permission', () => {
    expect(hasPermission(user, 'reports.view')).toBe(true);
    expect(hasPermission(user, 'orders.manage')).toBe(false);
    expect(hasPermission(null, 'reports.view')).toBe(false);
  });

  it('grants all permissions to super admins', () => {
    const admin: User = {
      ...user,
      isSuperAdmin: true,
      permissions: [],
    };

    expect(hasPermission(admin, 'orders.manage')).toBe(true);
  });

  it('checks any permission', () => {
    expect(hasAnyPermission(user, ['orders.manage', 'reports.view'])).toBe(true);
    expect(hasAnyPermission(user, ['orders.manage', 'refunds.process'])).toBe(false);
  });

  it('checks all permissions', () => {
    expect(hasAllPermissions(user, ['reports.view', 'events.manage'])).toBe(true);
    expect(hasAllPermissions(user, ['reports.view', 'orders.manage'])).toBe(false);
  });
});
