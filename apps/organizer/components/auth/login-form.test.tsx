import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@event-platform/api-client/core';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import { LoginForm } from './login-form';

const mockPush = vi.fn();
const mockLoginTenant = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@event-platform/api-client/react', () => ({
  usePublicApiClient: () => ({}),
  useTenantApiClient: () => ({}),
}));

vi.mock('@event-platform/api-client/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@event-platform/api-client/core')>();

  return {
    ...actual,
    ApiAuthAdapter: vi.fn().mockImplementation(() => ({
      loginTenant: mockLoginTenant,
    })),
  };
});

const SESSION = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Jane Organizer',
    email: 'jane@venue.com',
    permissions: [],
    isSuperAdmin: false,
  },
};

describe('LoginForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('logs in and redirects to the dashboard on success', async () => {
    mockLoginTenant.mockResolvedValue(SESSION);
    const storage = new MemorySessionStorage();

    render(
      <AuthProvider storage={storage}>
        <LoginForm />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@venue.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockLoginTenant).toHaveBeenCalledWith({
        email: 'jane@venue.com',
        password: 'secret-password',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    expect(storage.get()?.user.email).toBe('jane@venue.com');
  });

  it('shows an error message when login returns 401', async () => {
    mockLoginTenant.mockRejectedValue(new ApiError('Unauthorized', { status: 401 }));

    render(
      <AuthProvider storage={new MemorySessionStorage()}>
        <LoginForm />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@venue.com' },
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
