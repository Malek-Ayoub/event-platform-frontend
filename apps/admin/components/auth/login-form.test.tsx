import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import { LoginForm } from './login-form';

const mockPush = vi.fn();
const mockLoginPublic = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@event-platform/api-client/react', () => ({
  usePublicApiClient: () => ({}),
}));

vi.mock('@event-platform/api-client/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@event-platform/api-client/core')>();

  return {
    ...actual,
    ApiAuthAdapter: vi.fn().mockImplementation(() => ({
      loginPublic: mockLoginPublic,
    })),
  };
});

const SESSION = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@platform.com',
    permissions: [],
    isSuperAdmin: true,
  },
};

describe('LoginForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('logs in via loginPublic and redirects to the dashboard on success', async () => {
    mockLoginPublic.mockResolvedValue(SESSION);
    const storage = new MemorySessionStorage();

    render(
      <AuthProvider storage={storage}>
        <LoginForm />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@platform.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockLoginPublic).toHaveBeenCalledWith({
        email: 'admin@platform.com',
        password: 'secret-password',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    expect(storage.get()?.user.email).toBe('admin@platform.com');
  });

  it('shows an error message when login returns 401', async () => {
    mockLoginPublic.mockRejectedValue(new ApiError('Unauthorized', { status: 401 }));

    render(
      <AuthProvider storage={new MemorySessionStorage()}>
        <LoginForm />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@platform.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('Invalid email or password');
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
  });
});
