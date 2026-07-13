import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AuthProvider } from '../context/auth-provider.js';
import { AuthGuard } from './auth-guard.js';
import { GuestGuard } from './guest-guard.js';
import { PermissionGuard } from './permission-guard.js';
import { MemorySessionStorage } from '../session/memory-session-storage.js';
import type { Session } from '../types/session.js';

const session: Session = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    permissions: ['reports.view'],
  },
  accessToken: 'opaque-token',
};

describe('route guards', () => {
  afterEach(() => {
    cleanup();
  });

  it('AuthGuard blocks guests', () => {
    render(
      <AuthProvider storage={new MemorySessionStorage()}>
        <AuthGuard fallback={<div>denied</div>}>
          <div>protected</div>
        </AuthGuard>
      </AuthProvider>,
    );

    expect(screen.getByText('denied')).toBeTruthy();
    expect(screen.queryByText('protected')).toBeNull();
  });

  it('AuthGuard allows authenticated users', () => {
    const storage = new MemorySessionStorage();
    storage.set(session);

    render(
      <AuthProvider storage={storage}>
        <AuthGuard fallback={<div>denied</div>}>
          <div>protected</div>
        </AuthGuard>
      </AuthProvider>,
    );

    expect(screen.getByText('protected')).toBeTruthy();
  });

  it('GuestGuard blocks authenticated users', () => {
    const storage = new MemorySessionStorage();
    storage.set(session);

    render(
      <AuthProvider storage={storage}>
        <GuestGuard fallback={<div>already-signed-in</div>}>
          <div>guest-area</div>
        </GuestGuard>
      </AuthProvider>,
    );

    expect(screen.getByText('already-signed-in')).toBeTruthy();
    expect(screen.queryByText('guest-area')).toBeNull();
  });

  it('PermissionGuard checks a required permission', () => {
    const storage = new MemorySessionStorage();
    storage.set(session);

    render(
      <AuthProvider storage={storage}>
        <PermissionGuard permission="reports.view" fallback={<div>forbidden</div>}>
          <div>reports</div>
        </PermissionGuard>
      </AuthProvider>,
    );

    expect(screen.getByText('reports')).toBeTruthy();

    const deniedStorage = new MemorySessionStorage();
    deniedStorage.set({
      ...session,
      user: {
        ...session.user,
        permissions: [],
      },
    });

    render(
      <AuthProvider storage={deniedStorage}>
        <PermissionGuard permission="reports.view" fallback={<div>forbidden</div>}>
          <div>reports</div>
        </PermissionGuard>
      </AuthProvider>,
    );

    expect(screen.getByText('forbidden')).toBeTruthy();
  });
});
