import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApiError } from '@event-platform/api-client/core';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import { LoginForm } from './LoginForm';

const mockNavigate = vi.fn();
const mockLoginTenant = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
    name: 'Scanner User',
    email: 'scanner@venue.com',
    permissions: [],
    isSuperAdmin: false,
  },
};

describe('LoginForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('logs in and navigates to /scan on success', async () => {
    mockLoginTenant.mockResolvedValue(SESSION);
    const storage = new MemorySessionStorage();

    render(
      <MemoryRouter>
        <AuthProvider storage={storage}>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'scanner@venue.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockLoginTenant).toHaveBeenCalledWith({
        email: 'scanner@venue.com',
        password: 'secret-password',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/scan');
    });

    expect(storage.get()?.user.email).toBe('scanner@venue.com');
  });

  it('shows an error message when login returns 401', async () => {
    mockLoginTenant.mockRejectedValue(new ApiError('Unauthorized', { status: 401 }));

    render(
      <MemoryRouter>
        <AuthProvider storage={new MemorySessionStorage()}>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'scanner@venue.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('Invalid email or password');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
  });
});
