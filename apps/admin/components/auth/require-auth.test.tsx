import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import type { Session } from '@event-platform/auth';
import { RequireAuth } from './require-auth';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn() }),
}));

const SESSION: Session = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@platform.com',
    permissions: [],
    isSuperAdmin: true,
  },
};

describe('RequireAuth', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('redirects unauthenticated users to /login', async () => {
    render(
      <AuthProvider storage={new MemorySessionStorage()}>
        <RequireAuth>
          <div>protected content</div>
        </RequireAuth>
      </AuthProvider>,
    );

    expect(screen.queryByText('protected content')).toBeNull();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  it('renders children when authenticated', () => {
    const storage = new MemorySessionStorage();
    storage.set(SESSION);

    render(
      <AuthProvider storage={storage}>
        <RequireAuth>
          <div>protected content</div>
        </RequireAuth>
      </AuthProvider>,
    );

    expect(screen.getByText('protected content')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
