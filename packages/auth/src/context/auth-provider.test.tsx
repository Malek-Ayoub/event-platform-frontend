import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { AuthProvider } from './auth-provider.js';
import { useAuth } from './use-auth.js';
import { MemorySessionStorage } from '../session/memory-session-storage.js';
import type { Session } from '../types/session.js';

const baseSession: Session = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    permissions: ['reports.view'],
  },
  accessToken: 'opaque-token',
};

function AuthStateProbe() {
  const { user, accessToken, isAuthenticated, isLoading } = useAuth();

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="email">{user?.email ?? 'none'}</span>
      <span data-testid="token">{accessToken ?? 'none'}</span>
    </div>
  );
}

function AuthActions() {
  const { login, logout, updateUser } = useAuth();

  return (
    <div>
      <button type="button" onClick={() => login(baseSession)}>
        login
      </button>
      <button type="button" onClick={() => logout()}>
        logout
      </button>
      <button type="button" onClick={() => updateUser({ name: 'Updated User' })}>
        update
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  afterEach(() => {
    cleanup();
  });

  it('starts unauthenticated without a stored session', () => {
    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('email').textContent).toBe('none');
  });

  it('hydrates from session storage', () => {
    const storage = new MemorySessionStorage();
    storage.set(baseSession);

    render(
      <AuthProvider storage={storage}>
        <AuthStateProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('email').textContent).toBe('test@example.com');
    expect(screen.getByTestId('token').textContent).toBe('opaque-token');
  });

  it('supports login, logout, and updateUser without network access', async () => {
    const user = userEvent.setup();
    const storage = new MemorySessionStorage();

    render(
      <AuthProvider storage={storage}>
        <AuthStateProbe />
        <AuthActions />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'login' }));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    expect(storage.get()?.user.email).toBe('test@example.com');

    await user.click(screen.getByRole('button', { name: 'update' }));

    await waitFor(() => {
      expect(storage.get()?.user.name).toBe('Updated User');
    });

    await user.click(screen.getByRole('button', { name: 'logout' }));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });

    expect(storage.get()).toBeNull();
  });
});
