import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, MemorySessionStorage } from '@event-platform/auth';
import type { Session } from '@event-platform/auth';
import { RequireAuth } from './RequireAuth';

const SESSION: Session = {
  accessToken: 'token-1',
  user: {
    id: '1',
    name: 'Scanner User',
    email: 'scanner@venue.com',
    permissions: [],
  },
};

describe('RequireAuth', () => {
  afterEach(() => {
    cleanup();
  });

  it('redirects unauthenticated users to /login', () => {
    render(
      <MemoryRouter initialEntries={['/scan']}>
        <AuthProvider storage={new MemorySessionStorage()}>
          <Routes>
            <Route
              path="/scan"
              element={
                <RequireAuth>
                  <div>protected content</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>login page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText('protected content')).toBeNull();
    expect(screen.getByText('login page')).toBeTruthy();
  });

  it('renders children when authenticated', () => {
    const storage = new MemorySessionStorage();
    storage.set(SESSION);

    render(
      <MemoryRouter initialEntries={['/scan']}>
        <AuthProvider storage={storage}>
          <Routes>
            <Route
              path="/scan"
              element={
                <RequireAuth>
                  <div>protected content</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>login page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('protected content')).toBeTruthy();
    expect(screen.queryByText('login page')).toBeNull();
  });
});
